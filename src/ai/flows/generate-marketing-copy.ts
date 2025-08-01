'use server';
/**
 * @fileOverview An AI agent that generates marketing copy for social media.
 *
 * - generateMarketingCopy - A function that generates social media posts.
 * - GenerateMarketingCopyInput - The input type for the generateMarketingCopy function.
 * - GenerateMarketingCopyOutput - The return type for the generateMarketingCopy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingCopyInputSchema = z.object({
  artistName: z.string().describe('The name of the artist.'),
  albumName: z.string().describe('The name of the album.'),
  trackTitle: z.string().describe('The title of the track to promote.'),
});
export type GenerateMarketingCopyInput = z.infer<typeof GenerateMarketingCopyInputSchema>;

const GenerateMarketingCopyOutputSchema = z.object({
  twitter: z.string().describe('A tweet to promote the track. Should include hashtags and be under 280 characters.'),
  instagram: z.string().describe('An Instagram post caption. Should be engaging and include relevant hashtags and emojis.'),
  facebook: z.string().describe('A Facebook post to share the new track.'),
});
export type GenerateMarketingCopyOutput = z.infer<typeof GenerateMarketingCopyOutputSchema>;

export async function generateMarketingCopy(input: GenerateMarketingCopyInput): Promise<GenerateMarketingCopyOutput> {
  return generateMarketingCopyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMarketingCopyPrompt',
  input: {schema: GenerateMarketingCopyInputSchema},
  output: {schema: GenerateMarketingCopyOutputSchema},
  prompt: `You are an expert music marketing agent. Your goal is to generate exciting and engaging social media posts to promote a new track.

Artist: {{{artistName}}}
Album: {{{albumName}}}
Track to Promote: {{{trackTitle}}}

Generate social media copy for the following platforms:
- Twitter: A short, punchy tweet. Use relevant hashtags.
- Instagram: An engaging caption. Use emojis and hashtags.
- Facebook: A slightly longer post to encourage discussion and sharing.

The tone should be professional, exciting, and authentic to an innovative music producer who blends genres like Drum and Bass, Trap, and Samba.
`,
});

const generateMarketingCopyFlow = ai.defineFlow(
  {
    name: 'generateMarketingCopyFlow',
    inputSchema: GenerateMarketingCopyInputSchema,
    outputSchema: GenerateMarketingCopyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
