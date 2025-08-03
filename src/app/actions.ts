
"use server";

import { generateCubePreset } from "@/ai/flows/generate-cube-preset";
import { generateEnvironment } from "@/ai/flows/generate-environment";
import { generateQuantumAnimation } from "@/ai/flows/generate-quantum-animation";
import { generateVideo } from "@/ai/flows/generate-video";
import { generateAlbumArt } from "@/ai/flows/generate-album-art";
import { generateMarketingCopy } from "@/ai/flows/generate-marketing-copy";
import { manageData } from "@/ai/flows/manage-data";
import { importTrack } from "@/ai/flows/import-track";
import { listFiles as listStorageFiles, deleteFile as deleteStorageFile } from "@/ai/flows/manage-files";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getApp } from "firebase/app";
import { promises as fs } from 'fs';
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

export async function runFullPresetGenerator(prompt: string): Promise<ActionResult<{
    cube: Awaited<ReturnType<typeof generateCubePreset>>;
    environment: Awaited<ReturnType<typeof generateEnvironment>>;
}>> {
     try {
        const [cubeResult, environmentResult] = await Promise.all([
            generateCubePreset({ musicStyle: prompt }),
            generateEnvironment({ environmentDescription: prompt })
        ]);
        
        return { success: true, data: { cube: cubeResult, environment: environmentResult } };
    } catch (error: any) {
        console.error("Full preset generation failed:", error);
        return { success: false, error: `Failed to generate full preset: ${error.message}` };
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

export async function runDataAgent(query: string): Promise<ActionResult<Awaited<ReturnType<typeof manageData>>>> {
    try {
        const result = await manageData({ query });
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Data agent failed:", error);
        return { success: false, error: `Data agent failed: ${error.message}` };
    }
}

export async function runTrackImporter(url: string): Promise<ActionResult<Awaited<ReturnType<typeof importTrack>>>> {
    try {
        const result = await importTrack({ url });
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Track importer failed:", error);
        return { success: false, error: `Track importer failed: ${error.message}` };
    }
}

export async function saveApiKeys(keys: Record<string, string>): Promise<ActionResult<string>> {
    try {
        const envPath = path.join(process.cwd(), '.env');
        let envContent = "";
        try {
            envContent = await fs.readFile(envPath, 'utf8');
        } catch (error: any) {
            if (error.code !== 'ENOENT') { // ENOENT means file doesn't exist, which is fine
                throw error;
            }
        }

        const lines = envContent.split('\n');
        const newLines: string[] = [];
        const keysToUpdate = { ...keys };

        lines.forEach(line => {
            if (line.trim() === '') {
                return;
            }
            let keyFound = false;
            for (const key in keysToUpdate) {
                if (line.startsWith(`${key}=`)) {
                    newLines.push(`${key}=${keysToUpdate[key]}`);
                    delete keysToUpdate[key];
                    keyFound = true;
                    break;
                }
            }
            if (!keyFound) {
                newLines.push(line);
            }
        });

        for (const key in keysToUpdate) {
             newLines.push(`${key}=${keysToUpdate[key]}`);
        }
        
        await fs.writeFile(envPath, newLines.join('\n'), 'utf8');
        
        return { success: true, data: "API keys saved successfully. Please restart the server for changes to take effect." };
    } catch (error: any) {
        console.error("API key saving failed:", error);
        return { success: false, error: `Failed to save API keys: ${error.message}` };
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
    
    await fs.writeFile(cssPath, cssContent, 'utf8');
    
    return { success: true, data: "Theme updated successfully." };
  } catch (error: any) {
    console.error("Theme update failed:", error);
    return { success: false, error: `Failed to update theme: ${error.message}` };
  }
}


export async function listFiles(): Promise<ActionResult<Awaited<ReturnType<typeof listStorageFiles>>>> {
    try {
        const result = await listStorageFiles();
        return { success: true, data: result };
    } catch (error: any) {
        console.error("File listing failed:", error);
        return { success: false, error: `Failed to list files: ${error.message}` };
    }
}

export async function deleteFile(path: string): Promise<ActionResult<string>> {
    try {
        await deleteStorageFile({ path });
        return { success: true, data: "File deleted successfully." };
    } catch (error: any) {
        console.error("File deletion failed:", error);
        return { success: false, error: `Failed to delete file: ${error.message}` };
    }
}
