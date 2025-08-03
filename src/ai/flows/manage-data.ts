
'use server';
/**
 * @fileOverview An AI agent for managing and provisioning Firebase resources.
 *
 * - manageData - A function that handles data management queries.
 * - ManageDataInput - The input type for the manageData function.
 * - ManageDataOutput - The return type for the manageData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { promises as fs } from 'fs';
import path from 'path';

const ManageDataInputSchema = z.object({
  query: z.string().describe('The user\'s request for provisioning or configuring Firebase resources.'),
});
export type ManageDataInput = z.infer<typeof ManageDataInputSchema>;

const ManageDataOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the query, detailing the actions taken and any next steps for the user.'),
});
export type ManageDataOutput = z.infer<typeof ManageDataOutputSchema>;


const scanProjectAndBuildKnowledgeBase = ai.defineTool(
    {
        name: 'scanProjectAndBuildKnowledgeBase',
        description: 'Scans the project files (package.json, src/lib/constants.ts) to understand dependencies and album content, then writes this knowledge to src/lib/quantum-database.json.',
        inputSchema: z.object({}),
        outputSchema: z.string(),
    },
    async () => {
        try {
            const packageJsonPath = path.join(process.cwd(), 'package.json');
            const constantsPath = path.join(process.cwd(), 'src', 'lib', 'constants.ts');
            const dbPath = path.join(process.cwd(), 'src', 'lib', 'quantum-database.json');

            // Read files
            const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
            const constantsContent = await fs.readFile(constantsPath, 'utf-8');

            // Parse package.json
            const packageData = JSON.parse(packageJsonContent);
            const dependencies = Object.keys(packageData.dependencies);

            // "Parse" constants.ts (simple extraction for prototype)
            const trackRegex = /title:\s*"([^"]+)",\s*duration:\s*"([^"]+)"/g;
            let match;
            const tracks = [];
            while ((match = trackRegex.exec(constantsContent)) !== null) {
                tracks.push({ title: match[1], duration: match[2] });
            }

            // Build knowledge object
            const knowledgeBase = {
                updatedAt: new Date().toISOString(),
                source: "Project Scan",
                project: {
                    name: packageData.name,
                    version: packageData.version,
                    dependencies: dependencies,
                },
                album: {
                    trackCount: tracks.length,
                    tracks: tracks,
                }
            };

            await fs.writeFile(dbPath, JSON.stringify(knowledgeBase, null, 2), 'utf-8');

            return `Successfully scanned the project and built the knowledge base at src/lib/quantum-database.json. The agent can now answer questions about the project.`;
        } catch (error: any) {
            return `Error scanning project: ${error.message}`;
        }
    }
);


const queryKnowledgeBase = ai.defineTool(
    {
        name: 'queryKnowledgeBase',
        description: 'Reads the src/lib/quantum-database.json file to answer questions about the project.',
        inputSchema: z.object({
            question: z.string().describe("The user's question about the project."),
        }),
        outputSchema: z.string(),
    },
    async ({ question }) => {
         try {
            const dbPath = path.join(process.cwd(), 'src', 'lib', 'quantum-database.json');
            const dbContent = await fs.readFile(dbPath, 'utf-8');
            
            // This is a simplified approach. A real implementation would use the `question`
            // to perform a more intelligent search or analysis of the JSON content.
            // For this prototype, we'll use a simple prompt to answer based on the DB content.
            const { output } = await ai.generate({
                prompt: `You are a helpful project assistant. Answer the user's question based *only* on the following JSON data. Be concise.

User Question: "${question}"

JSON Data:
${dbContent}
`,
            });
            return output || "I could not find an answer in the knowledge base.";

        } catch (error: any) {
            if (error.code === 'ENOENT') {
                return "The knowledge base (quantum-database.json) does not exist yet. Please run the project scan first.";
            }
            return `Error querying knowledge base: ${error.message}`;
        }
    }
);


export async function manageData(input: ManageDataInput): Promise<ManageDataOutput> {
  return manageDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'manageDataPrompt',
  input: {schema: ManageDataInputSchema},
  output: {schema: ManageDataOutputSchema},
  tools: [scanProjectAndBuildKnowledgeBase, queryKnowledgeBase],
  prompt: `You are an expert AI Data Agent for a web development project. Your primary role is to help the user understand their project by scanning its files and answering questions based on the generated knowledge base.

- If the user asks you to "scan the project", "build a knowledge base", or anything similar, you MUST use the \`scanProjectAndBuildKnowledgeBase\` tool.
- If the user asks a question about the project (e.g., "how many tracks are there?", "what dependencies do I have?"), you MUST use the \`queryKnowledgeBase\` tool to answer them.

Be helpful and clear in your responses.

User query: {{{query}}}
  `,
});

const manageDataFlow = ai.defineFlow(
  {
    name: 'manageDataFlow',
    inputSchema: ManageDataInputSchema,
    outputSchema: ManageDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
