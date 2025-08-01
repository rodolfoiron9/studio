
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Palette, Save, Loader } from "lucide-react";

// HSL values are represented as strings like "234.8 64.1% 10%"
type ThemeColors = {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  border: string;
  input: string;
  ring: string;
};

export default function UICustomizationPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    // Initial values are taken from the current globals.css
    const [colors, setColors] = useState<ThemeColors>({
        background: "234.8 64.1% 10%",
        foreground: "240 100% 99%",
        primary: "282.8 100% 61.4%",
        secondary: "234.8 64.1% 20%",
        accent: "182.5 100% 74.3%",
        muted: "234.8 64.1% 20%",
        border: "234.8 64.1% 20%",
        input: "234.8 64.1% 20%",
        ring: "182.5 100% 74.3%",
    });

    const handleColorChange = (name: keyof ThemeColors, value: string) => {
        setColors(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        // In a real application, a server action would update globals.css
        // For this demo, we'll simulate the save and show a toast.
        setTimeout(() => {
            toast({
                title: "Theme Saved!",
                description: "Your new color theme has been applied. (Simulation)",
            });
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-4 font-headline">UI Customization</h1>
            <p className="text-muted-foreground mb-8">Customize the look and feel of your public-facing application by changing the theme colors.</p>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Palette /> Theme Color Editor</CardTitle>
                        <CardDescription>Adjust the HSL values for the core color variables. Changes will apply site-wide.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(colors).map(([name, value]) => (
                            <div key={name} className="space-y-2">
                                <Label htmlFor={name} className="capitalize">{name}</Label>
                                <Input 
                                    id={name} 
                                    value={value}
                                    onChange={(e) => handleColorChange(name as keyof ThemeColors, e.target.value)}
                                    placeholder="H S% L%"
                                    disabled={isLoading}
                                />
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="border-t pt-6">
                        <Button type="submit" disabled={isLoading} className="ml-auto">
                            {isLoading ? <Loader className="animate-spin" /> : <Save className="mr-2" />}
                            {isLoading ? "Saving..." : "Save Theme"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
