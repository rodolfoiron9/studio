
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Lyric } from "@/lib/types";

interface SyncedLyricsProps {
    lyrics: Lyric[];
    currentLyric: Lyric | null;
}

export function SyncedLyrics({ lyrics, currentLyric }: SyncedLyricsProps) {
    if (!lyrics.length || !currentLyric) {
        return null;
    }

    return (
        <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20">
            <div className="mx-auto max-w-4xl text-center">
                <p className="text-2xl font-bold tracking-tight text-white drop-shadow-lg md:text-4xl">
                     <motion.span
                        key={currentLyric.time}
                        initial={{ opacity: 0.5, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="text-accent"
                    >
                        {currentLyric.word}
                    </motion.span>
                </p>
            </div>
        </div>
    );
}
