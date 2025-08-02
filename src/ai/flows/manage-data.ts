
'use server';
/**
 * @fileOverview An AI agent for managing application data.
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
  query: z.string().describe('The user\'s query about the data.'),
});
export type ManageDataInput = z.infer<typeof ManageDataInputSchema>;

const ManageDataOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the query.'),
});
export type ManageDataOutput = z.infer<typeof ManageDataOutputSchema>;

const queryKnowledgeBase = ai.defineTool(
    {
      name: 'queryKnowledgeBase',
      description: 'Reads and returns the content of the knowledge base. Use this to answer questions about the project data, such as tracklists, dependencies, etc.',
      inputSchema: z.object({}),
      outputSchema: z.string(),
    },
    async () => {
        try {
            const dbPath = path.join(process.cwd(), 'src', 'lib', 'quantum-database.json');
            const fileContent = await fs.readFile(dbPath, 'utf-8');
            return fileContent;
        } catch (error) {
            console.error('Failed to read knowledge base:', error);
            return 'Error: Could not read the knowledge base file. It may need to be created first by scanning the project.';
        }
    }
);

const scanProjectFiles = ai.defineTool(
    {
        name: 'scanProjectFiles',
        description: 'Scans the project directory to identify key data files and summarize their contents. This is the first step in building the knowledge base.',
        inputSchema: z.object({}),
        outputSchema: z.string(),
    },
    async () => {
        try {
            const tracklistPath = path.join(process.cwd(), 'src', 'lib', 'constants.ts');
            const packageJsonPath = path.join(process.cwd(), 'package.json');
            
            const tracklistContent = await fs.readFile(tracklistPath, 'utf-8');
            const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');

            const trackCount = (tracklistContent.match(/title:/g) || []).length;
            const dependencies = JSON.parse(packageJsonContent).dependencies;

            return JSON.stringify({
                summary: `Scan complete. Found ${trackCount} tracks in constants.ts. Project dependencies include keys like ${Object.keys(dependencies).slice(0, 3).join(', ')}.`,
                filesScanned: [
                    { file: 'src/lib/constants.ts', purpose: 'Album tracklist data.', content: tracklistContent },
                    { file: 'package.json', purpose: 'Project dependencies and scripts.', content: packageJsonContent }
                ]
            }, null, 2);
        } catch (error: any) {
            console.error('Failed to scan project files:', error);
            return `Error: Could not scan project files. ${error.message}`;
        }
    }
);

const createKnowledgeBase = ai.defineTool(
    {
        name: 'createKnowledgeBase',
        description: 'Processes the data from scanned project files and saves it to the persistent quantum-database.json file.',
        inputSchema: z.object({
            scannedData: z.string().describe('The JSON string result from the scanProjectFiles tool.')
        }),
        outputSchema: z.string(),
    },
    async ({ scannedData }) => {
        try {
            const data = JSON.parse(scannedData);
            const dbPath = path.join(process.cwd(), 'src', 'lib', 'quantum-database.json');
            
            // Extract relevant info for the knowledge base
            const packageJson = JSON.parse(data.filesScanned.find((f: any) => f.file === 'package.json').content);
            const tracklistRaw = data.filesScanned.find((f: any) => f.file === 'src/lib/constants.ts').content;
            
            // A simple way to parse tracks from the constants file string
            const tracks = tracklistRaw
              .match(/{\s*title: ".*?",\s*duration: ".*?",/gs)
              ?.map(t => {
                const titleMatch = t.match(/title: "(.*?)"/);
                const durationMatch = t.match(/duration: "(.*?)"/);
                return { title: titleMatch ? titleMatch[1] : 'Unknown', duration: durationMatch ? durationMatch[1] : 'Unknown' };
              }) || [];

            const knowledgeBase = {
                updatedAt: new Date().toISOString(),
                source: 'Project Scan',
                project: {
                    name: packageJson.name,
                    version: packageJson.version,
                    dependencies: Object.keys(packageJson.dependencies),
                },
                album: {
                    trackCount: tracks.length,
                    tracks: tracks,
                }
            };
            
            await fs.writeFile(dbPath, JSON.stringify(knowledgeBase, null, 2), 'utf-8');

            return `Successfully created and saved knowledge base to src/lib/quantum-database.json. I am now ready to answer questions based on this new context.`;
        } catch (error: any) {
            console.error('Failed to create knowledge base:', error);
            return `Error: Could not create knowledge base. ${error.message}`;
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
  tools: [queryKnowledgeBase, scanProjectFiles, createKnowledgeBase],
  prompt: `You are an AI data management assistant for a music application.
  Your primary knowledge source is a JSON file that you can access with the 'queryKnowledgeBase' tool.

  If the user asks you to "scan the project", "create a knowledge base", or if you cannot answer a question using your existing knowledge, you MUST follow these steps:
  1. First, call the 'scanProjectFiles' tool to get a fresh summary of the project's data sources.
  2. Second, take the output from 'scanProjectFiles' and pass it directly to the 'createKnowledgeBase' tool to save it.
  3. Finally, report the result of the 'createKnowledgeBase' tool back to the user and let them know you are ready.

  For all other questions, use the 'queryKnowledgeBase' tool to inspect the data and provide helpful responses.
  If you are asked to modify data, state that you are not yet capable of modifying data, but you can provide the steps to do it manually.

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
