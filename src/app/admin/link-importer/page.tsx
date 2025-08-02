
"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link, Youtube, Music, Loader, Info } from "lucide-react";
import { runTrackImporter } from "@/app/actions";
import type { ImportTrackOutput } from "@/ai/flows/import-track";
import Image from "next/image";

// A placeholder for the SoundCloud icon
const SoundCloudIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
        <title>SoundCloud</title>
        <path d="M7.75 18.063c-1.62 0-2.875-.313-3.75-1.063-.938-.75-.938-2-.938-3.624V11c0-1.688 0-2.875.938-3.688.875-.75 2.13-1.062 3.75-1.062h8.5c1.625 0 2.875.313 3.75 1.063.938.812.938 2 .938 3.687v2.375c0 1.625-.312 2.875-1.062 3.625-.75.75-2.125 1.062-3.625 1.062H7.75zM0 13.375c0 1.5.188 2.75.625 3.813s1.125 1.875 2.125 2.5c.938.562 2.125.875 3.563.875h.5v-2.375h-.438c-1.312 0-2.312-.25-3-.812-.688-.5-.938-1.313-.938-2.375v-2.375h1.563v2.563h.625v-2.563H6.5v2.563h.625v-2.563h.625v2.563h.625V11.25h.625v2.125h.625v-2.125h.625v2.125h.625v-2.125h.625v2.125h.625V11.25h.625v2.125h.625v-2.125h.625v2.125h.625v-2.125h.625v2.125h.625V8.5h-1.5V6.125H3.75v2.375H2.187V6.125H.625v2.375H0v4.875z" fill="currentColor"></path>
    </svg>
);

// A placeholder for the Spotify icon
const SpotifyIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
        <title>Spotify</title>
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.43 17.412c-.228.36-.636.468-.996.24-2.892-1.776-6.504-2.172-10.848-1.188-.432.096-.864-.192-.96-.624-.096-.432.192-.864.624-.96C11.136 13.9 15.12 14.352 18.36 16.32c.36.228.468.636.24.996zm1.188-2.724c-.288.456-.816.588-1.272.3-3.252-2-7.5-2.508-11.784-1.38-.528.144-1.068-.18-1.212-.708-.144-.528.18-1.068.708-1.212 4.752-1.236 9.468-.672 13.08 1.596.456.288.588.816.3 1.272zm.12-3.084c-.348.552-.984.732-1.536.384-3.66-2.256-8.544-2.748-13.344-1.5-.636.168-1.308-.204-1.476-.84-.168-.636.204-1.308.84-1.476 5.232-1.344 10.584-.792 14.748 1.74.552.348.732.984.384 1.536z" fill="currentColor"></path>
    </svg>
);


export default function LinkImporterPage() {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [importedData, setImportedData] = useState<ImportTrackOutput | null>(null);

    const handleImport = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const input = form.elements.namedItem('import-url') as HTMLInputElement;
        const url = input.value;
        
        if (!url) {
            toast({ variant: 'destructive', title: "Error", description: "Please enter a URL." });
            return;
        }

        setImportedData(null);
        startTransition(async () => {
            toast({ title: "Importing Track...", description: "The AI agent is fetching data for the URL." });
            const result = await runTrackImporter(url);

            if (result.success && result.data) {
                setImportedData(result.data);
                toast({ title: "Import Successful!", description: `Data for "${result.data.title}" has been fetched.` });
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
        
        input.value = "";
    };
    
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-4 font-headline">Track Importer</h1>
            <p className="text-muted-foreground mb-8">Import song data directly from popular music services by pasting a link.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                        {/* Spotify Importer */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3"><SpotifyIcon /> Spotify Importer</CardTitle>
                                <CardDescription>Paste a link to a Spotify track.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleImport} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="spotify-url">Spotify Track URL</Label>
                                        <Input id="spotify-url" name="import-url" placeholder="https://open.spotify.com/track/..." disabled={isPending} />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isPending}>
                                        {isPending ? <Loader className="animate-spin" /> : <Link className="mr-2"/>}
                                        Import from Spotify
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* SoundCloud Importer */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3"><SoundCloudIcon /> SoundCloud Importer</CardTitle>
                                <CardDescription>Paste a link to a SoundCloud track.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleImport} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="soundcloud-url">SoundCloud Track URL</Label>
                                        <Input id="soundcloud-url" name="import-url" placeholder="https://soundcloud.com/user/track" disabled={isPending}/>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isPending}>
                                        {isPending ? <Loader className="animate-spin" /> : <Link className="mr-2"/>}
                                        Import from SoundCloud
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* YouTube Importer */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3"><Youtube /> YouTube Importer</CardTitle>
                                <CardDescription>Paste a link to a YouTube video.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleImport} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="youtube-url">YouTube Video URL</Label>
                                        <Input id="youtube-url" name="import-url" placeholder="https://www.youtube.com/watch?v=..." disabled={isPending}/>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isPending}>
                                        {isPending ? <Loader className="animate-spin" /> : <Link className="mr-2"/>}
                                        Import from YouTube
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Info /> Imported Data</CardTitle>
                        <CardDescription>The data fetched from the provided URL will appear here. You can then add it to your project.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isPending && (
                            <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
                                <Loader className="h-10 w-10 animate-spin text-primary" />
                                <p>Fetching data...</p>
                            </div>
                        )}
                        {!isPending && !importedData && (
                            <div className="text-center text-muted-foreground h-64 flex flex-col items-center justify-center">
                                <Info className="h-12 w-12 mx-auto mb-2"/>
                                <p>Imported track data will be displayed here.</p>
                            </div>
                        )}
                        {importedData && (
                            <div className="space-y-4">
                                {importedData.artworkUrl && (
                                     <Image 
                                        src={importedData.artworkUrl} 
                                        alt={`Artwork for ${importedData.title}`} 
                                        width={200} 
                                        height={200} 
                                        className="rounded-md mx-auto"
                                    />
                                )}
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold font-headline">{importedData.title}</h3>
                                    <p className="text-md text-muted-foreground">{importedData.artist}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><strong className="text-muted-foreground">Album:</strong> {importedData.album || 'N/A'}</div>
                                    <div><strong className="text-muted-foreground">Duration:</strong> {importedData.duration}</div>
                                    <div><strong className="text-muted-foreground">Released:</strong> {importedData.releaseDate || 'N/A'}</div>
                                    <div><strong className="text-muted-foreground">Genre:</strong> {importedData.genre || 'N/A'}</div>
                                    <div><strong className="text-muted-foreground">Source:</strong> {importedData.source}</div>
                                </div>
                                <Button className="w-full">Add to Project Database</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    