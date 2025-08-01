"use client";

import { Music, Disc, User, Play, Pause, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MusicIcon = ({ className }: { className?: string }) => (
  <Music className={cn('glowing-icon', className)} />
);

export const DiscIcon = ({ className }: { className?: string }) => (
  <Disc className={cn('glowing-icon animate-spin [animation-duration:3s]', className)} />
);

export const UserIcon = ({ className }: { className?: string }) => (
  <User className={cn('glowing-icon', className)} />
);

export const PlayIcon = ({ className }: { className?: string }) => (
  <Play className={cn('h-5 w-5 text-accent-foreground', className)} />
);

export const PauseIcon = ({ className }: { className?: string }) => (
  <Pause className={cn('h-5 w-5 text-accent-foreground', className)} />
);

export const MagicWandIcon = ({ className }: { className?: string }) => (
  <Wand2 className={cn('', className)} />
);
