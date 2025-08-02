
'use server';
/**
 * @fileOverview An AI agent for managing files in Firebase Storage.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getStorage, ref, listAll, getMetadata, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '@/lib/firebase';

const storage = getStorage(app);

const FileSchema = z.object({
    name: z.string(),
    path: z.string(),
    url: z.string().url(),
    type: z.enum(['image', 'audio', 'video', 'json', 'other']),
    size: z.number(),
    createdAt: z.string(),
});
export type ManagedFile = z.infer<typeof FileSchema>;

const ListFilesOutputSchema = z.array(FileSchema);
export type ListFilesOutput = z.infer<typeof ListFilesOutputSchema>;

const DeleteFileInputSchema = z.object({
    path: z.string().describe("The full path to the file in Firebase Storage."),
});
export type DeleteFileInput = z.infer<typeof DeleteFileInputSchema>;

function getFileType(contentType: string = ''): ManagedFile['type'] {
    if (contentType.startsWith('image/')) return 'image';
    if (contentType.startsWith('audio/')) return 'audio';
    if (contentType.startsWith('video/')) return 'video';
    if (contentType === 'application/json') return 'json';
    return 'other';
}

export async function listFiles(): Promise<ListFilesOutput> {
    const storageRef = ref(storage, '');
    const res = await listAll(storageRef);

    const files = await Promise.all(
        res.items.map(async (itemRef) => {
            const metadata = await getMetadata(itemRef);
            const url = await getDownloadURL(itemRef);
            return {
                name: metadata.name,
                path: itemRef.fullPath,
                url,
                type: getFileType(metadata.contentType),
                size: metadata.size,
                createdAt: metadata.timeCreated,
            };
        })
    );
    return files;
}


export async function deleteFile(input: DeleteFileInput): Promise<void> {
  const fileRef = ref(storage, input.path);
  await deleteObject(fileRef);
}

