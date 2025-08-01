"use server";

import { generateCubePreset } from "@/ai/flows/generate-cube-preset";
import { generateEnvironment } from "@/ai/flows/generate-environment";
import { generateQuantumAnimation } from "@/ai/flows/generate-quantum-animation";
import { generateVideo } from "@/ai/flows/generate-video";
import { generateAlbumArt } from "@/ai/flows/generate-album-art";

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
