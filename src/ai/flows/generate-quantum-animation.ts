'use server';

/**
 * @fileOverview Generates unique quantum animations for the cube using AI.
 *
 * - generateQuantumAnimation - A function that generates quantum animations.
 * - GenerateQuantumAnimationInput - The input type for the generateQuantumAnimation function.
 * - GenerateQuantumAnimationOutput - The return type for the generateQuantumAnimation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuantumAnimationInputSchema = z.object({
  cubeCustomization: z
    .string()
    .describe('Description of current cube customization.'),
  musicStyle: z.string().describe('The style of music for the album.'),
});
export type GenerateQuantumAnimationInput = z.infer<typeof GenerateQuantumAnimationInputSchema>;

const GenerateQuantumAnimationOutputSchema = z.object({
  animationDescription: z
    .string()
    .describe('A description of the generated quantum animation.'),
});
export type GenerateQuantumAnimationOutput = z.infer<typeof GenerateQuantumAnimationOutputSchema>;

export async function generateQuantumAnimation(
  input: GenerateQuantumAnimationInput
): Promise<GenerateQuantumAnimationOutput> {
  return generateQuantumAnimationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuantumAnimationPrompt',
  input: {schema: GenerateQuantumAnimationInputSchema},
  output: {schema: GenerateQuantumAnimationOutputSchema},
  prompt: `You are an AI agent that generates unique and visually-striking "quantum animations" for a 3D cube.

The cube is used to present a music album.
The cube has the following customization: {{{cubeCustomization}}}
The music style is: {{{musicStyle}}}

Create a quantum animation that complements the cube's customization and the music style.
Describe the animation. Focus on visuals that sync to the music.
`,
});

const generateQuantumAnimationFlow = ai.defineFlow(
  {
    name: 'generateQuantumAnimationFlow',
    inputSchema: GenerateQuantumAnimationInputSchema,
    outputSchema: GenerateQuantumAnimationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
