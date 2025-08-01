
"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ALBUM_TRACKS } from "@/lib/constants";
import { runMarketingAgent } from "@/app/actions";
import type { GenerateMarketingCopyOutput } from "@/ai/flows/generate-marketing-copy";
import { Loader, Wand2, Twitter, Facebook } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// A placeholder for the Instagram icon
const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
);


export default function MarketingPage() {
    const { toast } = useToast();
    const [selectedTrack, setSelectedTrack] = useState("");
    const [generatedCopy, setGeneratedCopy] = useState<GenerateMarketingCopyOutput | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedTrack) {
            toast({ variant: 'destructive', title: "Error", description: "Please select a track to promote." });
            return;
        }

        setGeneratedCopy(null);
        startTransition(async () => {
            toast({ title: "Generating Social Posts...", description: "The AI marketing agent is crafting your content." });
            const result = await runMarketingAgent(selectedTrack);
            if (result.success && result.data) {
                setGeneratedCopy(result.data);
                toast({ title: "Success!", description: "Your new marketing copy has been generated." });
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    }

  return (
    <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-4 font-headline">AI Marketing Agent</h1>
        <p className="text-muted-foreground mb-8">Automate your social media promotion by generating posts for your tracks.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Wand2 /> Generate Campaign</CardTitle>
                    <CardDescription>Select a track to generate promotional content for your social networks.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="track-select">Track to Promote</Label>
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
                        <Button type="submit" className="w-full" disabled={isPending || !selectedTrack}>
                            {isPending ? <Loader className="animate-spin" /> : "Generate Posts"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Generated Content</CardTitle>
                    <CardDescription>The AI-generated posts for your selected track will appear below. Copy and paste them into your social media scheduler.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   {isPending && (
                        <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
                            <Loader className="h-10 w-10 animate-spin text-primary" />
                            <p>Generating content...</p>
                        </div>
                   )}
                   {!isPending && !generatedCopy && (
                       <div className="text-center text-muted-foreground h-64 flex items-center justify-center">
                            <p>Your generated social media posts will be displayed here.</p>
                       </div>
                   )}
                   {generatedCopy && (
                    <div className="space-y-4">
                        {/* Twitter */}
                        <div className="space-y-2">
                           <h3 className="font-semibold flex items-center gap-2 text-blue-400"><Twitter /> Twitter Post</h3>
                           <p className="text-sm p-4 bg-muted rounded-md whitespace-pre-wrap">{generatedCopy.twitter}</p>
                        </div>
                        <Separator/>
                        {/* Instagram */}
                         <div className="space-y-2">
                           <h3 className="font-semibold flex items-center gap-2 text-pink-500"><InstagramIcon /> Instagram Post</h3>
                           <p className="text-sm p-4 bg-muted rounded-md whitespace-pre-wrap">{generatedCopy.instagram}</p>
                        </div>
                        <Separator/>
                        {/* Facebook */}
                         <div className="space-y-2">
                           <h3 className="font-semibold flex items-center gap-2 text-blue-600"><Facebook /> Facebook Post</h3>
                           <p className="text-sm p-4 bg-muted rounded-md whitespace-pre-wrap">{generatedCopy.facebook}</p>
                        </div>
                    </div>
                   )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
