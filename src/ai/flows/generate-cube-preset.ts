'use server';

/**
 * @fileOverview AI agent to generate cube customization presets based on musical styles or moods.
 *
 * - generateCubePreset - A function that generates cube customization presets.
 * - GenerateCubePresetInput - The input type for the generateCubePreset function.
 * - GenerateCubePresetOutput - The return type for the generateCubePreset function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCubePresetInputSchema = z.object({
  musicStyle: z
    .string()
    .describe('The musical style or mood for which to generate the preset.'),
});
export type GenerateCubePresetInput = z.infer<typeof GenerateCubePresetInputSchema>;

const GenerateCubePresetOutputSchema = z.object({
  faceColor1: z.string().describe('The color for face 1 in hex format (e.g., #RRGGBB).'),
  faceColor2: z.string().describe('The color for face 2 in hex format.'),
  faceColor3: z.string().describe('The color for face 3 in hex format.'),
  faceColor4: z.string().describe('The color for face 4 in hex format.'),
  faceColor5: z.string().describe('The color for face 5 in hex format.'),
  faceColor6: z.string().describe('The color for face 6 in hex format.'),
  edgeStyle: z
    .string()
    .describe(
      'The edge style for the cube (e.g., sharp, round, bevel). Choose from: sharp, round, bevel.'
    ),
  wireframe: z.boolean().describe('Whether to enable wireframe edges or not.'),
  roundness: z.number().describe('The roundness of the edges (0-1).'),
  background: z.string().describe('The background style (e.g., snow, particles).'),
  particleColor1: z.string().describe('The color for particle 1 in hex format.'),
  particleColor2: z.string().describe('The color for particle 2 in hex format.'),
  particleColor3: z.string().describe('The color for particle 3 in hex format.'),
  text1: z.string().describe('Text for face 1'),
  text2: z.string().describe('Text for face 2'),
  text3: z.string().describe('Text for face 3'),
  text4: z.string().describe('Text for face 4'),
  text5: z.string().describe('Text for face 5'),
  text6: z.string().describe('Text for face 6'),
});
export type GenerateCubePresetOutput = z.infer<typeof GenerateCubePresetOutputSchema>;

export async function generateCubePreset(
  input: GenerateCubePresetInput
): Promise<GenerateCubePresetOutput> {
  return generateCubePresetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCubePresetPrompt',
  input: {schema: GenerateCubePresetInputSchema},
  output: {schema: GenerateCubePresetOutputSchema},
  prompt: `You are an AI agent that generates cube customization presets based on musical styles or moods. The user will provide a music style or mood, and you will generate a cube preset that matches that style or mood.

Music Style/Mood: {{{musicStyle}}}

Generate a cube customization preset with the following attributes:
- faceColor1: The color for face 1 in hex format.
- faceColor2: The color for face 2 in hex format.
- faceColor3: The color for face 3 in hex format.
- faceColor4: The color for face 4 in hex format.
- faceColor5: The color for face 5 in hex format.
- faceColor6: The color for face 6 in hex format.
- edgeStyle: The edge style for the cube (sharp, round, bevel).
- wireframe: Whether to enable wireframe edges or not.
- roundness: The roundness of the edges (0-1).
- background: The background style (snow, particles).
- particleColor1: The color for particle 1 in hex format.
- particleColor2: The color for particle 2 in hex format.
- particleColor3: The color for particle 3 in hex format.
- text1: Text for face 1
- text2: Text for face 2
- text3: Text for face 3
- text4: Text for face 4
- text5: Text for face 5
- text6: Text for face 6`,
});

const generateCubePresetFlow = ai.defineFlow(
  {
    name: 'generateCubePresetFlow',
    inputSchema: GenerateCubePresetInputSchema,
    outputSchema: GenerateCubePresetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
