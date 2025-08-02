
"use client";

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Palette, Save, Loader, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateTheme } from '@/app/actions';

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

type ThemeFonts = {
    headline: string;
    body: string;
}

const initialColors: ThemeColors = {
    background: "234.8 64.1% 10%",
    foreground: "240 100% 99%",
    primary: "282.8 100% 61.4%",
    secondary: "234.8 64.1% 20%",
    accent: "182.5 100% 74.3%",
    muted: "234.8 64.1% 20%",
    border: "234.8 64.1% 20%",
    input: "234.8 64.1% 20%",
    ring: "182.5 100% 74.3%",
};

const initialFonts: ThemeFonts = {
    headline: "'Space Grotesk', sans-serif",
    body: "'Space Grotesk', sans-serif",
}

// Helper to convert HEX to HSL string
function hexToHsl(hex: string): string {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }

    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h} ${s}% ${l}%`;
}

// Helper to convert HSL string to HEX
function hslToHex(hslStr: string): string {
    const [h, s, l] = hslStr.match(/\d+(\.\d+)?/g)!.map(Number);
    const s_norm = s / 100;
    const l_norm = l / 100;
    const c = (1 - Math.abs(2 * l_norm - 1)) * s_norm;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l_norm - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { [r,g,b] = [c,x,0]; }
    else if (h >= 60 && h < 120) { [r,g,b] = [x,c,0]; }
    else if (h >= 120 && h < 180) { [r,g,b] = [0,c,x]; }
    else if (h >= 180 && h < 240) { [r,g,b] = [0,x,c]; }
    else if (h >= 240 && h < 300) { [r,g,b] = [x,0,c]; }
    else if (h >= 300 && h < 360) { [r,g,b] = [c,0,x]; }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}


export default function UICustomizationPage() {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [colors, setColors] = useState<ThemeColors>(initialColors);
    const [fonts, setFonts] = useState<ThemeFonts>(initialFonts);

    // Apply styles to the document in real-time
    useEffect(() => {
        const root = document.documentElement;
        Object.entries(colors).forEach(([name, value]) => {
            root.style.setProperty(`--${name}`, value);
        });
        root.style.setProperty('--font-headline', fonts.headline);
        root.style.setProperty('--font-body', fonts.body);
    }, [colors, fonts]);

    const handleColorChange = (name: keyof ThemeColors, value: string) => {
        setColors(prev => ({ ...prev, [name]: hexToHsl(value) }));
    };

     const handleFontChange = (type: keyof ThemeFonts, value: string) => {
        setFonts(prev => ({ ...prev, [type]: value }));
    };

    const handleReset = () => {
        setColors(initialColors);
        setFonts(initialFonts);
        toast({ title: "Theme Reset", description: "The theme has been reset to its default values."});
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        startTransition(async () => {
            toast({ title: "Saving Theme...", description: "Applying your new theme permanently."});
            
            const result = await updateTheme(colors);

            if (result.success) {
                 toast({
                    title: "Theme Saved!",
                    description: "Your new color theme has been applied. A page refresh may be needed to see changes everywhere.",
                });
            } else {
                 toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Live UI Customization</h1>
                    <p className="text-muted-foreground">Customize the look and feel of your application. Changes are previewed live.</p>
                </div>
                 <Button onClick={handleReset} variant="outline" disabled={isPending}>
                    <RefreshCw className="mr-2"/> Reset to Default
                </Button>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Palette /> Theme Editor</CardTitle>
                        <CardDescription>Adjust colors and fonts. Your changes will be applied instantly to this dashboard for preview.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Color Editor */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium font-headline">Colors</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {Object.entries(colors).map(([name, value]) => (
                                    <div key={name} className="space-y-2">
                                        <Label htmlFor={name} className="capitalize flex items-center gap-2">
                                             <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: hslToHex(value) }}></div>
                                            {name.replace(/([A-Z])/g, ' $1')}
                                        </Label>
                                        <div className="relative">
                                            <input 
                                                type="color"
                                                id={name} 
                                                value={hslToHex(value)}
                                                onChange={(e) => handleColorChange(name as keyof ThemeColors, e.target.value)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                disabled={isPending}
                                            />
                                            <div className="h-10 w-full rounded-md border border-input px-3 py-2 text-sm flex items-center" style={{ backgroundColor: hslToHex(value) }}>
                                                <span className="mix-blend-difference text-white">{hslToHex(value)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Font Editor */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium font-headline">Fonts</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="font-headline">Headline Font</Label>
                                    <Select value={fonts.headline} onValueChange={(value) => handleFontChange('headline', value)} disabled={isPending}>
                                        <SelectTrigger id="font-headline"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="'Space Grotesk', sans-serif" style={{fontFamily: "'Space Grotesk', sans-serif"}}>Space Grotesk</SelectItem>
                                            <SelectItem value="'Source Code Pro', monospace" style={{fontFamily: "'Source Code Pro', monospace"}}>Source Code Pro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="font-body">Body Font</Label>
                                    <Select value={fonts.body} onValueChange={(value) => handleFontChange('body', value)} disabled={isPending}>
                                        <SelectTrigger id="font-body"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="'Space Grotesk', sans-serif" style={{fontFamily: "'Space Grotesk', sans-serif"}}>Space Grotesk</SelectItem>
                                            <SelectItem value="'Source Code Pro', monospace" style={{fontFamily: "'Source Code Pro', monospace"}}>Source Code Pro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t pt-6">
                        <Button type="submit" disabled={isPending} className="ml-auto">
                            {isPending ? <Loader className="animate-spin" /> : <Save className="mr-2" />}
                            {isPending ? "Saving..." : "Save and Apply Theme"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
