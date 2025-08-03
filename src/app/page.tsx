
"use client";

import * as React from "react";
import { ThreeScene } from "@/components/three-scene";
import { LandingContent } from "@/components/landing-content";
import { CustomizationPanel } from "@/components/customization-panel";
import type { CubeCustomization, Track, Lyric } from "@/lib/types";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings, Loader } from "lucide-react";
import { SyncedLyrics } from "@/components/synced-lyrics";
import { Header } from "@/components/header";


export default function Home() {
  const [isMounted, setIsMounted] = React.useState(false);
  const [playingTrack, setPlayingTrack] = React.useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentLyric, setCurrentLyric] = React.useState<Lyric | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);


  const [customization, setCustomization] = React.useState<CubeCustomization>({
    faceColor1: "#9400D3",
    faceColor2: "#1A237E",
    faceColor3: "#7DF9FF",
    faceColor4: "#9400D3",
    faceColor5: "#1A237E",
    faceColor6: "#7DF9FF",
    edgeStyle: "round",
    materialStyle: 'metallic',
    roundness: 0.2,
    background: "snow",
    particleColor1: "#7DF9FF",
    particleColor2: "#9400D3",
    particleColor3: "#FFFFFF",
    text1: "RUDYBTZ",
    text2: "MAKING MAGIC",
    text3: "",
    text4: "",
    text5: "",
    text6: "",
    animation: "pulse",
    environmentImage: "",
    environmentVideo: "",
    lyricDisplay: 'underneath',
  });

  const handleTimeUpdate = () => {
    if (!audioRef.current || !playingTrack?.lyrics) {
        setCurrentLyric(null);
        return;
    };
    const currentTime = audioRef.current.currentTime;
    
    const activeLyric = playingTrack.lyrics.find(
      (lyric) => currentTime >= lyric.time && currentTime < lyric.time + lyric.duration
    );

    if (activeLyric) {
        if (!currentLyric || currentLyric.time !== activeLyric.time) {
            setCurrentLyric(activeLyric);
        }
    } else if (currentLyric) {
        // We've passed the last lyric, but the song hasn't ended.
        // We can choose to clear it, or let it linger. Let's clear it.
        if(playingTrack.lyrics.length > 0 && currentTime > playingTrack.lyrics[playingTrack.lyrics.length - 1].time + playingTrack.lyrics[playingTrack.lyrics.length - 1].duration) {
          setCurrentLyric(null);
        }
    }
  };

  const handleTrackSelect = (track: Track) => {
    if (playingTrack?.title === track.title) {
      if (isPlaying) {
        // audioRef.current?.pause(); // No-op for prototype
        setIsPlaying(false);
      } else {
        // audioRef.current?.play(); // No-op for prototype
        setIsPlaying(true);
      }
    } else {
      setPlayingTrack(track);
      setIsPlaying(true);
      // The following lines are commented out to prevent errors in the prototype
      // as the audio files do not actually exist.
      // if (audioRef.current) {
      //   audioRef.current.src = track.audioSrc;
      //   audioRef.current.play();
      //   setIsPlaying(true);
      // }
      setCustomization(prev => ({ 
        ...prev, 
        animation: 'audio-reactive',
        text1: track.title,
        text2: '', text3: '', text4: '', text5: '', text6: '',
      }));
    }
  };

  React.useEffect(() => {
    const appliedPreset = localStorage.getItem('appliedPreset');
    if (appliedPreset) {
      try {
        const parsedPreset = JSON.parse(appliedPreset);
        setCustomization(prev => ({
          ...prev,
          ...parsedPreset.cube,
          environmentImage: parsedPreset.environment.environmentImage,
        }));
        localStorage.removeItem('appliedPreset'); // Clear after applying
      } catch (e) {
        console.error("Failed to parse applied preset", e);
      }
    }

    setIsMounted(true);
    audioRef.current = new Audio();
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
      setPlayingTrack(null);
      setCurrentLyric(null);
      setCustomization(prev => ({
        ...prev, 
        animation: 'pulse',
        text1: "RUDYBTZ", text2: "THE ALBUM", text3: "", text4: "", text5: "", text6: ""
      }));
    });

    // Simulate lyric progression for the prototype
    let lyricInterval: NodeJS.Timeout;
    if (isPlaying && playingTrack?.lyrics?.length) {
      let lyricIndex = 0;
      setCurrentLyric(playingTrack.lyrics[0]);

      if (customization.lyricDisplay === 'cube') {
         setCustomization(prev => ({...prev, text1: "", text2: "", text3: "", text4: "", text5: "", text6: ""}));
      }

      lyricInterval = setInterval(() => {
        if (lyricIndex < playingTrack.lyrics.length) {
          const lyric = playingTrack.lyrics[lyricIndex];
          setCurrentLyric(lyric);

          if (customization.lyricDisplay === 'cube') {
             const faceIndex = (lyric.wordIndex % 6) + 1;
             const textKey = `text${faceIndex}` as keyof CubeCustomization;
             setCustomization(prev => ({ ...prev, [textKey]: lyric.word }));
          }

          lyricIndex++;
        } else {
          // End of song simulation
          setIsPlaying(false);
          setPlayingTrack(null);
          setCurrentLyric(null);
          clearInterval(lyricInterval);
           setCustomization(prev => ({
            ...prev, 
            animation: 'pulse',
            text1: "RUDYBTZ", text2: "MAKING MAGIC", text3: "", text4: "", text5: "", text6: ""
          }));
        }
      }, 500); // Change lyric every 0.5s for demo
    }


    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.pause();
        // audioRef.current = null; // This causes issues with hot-reloading, avoid nulling it
      }
      if(lyricInterval) clearInterval(lyricInterval);
    }
  }, [isPlaying, playingTrack, customization.lyricDisplay]);

  React.useEffect(() => {
    if (customization.background === 'video' && customization.environmentVideo && videoRef.current) {
      videoRef.current.src = customization.environmentVideo;
      videoRef.current.play();
    }
  }, [customization.background, customization.environmentVideo])

  if (!isMounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden">
        {customization.background === 'video' && customization.environmentVideo && (
            <video 
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover z-[-1]"
                loop
                muted
                autoPlay
                playsInline
                src={customization.environmentVideo}
            />
        )}
      <ThreeScene 
        customization={customization} 
        audioElement={audioRef.current}
      />
      
      <Header />

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

      {customization.lyricDisplay === 'underneath' && currentLyric && (
        <SyncedLyrics 
            key={currentLyric.time} // Force re-render for animation
            lyrics={playingTrack?.lyrics || []} 
            currentLyric={currentLyric} 
        />
      )}

      {!isPlaying && !playingTrack && <LandingContent 
        onTrackSelect={handleTrackSelect}
        playingTrack={playingTrack}
        isPlaying={isPlaying}
      />}
    </main>
  );
}
