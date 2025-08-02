
"use client";

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, Save, Eye, EyeOff, Loader } from "lucide-react";
import { saveApiKeys } from '@/app/actions';

export default function ApiKeysPage() {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [showKeys, setShowKeys] = useState(false);
    const [keys, setKeys] = useState({
        GEMINI_API_KEY: '',
        SPOTIFY_API_KEY: '',
        YOUTUBE_API_KEY: '',
        SOUNDCLOUD_API_KEY: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setKeys(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        startTransition(async () => {
            toast({ title: "Saving API Keys...", description: "Storing your keys securely." });
            const result = await saveApiKeys(keys);

            if (result.success) {
                toast({
                    title: "API Keys Saved",
                    description: result.data,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: "Error Saving Keys",
                    description: result.error,
                });
            }
        });
    };
    
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-4 font-headline">API Key Management</h1>
            <p className="text-muted-foreground mb-8">Securely manage and store your API keys for third-party services.</p>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2"><KeyRound /> API Keys</CardTitle>
                            <CardDescription>Enter the API keys for the services you want to integrate. The keys will be stored in your project's .env file.</CardDescription>
                        </div>
                         <Button type="button" variant="ghost" size="icon" onClick={() => setShowKeys(!showKeys)}>
                            {showKeys ? <EyeOff /> : <Eye />}
                            <span className="sr-only">{showKeys ? 'Hide keys' : 'Show keys'}</span>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="GEMINI_API_KEY">Google AI (Genkit & Veo)</Label>
                            <Input 
                                id="GEMINI_API_KEY" 
                                placeholder="Enter your Google AI API Key" 
                                type={showKeys ? "text" : "password"}
                                value={keys.GEMINI_API_KEY}
                                onChange={handleInputChange}
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="SPOTIFY_API_KEY">Spotify API Key</Label>
                            <Input 
                                id="SPOTIFY_API_KEY" 
                                placeholder="Enter your Spotify API Key" 
                                type={showKeys ? "text" : "password"}
                                value={keys.SPOTIFY_API_KEY}
                                onChange={handleInputChange}
                                disabled={isPending}
                            />
                             <p className="text-xs text-muted-foreground">Used for importing track data and album art.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="YOUTUBE_API_KEY">YouTube API Key</Label>
                            <Input 
                                id="YOUTUBE_API_KEY" 
                                placeholder="Enter your YouTube API Key" 
                                type={showKeys ? "text" : "password"}
                                value={keys.YOUTUBE_API_KEY}
                                onChange={handleInputChange}
                                disabled={isPending}
                            />
                            <p className="text-xs text-muted-foreground">Used for importing songs from YouTube links.</p>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="SOUNDCLOUD_API_KEY">SoundCloud API Key</Label>
                            <Input 
                                id="SOUNDCLOUD_API_KEY" 
                                placeholder="Enter your SoundCloud API Key" 
                                type={showKeys ? "text" : "password"}
                                value={keys.SOUNDCLOUD_API_KEY}
                                onChange={handleInputChange}
                                disabled={isPending}
                            />
                             <p className="text-xs text-muted-foreground">Used for importing songs from SoundCloud links.</p>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isPending}>
                                {isPending ? <Loader className="animate-spin" /> : <Save className="mr-2" />}
                                {isPending ? "Saving..." : "Save All Keys"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
