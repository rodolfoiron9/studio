
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


const createFirestoreRules = ai.defineTool(
    {
        name: 'createFirestoreRules',
        description: 'Creates or overwrites the firestore.rules file. Use this to define security rules for the Firestore database. Always include a comment explaining the rules.',
        inputSchema: z.object({
            rules: z.string().describe("The full content of the firestore.rules file."),
        }),
        outputSchema: z.string(),
    },
    async ({ rules }) => {
        try {
            const rulesPath = path.join(process.cwd(), 'firestore.rules');
            await fs.writeFile(rulesPath, rules, 'utf-8');
            return `Successfully created firestore.rules. The user can deploy this by running 'firebase deploy --only firestore:rules'.`;
        } catch (error: any) {
            return `Error creating Firestore rules: ${error.message}`;
        }
    }
);

const createStorageRules = ai.defineTool(
    {
        name: 'createStorageRules',
        description: 'Creates or overwrites the storage.rules file. Use this to define security rules for Cloud Storage for Firebase.',
        inputSchema: z.object({
            rules: z.string().describe("The full content of the storage.rules file."),
        }),
        outputSchema: z.string(),
    },
    async ({ rules }) => {
        try {
            const rulesPath = path.join(process.cwd(), 'storage.rules');
            await fs.writeFile(rulesPath, rules, 'utf-8');
            return `Successfully created storage.rules. The user can deploy this by running 'firebase deploy --only storage'.`;
        } catch (error: any) {
            return `Error creating Storage rules: ${error.message}`;
        }
    }
);

const scaffoldCloudFunction = ai.defineTool(
    {
        name: 'scaffoldCloudFunction',
        description: "Scaffolds a new Cloud Function in the 'functions' directory. This creates the necessary file but does not deploy it.",
        inputSchema: z.object({
            functionName: z.string().describe("The name of the function, e.g., 'makeUppercase'"),
            fileName: z.string().describe("The filename for the function, e.g., 'index.js'"),
            code: z.string().describe("The full JavaScript code for the function."),
            trigger: z.string().describe("A description of what triggers the function, e.g., 'on a new document in /messages/{documentId}'"),
        }),
        outputSchema: z.string(),
    },
    async ({ fileName, code }) => {
        try {
            const functionsDir = path.join(process.cwd(), 'functions');
            // Ensure the directory exists
            await fs.mkdir(functionsDir, { recursive: true });
            
            // For this prototype, we'll just create a single file. A real implementation
            // would need to manage package.json, dependencies, etc.
            const functionPath = path.join(functionsDir, fileName);
            await fs.writeFile(functionPath, code, 'utf-8');

            return `Successfully scaffolded new Cloud Function in 'functions/${fileName}'. The user can deploy this by running 'firebase deploy --only functions'.`;
        } catch (error: any) {
            return `Error scaffolding Cloud Function: ${error.message}`;
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
  tools: [createFirestoreRules, createStorageRules, scaffoldCloudFunction],
  prompt: `You are an expert Firebase Architect AI. Your task is to help users provision and manage their Firebase backend by generating the necessary configuration and code files.

You have three tools at your disposal:
1.  \`createFirestoreRules\`: To set up security for the Firestore database.
2.  \`createStorageRules\`: To set up security for Cloud Storage.
3.  \`scaffoldCloudFunction\`: To write the code for a new Cloud Function.

Analyze the user's request. If they ask for a feature that requires a backend component, use the appropriate tool to generate the necessary files.

Examples:
- If the user says "I need a secure way for users to upload their profile pictures", you should use \`createStorageRules\` to create rules that only allow authenticated users to write to their own path.
- If the user says "I need a database for public articles that anyone can read but only admins can write", you should use \`createFirestoreRules\`.
- If the user says "I need to process an image every time it's uploaded", you should use \`scaffoldCloudFunction\` to create a function that triggers on a storage event.

After using a tool, you MUST explain what you have done and provide the user with the \`firebase deploy\` command they need to run to make your changes live. Your response should be clear and helpful.

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
