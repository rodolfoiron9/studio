
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

const getTracklistData = ai.defineTool(
    {
      name: 'getTracklistData',
      description: 'Returns the raw TypeScript code content of the album tracklist data. This is useful for answering questions about what tracks are in the album.',
      inputSchema: z.object({}),
      outputSchema: z.string(),
    },
    async () => {
        try {
            const filePath = path.join(process.cwd(), 'src', 'lib', 'constants.ts');
            const fileContent = await fs.readFile(filePath, 'utf-8');
            return fileContent;
        } catch (error) {
            console.error('Failed to read tracklist data:', error);
            return 'Error: Could not read the tracklist data file.';
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
            // In a real scenario, this would be a more comprehensive scan.
            // For this prototype, we'll identify a few key files.
            const tracklistPath = path.join(process.cwd(), 'src', 'lib', 'constants.ts');
            const packageJsonPath = path.join(process.cwd(), 'package.json');
            
            const tracklistContent = await fs.readFile(tracklistPath, 'utf-8');
            const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');

            const trackCount = (tracklistContent.match(/title:/g) || []).length;
            const dependencies = JSON.parse(packageJsonContent).dependencies;

            return JSON.stringify({
                summary: `Scan complete. Found ${trackCount} tracks in constants.ts. Project dependencies include keys like ${Object.keys(dependencies).slice(0, 3).join(', ')}.`,
                filesScanned: [
                    { file: 'src/lib/constants.ts', purpose: 'Album tracklist data.'},
                    { file: 'package.json', purpose: 'Project dependencies and scripts.'}
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
        description: 'Processes the data from scanned project files and creates a structured dataset. It can then (conceptually) save this dataset to an external source like Google Drive for fine-tuning.',
        inputSchema: z.object({
            scannedData: z.string().describe('The JSON string result from the scanProjectFiles tool.')
        }),
        outputSchema: z.string(),
    },
    async ({ scannedData }) => {
        try {
            const data = JSON.parse(scannedData);
            // This is a simulation of creating a structured dataset.
            const knowledgeBase = {
                createdAt: new Date().toISOString(),
                source: 'Project Scan',
                content: data,
                // Placeholder for the external storage link
                googleDriveLink: `https://drive.google.com/mock-file-id/${Date.now()}`
            };

            // In a real app, you'd use the Google Drive API here to upload the file.
            console.log("Simulating saving knowledge base to Google Drive:", knowledgeBase);

            return `Successfully created knowledge base from scanned files. The dataset has been conceptually saved to Google Drive at ${knowledgeBase.googleDriveLink}. I am now ready to answer questions based on this new context.`;
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
  tools: [getTracklistData, scanProjectFiles, createKnowledgeBase],
  prompt: `You are an AI data management assistant for a music application.
  The user will ask you questions about the application's data.
  
  If the user asks you to "scan the project" or "create a knowledge base", you MUST follow these steps:
  1. First, call the 'scanProjectFiles' tool to get a summary of the project's data sources.
  2. Second, take the output from 'scanProjectFiles' and pass it directly to the 'createKnowledgeBase' tool.
  3. Finally, report the result of the 'createKnowledgeBase' tool back to the user.

  For all other questions, use the available tools to inspect the data and provide helpful responses.
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
