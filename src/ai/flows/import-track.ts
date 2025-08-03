
'use server';
/**
 * @fileOverview An AI agent that imports track data from music service URLs.
 *
 * - importTrack - A function that handles the track import process.
 * - ImportTrackInput - The input type for the importTrack function.
 * - ImportTrackOutput - The return type for the importTrack function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImportTrackInputSchema = z.object({
  url: z.string().url().describe('The URL of the track to import from a music service like Spotify, YouTube, or SoundCloud.'),
});
export type ImportTrackInput = z.infer<typeof ImportTrackInputSchema>;

const ImportTrackOutputSchema = z.object({
    title: z.string().describe("The title of the track."),
    artist: z.string().describe("The primary artist of the track."),
    album: z.string().optional().describe("The album the track belongs to."),
    duration: z.string().describe("The duration of the track in MM:SS format."),
    releaseDate: z.string().optional().describe("The release date of the track in YYYY-MM-DD format."),
    genre: z.string().optional().describe("The genre of the track."),
    artworkUrl: z.string().url().optional().describe("A URL to the track's artwork."),
    source: z.string().describe("The source service (e.g., Spotify, YouTube)."),
});
export type ImportTrackOutput = z.infer<typeof ImportTrackOutputSchema>;

const getTrackInfoFromUrl = ai.defineTool(
    {
      name: 'getTrackInfoFromUrl',
      description: 'Fetches track information from a given URL. This tool simulates calling an external music API.',
      inputSchema: z.object({
          url: z.string().url(),
      }),
      outputSchema: ImportTrackOutputSchema,
    },
    async ({ url }) => {
        // In a real application, this tool would use the URL to determine the service,
        // then call the respective API (Spotify, YouTube, etc.) with the necessary API key.
        // For this prototype, we'll return mock data based on the URL.
        let source = 'Unknown';
        if (url.includes('spotify')) source = 'Spotify';
        if (url.includes('youtube')) source = 'YouTube';
        if (url.includes('soundcloud')) source = 'SoundCloud';

        return {
            title: "Simulated Track Title",
            artist: "RudyBtz",
            album: "Making Magic",
            duration: "3:33",
            releaseDate: "2024-10-26",
            genre: "Drum and Bass",
            artworkUrl: `https://placehold.co/300x300.png`,
            source: source,
        };
    }
);


export async function importTrack(input: ImportTrackInput): Promise<ImportTrackOutput> {
  return importTrackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'importTrackPrompt',
  input: {schema: ImportTrackInputSchema},
  output: {schema: ImportTrackOutputSchema},
  tools: [getTrackInfoFromUrl],
  prompt: `The user has provided a URL from a music streaming service. Use the getTrackInfoFromUrl tool to fetch the details of the track.
  
URL: {{{url}}}

Return the full, structured data for the track.
  `,
});

const importTrackFlow = ai.defineFlow(
  {
    name: 'importTrackFlow',
    inputSchema: ImportTrackInputSchema,
    outputSchema: ImportTrackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
