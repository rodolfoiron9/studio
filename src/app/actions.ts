"use server";

import { generateCubePreset } from "@/ai/flows/generate-cube-preset";
import { generateEnvironment } from "@/ai/flows/generate-environment";
import { generateQuantumAnimation } from "@/ai/flows/generate-quantum-animation";
import { generateVideo } from "@/ai/flows/generate-video";
import { generateAlbumArt } from "@/ai/flows/generate-album-art";
import { generateMarketingCopy } from "@/ai/flows/generate-marketing-copy";
import {promises as fs} from 'fs';
import path from 'path';

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function runPresetGenerator(musicStyle: string): Promise<ActionResult<Awaited<ReturnType<typeof generateCubePreset>>>> {
    try {
        const result = await generateCubePreset({ musicStyle });
        return { success: true, data: result };
    } catch (error) {
        console.error("Preset generation failed:", error);
        return { success: false, error: "Failed to generate preset. Please try again." };
    }
}

export async function runEnvironmentGenerator(environmentDescription: string): Promise<ActionResult<Awaited<ReturnType<typeof generateEnvironment>>>> {
    try {
        const result = await generateEnvironment({ environmentDescription });
        return { success: true, data: result };
    } catch (error) {
        console.error("Environment generation failed:", error);
        return { success: false, error: "Failed to generate environment. Please try again." };
    }
}

export async function runAnimationGenerator(cubeCustomization: string, musicStyle: string): Promise<ActionResult<Awaited<ReturnType<typeof generateQuantumAnimation>>>> {
    try {
        const result = await generateQuantumAnimation({ cubeCustomization, musicStyle });
        return { success: true, data: result };
    } catch (error) {
        console.error("Animation generation failed:", error);
        return { success: false, error: "Failed to generate animation idea. Please try again." };
    }
}

export async function runVideoGenerator(prompt: string): Promise<ActionResult<Awaited<ReturnType<typeof generateVideo>>>> {
    try {
        const result = await generateVideo({ prompt });
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Video generation failed:", error);
        return { success: false, error: `Video generation failed: ${error.message}` };
    }
}

export async function runAlbumArtGenerator(prompt: string): Promise<ActionResult<Awaited<ReturnType<typeof generateAlbumArt>>>> {
    try {
        const result = await generateAlbumArt({ prompt });
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Album art generation failed:", error);
        return { success: false, error: `Album art generation failed: ${error.message}` };
    }
}

export async function runMarketingAgent(trackTitle: string): Promise<ActionResult<Awaited<ReturnType<typeof generateMarketingCopy>>>> {
    try {
        const result = await generateMarketingCopy({
            artistName: "RudyBtz",
            albumName: "Making Magic",
            trackTitle,
        });
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Marketing agent failed:", error);
        return { success: false, error: `Marketing agent failed: ${error.message}` };
    }
}

export async function updateTheme(colors: Record<string, string>): Promise<ActionResult<string>> {
  try {
    const cssPath = path.join(process.cwd(), 'src', 'app', 'globals.css');
    let cssContent = await fs.readFile(cssPath, 'utf8');
    
    Object.entries(colors).forEach(([name, value]) => {
        const regex = new RegExp(`--${name}:\\s*([\\d.]+\\s+[\\d.]+%\\s+[\\d.]+)%`, 'g');
        cssContent = cssContent.replace(regex, `--${name}: ${value}`);
    });
    
    // This is a placeholder for the actual file write, as it's restricted.
    // In a real scenario, you would use fs.writeFile here.
    console.log("Simulating theme update. New CSS content would be:", cssContent.substring(0, 500) + "...");
    
    return { success: true, data: "Theme updated successfully (simulation)." };
  } catch (error: any) {
    console.error("Theme update failed:", error);
    return { success: false, error: `Failed to update theme: ${error.message}` };
  }
}
