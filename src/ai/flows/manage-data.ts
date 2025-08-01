
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


export async function manageData(input: ManageDataInput): Promise<ManageDataOutput> {
  return manageDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'manageDataPrompt',
  input: {schema: ManageDataInputSchema},
  output: {schema: ManageDataOutputSchema},
  tools: [getTracklistData],
  prompt: `You are an AI data management assistant for a music application.
  The user will ask you questions about the application's data.
  Use the available tools to inspect the data and provide helpful responses.
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
