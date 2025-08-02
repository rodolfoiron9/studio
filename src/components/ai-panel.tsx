
"use client";

import React, { useState, useTransition } from 'react';
import type { Dispatch, SetStateAction } from "react";
import type { CubeCustomization } from "@/lib/types";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { runPresetGenerator, runEnvironmentGenerator, runAnimationGenerator, runVideoGenerator, runAlbumArtGenerator } from '@/app/actions';
import { MagicWandIcon } from './icons';
import { Loader } from 'lucide-react';
import Image from 'next/image';

interface AiPanelProps {
    setCustomization: Dispatch<SetStateAction<CubeCustomization>>;
    currentCustomization: CubeCustomization;
}

const presetSchema = z.object({
  musicStyle: z.string().min(3, "Please describe a music style or mood."),
});

const environmentSchema = z.object({
  description: z.string().min(5, "Please describe the environment you want to create."),
});

const animationSchema = z.object({
    musicStyle: z.string().min(3, "Please describe a music style or mood."),
});

const videoSchema = z.object({
  prompt: z.string().min(5, "Please describe the video you want to create."),
});

const albumArtSchema = z.object({
  prompt: z.string().min(5, "Please describe the album art you want to create."),
});


export function AiPanel({ setCustomization, currentCustomization }: AiPanelProps) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [isMagicPending, startMagicTransition] = useTransition();

    const presetForm = useForm<z.infer<typeof presetSchema>>({
        resolver: zodResolver(presetSchema),
        defaultValues: { musicStyle: "energetic drum and bass" },
    });

    const environmentForm = useForm<z.infer<typeof environmentSchema>>({
        resolver: zodResolver(environmentSchema),
        defaultValues: { description: "a neon-drenched cyberpunk city at night" },
    });
    
    const animationForm = useForm<z.infer<typeof animationSchema>>({
        resolver: zodResolver(animationSchema),
        defaultValues: { musicStyle: "liquid funk drum and bass" },
    });

    const videoForm = useForm<z.infer<typeof videoSchema>>({
        resolver: zodResolver(videoSchema),
        defaultValues: { prompt: "A majestic dragon soaring over a mystical forest at dawn" },
    });

    const albumArtForm = useForm<z.infer<typeof albumArtSchema>>({
        resolver: zodResolver(albumArtSchema),
        defaultValues: { prompt: "A futuristic cube floating in a synthwave landscape" },
    });


    const onPresetSubmit = (values: z.infer<typeof presetSchema>) => {
        startTransition(async () => {
            const result = await runPresetGenerator(values.musicStyle);
            if (result.success && result.data) {
                const { text1, text2, text3, text4, text5, text6, ...rest } = result.data;
                const preset = {
                    ...currentCustomization,
                    ...rest,
                    text1: text1 || "", text2: text2 || "", text3: text3 || "",
                    text4: text4 || "", text5: text5 || "", text6: text6 || "",
                    animation: "pulse", // default animation
                }
                setCustomization(preset);
                toast({ title: "Preset Generated!", description: "The cube has been updated with a new AI preset." });
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    };
    
    const onEnvironmentSubmit = (values: z.infer<typeof environmentSchema>) => {
        startTransition(async () => {
            const result = await runEnvironmentGenerator(values.description);
            if (result.success && result.data) {
                setCustomization(prev => ({
                    ...prev,
                    background: 'image',
                    environmentImage: result.data.environmentImage,
                }));
                toast({ title: "Environment Created!", description: "The background has been updated." });
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    };
    
    const onAnimationSubmit = (values: z.infer<typeof animationSchema>) => {
        startTransition(async () => {
            const cubeState = JSON.stringify(currentCustomization);
            const result = await runAnimationGenerator(cubeState, values.musicStyle);
            if (result.success && result.data) {
                // For now, we just show the description. A real implementation would parse this.
                toast({ title: "Animation Idea Generated!", description: result.data.animationDescription, duration: 8000 });
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    };

    const onVideoSubmit = (values: z.infer<typeof videoSchema>) => {
        startTransition(async () => {
            toast({ title: "Generating Video...", description: "This may take a minute. Please wait."});
            const result = await runVideoGenerator(values.prompt);
            if (result.success && result.data?.video) {
                setCustomization(prev => ({
                    ...prev,
                    background: 'video',
                    environmentVideo: result.data.video,
                }));
                toast({ title: "Video Environment Created!", description: "The background has been updated." });
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    };

    const onAlbumArtSubmit = (values: z.infer<typeof albumArtSchema>) => {
        startTransition(async () => {
             toast({ title: "Generating Album Art...", description: "The AI is creating your album art."});
            const result = await runAlbumArtGenerator(values.prompt);
             if (result.success && result.data) {
                // For now, we just show the image in a toast.
                // A real implementation would allow saving it or applying to the cube.
                toast({
                    title: "Album Art Generated!",
                    description: "AI has created your new album art.",
                    duration: 8000,
                    action: <Image src={result.data.imageUrl} className="w-20 h-20 rounded-md" alt="Generated album art" width={80} height={80} />
                });
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    };


    const handleMagicHand = () => {
      startMagicTransition(async () => {
        toast({ title: "Conjuring Magic...", description: "The AI is generating a full visual experience." });
        
        const presetResult = await runPresetGenerator("A magical and epic drum and bass track");
        if (!presetResult.success || !presetResult.data) {
          toast({ variant: 'destructive', title: "Magic Failed", description: "Could not generate a preset." });
          return;
        }

        const { text1, text2, text3, text4, text5, text6, ...rest } = presetResult.data;
        const preset = {
            ...rest,
            text1: text1 || "", text2: text2 || "", text3: text3 || "",
            text4: text4 || "", text5: text5 || "", text6: text6 || "",
            animation: "pulse",
            environmentVideo: "",
        }
        
        const envResult = await runEnvironmentGenerator("A mystical forest with glowing particles and ancient ruins");
        if (!envResult.success || !envResult.data) {
          toast({ variant: 'destructive', title: "Magic Failed", description: "Could not generate an environment." });
          return;
        }

        setCustomization({
          ...preset,
          background: 'image',
          environmentImage: envResult.data.environmentImage,
        });

        toast({ title: "Magic Complete!", description: "The entire scene has been transformed." });
      });
    };

  return (
    <div className="space-y-4">
        <div className="space-y-2 rounded-lg border p-4">
            <h3 className="font-headline text-lg font-semibold flex items-center gap-2"><MagicWandIcon className="h-5 w-5 text-primary"/> Magic Hand</h3>
            <p className="text-sm text-muted-foreground">Let the AI generate an entire scene for you with one click.</p>
            <Button onClick={handleMagicHand} disabled={isMagicPending || isPending} className="w-full">
                {isMagicPending ? <Loader className="animate-spin" /> : "Generate Everything"}
            </Button>
        </div>

        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="preset">
                <AccordionTrigger>AI Preset Generator</AccordionTrigger>
                <AccordionContent>
                    <Form {...presetForm}>
                        <form onSubmit={presetForm.handleSubmit(onPresetSubmit)} className="space-y-4">
                            <FormField control={presetForm.control} name="musicStyle" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Music Style / Mood</FormLabel>
                                    <FormControl><Input placeholder="e.g., chill lo-fi beats" {...field} disabled={isPending || isMagicPending} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" disabled={isPending || isMagicPending} className="w-full">
                               {isPending ? <Loader className="animate-spin" /> : "Generate Preset"}
                            </Button>
                        </form>
                    </Form>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="environment">
                <AccordionTrigger>AI Environment Creator</AccordionTrigger>
                <AccordionContent>
                    <Form {...environmentForm}>
                        <form onSubmit={environmentForm.handleSubmit(onEnvironmentSubmit)} className="space-y-4">
                            <FormField control={environmentForm.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Environment Description</FormLabel>
                                    <FormControl><Textarea placeholder="e.g., a serene alien jungle at dusk" {...field} disabled={isPending || isMagicPending} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" disabled={isPending || isMagicPending} className="w-full">
                                {isPending ? <Loader className="animate-spin" /> : "Generate Environment"}
                            </Button>
                        </form>
                    </Form>
                </AccordionContent>
            </AccordionItem>
             <AccordionItem value="video-environment">
                <AccordionTrigger>AI Video Environment (Veo)</AccordionTrigger>
                <AccordionContent>
                    <Form {...videoForm}>
                        <form onSubmit={videoForm.handleSubmit(onVideoSubmit)} className="space-y-4">
                            <FormField control={videoForm.control} name="prompt" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Video Prompt</FormLabel>
                                    <FormControl><Textarea placeholder="e.g., a time-lapse of a futuristic city" {...field} disabled={isPending || isMagicPending} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" disabled={isPending || isMagicPending} className="w-full">
                                {isPending ? <Loader className="animate-spin" /> : "Generate Video"}
                            </Button>
                        </form>
                    </Form>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="album-art">
                <AccordionTrigger>AI Album Art Generator</AccordionTrigger>
                <AccordionContent>
                    <Form {...albumArtForm}>
                        <form onSubmit={albumArtForm.handleSubmit(onAlbumArtSubmit)} className="space-y-4">
                            <FormField control={albumArtForm.control} name="prompt" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Album Art Prompt</FormLabel>
                                    <FormControl><Textarea placeholder="e.g., a vibrant, abstract representation of soundwaves" {...field} disabled={isPending || isMagicPending} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" disabled={isPending || isMagicPending} className="w-full">
                                {isPending ? <Loader className="animate-spin" /> : "Generate Art"}
                            </Button>
                        </form>
                    </Form>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="animation">
                <AccordionTrigger>AI Animation Creator</AccordionTrigger>
                <AccordionContent>
                     <Form {...animationForm}>
                        <form onSubmit={animationForm.handleSubmit(onAnimationSubmit)} className="space-y-4">
                            <FormField control={animationForm.control} name="musicStyle" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Music Style</FormLabel>
                                    <FormControl><Input placeholder="e.g., dark synthwave" {...field} disabled={isPending || isMagicPending} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" disabled={isPending || isMagicPending} className="w-full">
                                {isPending ? <Loader className="animate-spin" /> : "Generate Animation Idea"}
                            </Button>
                        </form>
                    </Form>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
  );
}

    