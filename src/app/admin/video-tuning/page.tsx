
"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ALBUM_TRACKS } from "@/lib/constants";
import { runVideoGenerator } from "@/app/actions";
import { Loader, Wand2, Film, Video } from "lucide-react";

export default function VideoTuningPage() {
    const { toast } = useToast();
    const [selectedTrack, setSelectedTrack] = useState("");
    const [prompt, setPrompt] = useState("A time-lapse of a futuristic city with flying vehicles, neon lights, and towering skyscrapers.");
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!prompt) {
            toast({ variant: 'destructive', title: "Error", description: "Please enter a prompt for the video." });
            return;
        }

        setGeneratedVideo(null);
        startTransition(async () => {
            toast({ title: "Generating Video...", description: "The Veo AI is creating your video. This may take up to a minute." });
            const result = await runVideoGenerator(prompt);
            if (result.success && result.data?.video) {
                setGeneratedVideo(result.data.video);
                toast({ title: "Success!", description: `Your new video has been generated for ${selectedTrack || 'your prompt'}.` });
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    }

  return (
    <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-4 font-headline">Veo AI Video Generation</h1>
        <p className="text-muted-foreground mb-8">Generate unique, high-quality background videos for each track on your album using Google's Veo model.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Wand2 /> Video Generator</CardTitle>
                    <CardDescription>Select a track and describe the video you want to create.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="track-select">Track (Optional)</Label>
                            <Select value={selectedTrack} onValueChange={setSelectedTrack} disabled={isPending}>
                                <SelectTrigger id="track-select">
                                    <SelectValue placeholder="Select a track..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {ALBUM_TRACKS.map(track => (
                                        <SelectItem key={track.title} value={track.title}>
                                            {track.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="video-prompt">Video Prompt</Label>
                            <Textarea 
                                id="video-prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., An abstract representation of soundwaves in a nebula"
                                className="min-h-[120px]"
                                disabled={isPending}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isPending || !prompt}>
                            {isPending ? <Loader className="animate-spin" /> : <Film className="mr-2"/>}
                            {isPending ? "Generating..." : "Generate Video"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Generated Video</CardTitle>
                    <CardDescription>Your generated video will appear here. You can then save it and associate it with the track.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center aspect-video border-2 border-dashed border-muted rounded-lg bg-muted/50">
                   {isPending && (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Loader className="h-10 w-10 animate-spin text-primary" />
                            <p>Generating your video...</p>
                            <p className="text-xs">(This can take up to a minute)</p>
                        </div>
                   )}
                   {!isPending && generatedVideo && (
                       <video 
                            src={generatedVideo}
                            controls
                            className="rounded-md object-cover w-full h-full"
                        />
                   )}
                   {!isPending && !generatedVideo && (
                       <div className="text-center text-muted-foreground flex flex-col items-center gap-2">
                            <Video className="h-12 w-12"/>
                            <p>Your generated video will be displayed here.</p>
                       </div>
                   )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
