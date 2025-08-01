'use server';
/**
 * @fileOverview An AI agent that generates album art.
 *
 * - generateAlbumArt - A function that generates album art based on a text prompt.
 * - GenerateAlbumArtInput - The input type for the generateAlbumArt function.
 * - GenerateAlbumArtOutput - The return type for the generateAlbumArt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAlbumArtInputSchema = z.object({
  prompt: z
    .string()
    .describe('A description of the album art to generate.'),
});
export type GenerateAlbumArtInput = z.infer<typeof GenerateAlbumArtInputSchema>;

const GenerateAlbumArtOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "A URL or data URI of the generated image."
    ),
});
export type GenerateAlbumArtOutput = z.infer<typeof GenerateAlbumArtOutputSchema>;

export async function generateAlbumArt(input: GenerateAlbumArtInput): Promise<GenerateAlbumArtOutput> {
  return generateAlbumArtFlow(input);
}

const generateAlbumArtFlow = ai.defineFlow(
  {
    name: 'generateAlbumArtFlow',
    inputSchema: GenerateAlbumArtInputSchema,
    outputSchema: GenerateAlbumArtOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: input.prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return {imageUrl: media!.url!};
  }
);
