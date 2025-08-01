
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, Save, Eye, EyeOff } from "lucide-react";

export default function ApiKeysPage() {
    const { toast } = useToast();
    const [showKeys, setShowKeys] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // In a real application, this would securely save the keys to a backend or environment file.
        // For this demo, we'll just show a success message.
        toast({
            title: "API Keys Saved",
            description: "Your API keys have been securely stored.",
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
                            <CardDescription>Enter the API keys for the services you want to integrate.</CardDescription>
                        </div>
                         <Button type="button" variant="ghost" size="icon" onClick={() => setShowKeys(!showKeys)}>
                            {showKeys ? <EyeOff /> : <Eye />}
                            <span className="sr-only">{showKeys ? 'Hide keys' : 'Show keys'}</span>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="google-api-key">Google AI (Genkit & Veo)</Label>
                            <Input 
                                id="google-api-key" 
                                placeholder="Enter your Google AI API Key" 
                                type={showKeys ? "text" : "password"}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="spotify-api-key">Spotify API Key</Label>
                            <Input 
                                id="spotify-api-key" 
                                placeholder="Enter your Spotify API Key" 
                                type={showKeys ? "text" : "password"}
                            />
                             <p className="text-xs text-muted-foreground">Used for importing track data and album art.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="youtube-api-key">YouTube API Key</Label>
                            <Input 
                                id="youtube-api-key" 
                                placeholder="Enter your YouTube API Key" 
                                type={showKeys ? "text" : "password"}
                            />
                            <p className="text-xs text-muted-foreground">Used for importing songs from YouTube links.</p>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="soundcloud-api-key">SoundCloud API Key</Label>
                            <Input 
                                id="soundcloud-api-key" 
                                placeholder="Enter your SoundCloud API Key" 
                                type={showKeys ? "text" : "password"}
                            />
                             <p className="text-xs text-muted-foreground">Used for importing songs from SoundCloud links.</p>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit">
                                <Save className="mr-2 h-4 w-4" />
                                Save All Keys
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
