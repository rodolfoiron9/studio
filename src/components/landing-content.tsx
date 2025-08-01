'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ALBUM_TRACKS } from '@/lib/constants';
import { PlayIcon, PauseIcon, UserIcon, MusicIcon } from '@/components/icons';
import { Separator } from './ui/separator';

export function LandingContent() {
  const [playingTrack, setPlayingTrack] = React.useState<string | null>(null);

  const togglePlay = (title: string) => {
    setPlayingTrack(prev => (prev === title ? null : title));
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-between p-4 md:p-8">
      <header className="w-full max-w-6xl text-center">
        <h1 className="font-headline text-5xl font-bold tracking-tighter text-white drop-shadow-lg md:text-7xl">
          RudyBtz
        </h1>
        <p className="mt-2 text-xl text-accent drop-shadow-md md:text-2xl">
          Making Magic - The Album
        </p>
      </header>

      <div className="grid h-full w-full max-w-6xl grid-cols-1 gap-4 pt-8 md:grid-cols-3 md:pt-0">
        <div className="pointer-events-auto md:col-span-1">
          <Card className="h-full bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-6 w-6" /> About the Artist
              </CardTitle>
              <CardDescription>An Innovative Music Producer</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] md:h-[40vh]">
                <p className="text-sm text-foreground/80">
                  Originally from Brazil and now based in the UK, RudyBtz cultivates a unique sonic identity by fusing Drum and Bass, Trap, Samba, Reggae, Funk, and UK Dark Drill.
                  <br /><br />
                  This transatlantic transition is a foundational element influencing their musical output, skillfully amalgamating Brazilian roots with the UK&apos;s vibrant music scene. The result is a sound that is undeniably fresh and innovative, pushing the boundaries of contemporary urban music.
                </p>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="pointer-events-auto md:col-span-2">
          <Card className="h-full bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MusicIcon className="h-6 w-6" /> Making Magic - Tracklist
              </CardTitle>
              <CardDescription>20 tracks released October 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] md:h-[40vh]">
                <div className="space-y-2">
                  {ALBUM_TRACKS.map((track, index) => (
                    <React.Fragment key={track.title}>
                      <div className="flex items-center justify-between rounded-md p-2 transition-colors hover:bg-white/10">
                        <div className="flex items-center gap-4">
                           <Button
                            variant="default"
                            size="icon"
                            className="h-8 w-8 shrink-0 bg-accent text-accent-foreground hover:bg-accent/80"
                            onClick={() => togglePlay(track.title)}
                          >
                            {playingTrack === track.title ? <PauseIcon /> : <PlayIcon />}
                          </Button>
                          <div>
                            <p className="font-medium">{track.title}</p>
                            <p className="text-xs text-muted-foreground">{track.duration}</p>
                          </div>
                        </div>
                        <div className="text-sm font-mono text-muted-foreground">
                          #{index + 1}
                        </div>
                      </div>
                      {index < ALBUM_TRACKS.length - 1 && <Separator className="bg-white/10"/>}
                    </React.Fragment>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
