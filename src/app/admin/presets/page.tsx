
"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { runFullPresetGenerator } from "@/app/actions";
import { Loader, Wand2, VenetianMask, Image as ImageIcon, Sparkles, Check } from "lucide-react";
import Image from "next/image";
import type { GenerateCubePresetOutput } from "@/ai/flows/generate-cube-preset";

type FullPreset = {
    cube: GenerateCubePresetOutput;
    environment: { environmentImage: string };
};

export default function PresetsPage() {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState("A futuristic cube in a synthwave landscape, glowing neon grids, 8k");
    const [generatedPreset, setGeneratedPreset] = useState<FullPreset | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setGeneratedPreset(null);
        startTransition(async () => {
            toast({ title: "Generating Scene...", description: "The AI is creating your preset. This may take a moment." });
            const result = await runFullPresetGenerator(prompt);
            if (result.success && result.data) {
                setGeneratedPreset(result.data);
                toast({ title: "Success!", description: "Your new scene has been generated." });
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    }

    const handleApplyPreset = () => {
        if (!generatedPreset) return;
        // In a real app, you would have a state management solution (like Zustand or Context)
        // to pass this preset to the main page component.
        // For this prototype, we'll just show a success message.
        localStorage.setItem('appliedPreset', JSON.stringify(generatedPreset));
        toast({ 
            title: "Preset Applied!", 
            description: "The main experience has been updated. Go to the Public Site to see it.",
            action: (
                <a href="/" target="_blank">
                    <Button variant="secondary">View</Button>
                </a>
            )
        });
    }

    const renderPresetDetails = (cube: GenerateCubePresetOutput) => (
        <div className="space-y-4 text-sm">
            <div className="grid grid-cols-3 gap-2">
                {Object.entries(cube)
                    .filter(([key]) => key.startsWith('faceColor'))
                    .map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded border" style={{ backgroundColor: value as string }} />
                        <span className="capitalize">{key.replace('Color', ' ')}</span>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
                <p><strong>Edge Style:</strong> {cube.edgeStyle}</p>
                <p><strong>Roundness:</strong> {cube.roundness.toFixed(2)}</p>
                <p><strong>Wireframe:</strong> {cube.wireframe ? 'Yes' : 'No'}</p>
                <p><strong>Background:</strong> {cube.background}</p>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-4 font-headline">AI Scene Preset Manager</h1>
            <p className="text-muted-foreground mb-8">Generate a cohesive visual experience—environment and 3D object—from a single creative prompt.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1">
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Wand2 /> Scene Generator</CardTitle>
                            <CardDescription>Describe the scene you want to create. The AI will generate a background and a matching cube style.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="art-prompt">Creative Prompt</Label>
                                <Textarea
                                    id="art-prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g., A serene zen garden with a minimalist stone cube"
                                    className="min-h-[120px]"
                                    disabled={isPending}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? <Loader className="animate-spin" /> : <Sparkles className="mr-2" />}
                                {isPending ? "Generating..." : "Generate Scene"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <div className="lg:col-span-2 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ImageIcon /> Generated Environment</CardTitle>
                             <CardDescription>The AI-generated background image for your scene.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center aspect-video border-2 border-dashed border-muted rounded-lg">
                            {isPending && (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <Loader className="h-10 w-10 animate-spin text-primary" />
                                    <p>Generating image...</p>
                                </div>
                            )}
                            {!isPending && generatedPreset?.environment.environmentImage && (
                                <Image
                                    src={generatedPreset.environment.environmentImage}
                                    alt="Generated environment"
                                    width={512}
                                    height={288}
                                    className="rounded-md object-cover"
                                />
                            )}
                            {!isPending && !generatedPreset && (
                                <div className="text-center text-muted-foreground">
                                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                                    <p>Your generated environment will appear here.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><VenetianMask /> Generated Cube Preset</CardTitle>
                             <CardDescription>The AI-generated style for the 3D cube.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           {isPending && (
                                <div className="flex flex-col items-center justify-center h-24 gap-2 text-muted-foreground">
                                    <Loader className="h-10 w-10 animate-spin text-primary" />
                                    <p>Generating preset...</p>
                                </div>
                            )}
                            {!isPending && generatedPreset?.cube && renderPresetDetails(generatedPreset.cube)}
                            {!isPending && !generatedPreset && (
                                <div className="text-center text-muted-foreground h-24 flex items-center justify-center">
                                    <p>Your generated cube preset details will appear here.</p>
                                </div>
                            )}
                        </CardContent>
                         <CardFooter>
                            <Button onClick={handleApplyPreset} className="w-full" disabled={isPending || !generatedPreset}>
                                <Check className="mr-2" />
                                Apply to Main Experience
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
