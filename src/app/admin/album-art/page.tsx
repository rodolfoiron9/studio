
"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, Loader, Wand2 } from "lucide-react";
import { runAlbumArtGenerator } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function AlbumArtPage() {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState("A futuristic cube floating in a synthwave landscape, detailed, 8k");
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setGeneratedImage(null);
        startTransition(async () => {
            toast({ title: "Generating Album Art...", description: "The AI is creating your album art. This may take a moment." });
            const result = await runAlbumArtGenerator(prompt);
            if (result.success && result.data?.imageUrl) {
                setGeneratedImage(result.data.imageUrl);
                toast({ title: "Success!", description: "Your new album art has been generated." });
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    }

  return (
    <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-4 font-headline">AI Album Art Generator</h1>
        <p className="text-muted-foreground mb-8">Create stunning, professional-quality album covers using AI.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Wand2 /> Generate New Art</CardTitle>
                    <CardDescription>Use a text prompt to generate unique album art. Describe the style, mood, and content you envision.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="art-prompt">AI Prompt</Label>
                            <Textarea 
                                id="art-prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., An abstract representation of soundwaves in a nebula"
                                className="min-h-[100px]"
                                disabled={isPending}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? <Loader className="animate-spin" /> : <ImageIcon className="mr-2"/>}
                            {isPending ? "Generating..." : "Generate Album Art"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ImageIcon /> Generated Image</CardTitle>
                    <CardDescription>Your generated album cover will appear here.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center aspect-square border-2 border-dashed border-muted rounded-lg">
                   {isPending && (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Loader className="h-10 w-10 animate-spin text-primary" />
                            <p>Generating your masterpiece...</p>
                        </div>
                   )}
                   {!isPending && generatedImage && (
                        <Image 
                            src={generatedImage} 
                            alt="Generated album art" 
                            width={512} 
                            height={512} 
                            className="rounded-md object-cover"
                        />
                   )}
                   {!isPending && !generatedImage && (
                       <div className="text-center text-muted-foreground">
                            <p>Your generated image will be displayed here once it&apos;s ready.</p>
                       </div>
                   )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
