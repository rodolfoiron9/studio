'use server';
/**
 * @fileOverview An AI agent that generates cohesive virtual environments for the cube.
 *
 * - generateEnvironment - A function that generates a virtual environment based on a text prompt.
 * - GenerateEnvironmentInput - The input type for the generateEnvironment function.
 * - GenerateEnvironmentOutput - The return type for the generateEnvironment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEnvironmentInputSchema = z.object({
  environmentDescription: z
    .string()
    .describe('A description of the environment to generate.'),
});
export type GenerateEnvironmentInput = z.infer<typeof GenerateEnvironmentInputSchema>;

const GenerateEnvironmentOutputSchema = z.object({
  environmentImage: z
    .string()
    .describe(
      "A photo of the generated environment, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateEnvironmentOutput = z.infer<typeof GenerateEnvironmentOutputSchema>;

export async function generateEnvironment(input: GenerateEnvironmentInput): Promise<GenerateEnvironmentOutput> {
  return generateEnvironmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEnvironmentPrompt',
  input: {schema: GenerateEnvironmentInputSchema},
  output: {schema: GenerateEnvironmentOutputSchema},
  prompt: `You are an AI agent that generates cohesive virtual environments based on a text prompt.  The user will give you a description of the environment, and you will generate an image of that environment.  The image should be a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.

Environment description: {{{environmentDescription}}}`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateEnvironmentFlow = ai.defineFlow(
  {
    name: 'generateEnvironmentFlow',
    inputSchema: GenerateEnvironmentInputSchema,
    outputSchema: GenerateEnvironmentOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: input.environmentDescription,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return {environmentImage: media!.url!};
  }
);
