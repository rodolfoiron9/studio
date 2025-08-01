
"use client";

import * as React from "react";
import { ThreeScene } from "@/components/three-scene";
import { LandingContent } from "@/components/landing-content";
import { CustomizationPanel } from "@/components/customization-panel";
import type { CubeCustomization, Track } from "@/lib/types";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings, Loader } from "lucide-react";
import { ALBUM_TRACKS } from "@/lib/constants";

export default function Home() {
  const [isMounted, setIsMounted] = React.useState(false);
  const [playingTrack, setPlayingTrack] = React.useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const [customization, setCustomization] = React.useState<CubeCustomization>({
    faceColor1: "#0a0a1a",
    faceColor2: "#0a0a1a",
    faceColor3: "#0a0a1a",
    faceColor4: "#0a0a1a",
    faceColor5: "#0a0a1a",
    faceColor6: "#0a0a1a",
    edgeStyle: "round",
    wireframe: true,
    roundness: 0.2,
    background: "snow",
    particleColor1: "#7DF9FF",
    particleColor2: "#9400D3",
    particleColor3: "#FFFFFF",
    text1: "RUDYBTZ",
    text2: "THE ALBUM",
    text3: "",
    text4: "",
    text5: "",
    text6: "",
    animation: "pulse",
    environmentImage: "",
  });

  const handleTimeUpdate = () => {
    if (!audioRef.current || !playingTrack?.lyrics) return;
    const currentTime = audioRef.current.currentTime;
    
    const currentLyric = playingTrack.lyrics.find(
      (lyric) => currentTime >= lyric.time && currentTime < lyric.time + lyric.duration
    );

    const lyricFaceMapping = ['text2', 'text3', 'text4', 'text5', 'text6'];
    const baseText: Record<string, string> = {
        text2: "", text3: "", text4: "", text5: "", text6: "",
    };

    if (currentLyric) {
        const faceIndex = currentLyric.wordIndex % lyricFaceMapping.length;
        baseText[lyricFaceMapping[faceIndex]] = currentLyric.word;
    }
    
    setCustomization(prev => ({ ...prev, ...baseText }));
  };

  const handleTrackSelect = (track: Track) => {
    if (playingTrack?.title === track.title) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setPlayingTrack(track);
      if (audioRef.current) {
        audioRef.current.src = track.audioSrc;
        audioRef.current.play();
        setIsPlaying(true);
      }
      setCustomization(prev => ({ 
        ...prev, 
        animation: 'audio-reactive',
        text1: track.title,
        text2: '', text3: '', text4: '', text5: '', text6: '',
      }));
    }
  };

  React.useEffect(() => {
    setIsMounted(true);
    audioRef.current = new Audio();
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
      setPlayingTrack(null);
      setCustomization(prev => ({
        ...prev, 
        animation: 'pulse',
        text1: "RUDYBTZ", text2: "THE ALBUM", text3: "", text4: "", text5: "", text6: ""
      }));
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
  }, []);

  React.useEffect(() => {
    // Show/hide landing content based on playback
    const landingContent = document.getElementById('landing-content');
    if (landingContent) {
      if (isPlaying) {
        landingContent.style.display = 'none';
      } else {
        landingContent.style.display = 'flex';
      }
    }
  }, [isPlaying]);

  if (!isMounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <ThreeScene 
        customization={customization} 
        audioElement={audioRef.current}
      />
      
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 z-20 bg-background/50 backdrop-blur-sm"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Open Customization Panel</span>
          </Button>
        </SheetTrigger>
        <CustomizationPanel
          customization={customization}
          setCustomization={setCustomization}
        />
      </Sheet>

      <LandingContent 
        onTrackSelect={handleTrackSelect}
        playingTrack={playingTrack}
        isPlaying={isPlaying}
      />
    </main>
  );
}
