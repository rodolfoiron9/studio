
"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Image as ImageIcon, FileJson, UploadCloud, MoreVertical, FileText, Trash2, Download, Pencil, Loader, RefreshCw, Video, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import type { ManagedFile } from "@/lib/types";
import { listFiles, deleteFile } from "@/app/actions";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { formatDistanceToNow } from 'date-fns';

export default function FileManagementPage() {
    const { toast } = useToast();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [files, setFiles] = useState<ManagedFile[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isListing, startListingTransition] = useTransition();
    const [isDeleting, startDeletingTransition] = useTransition();

    const fetchFiles = () => {
        startListingTransition(async () => {
            const result = await listFiles();
            if (result.success) {
                setFiles(result.data);
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setUploadProgress(0);
        const storageRef = ref(storage, selectedFile.name);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                toast({ variant: 'destructive', title: "Upload Error", description: error.message });
                setIsUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(() => {
                    toast({ title: "Upload Complete", description: `${selectedFile.name} has been uploaded.` });
                    setIsUploading(false);
                    setSelectedFile(null);
                    fetchFiles(); // Refresh the file list
                });
            }
        );
    };

    const handleDelete = (path: string) => {
        startDeletingTransition(async () => {
            const result = await deleteFile(path);
            if (result.success) {
                toast({ title: "File Deleted", description: "The file has been removed from storage."});
                fetchFiles(); // Refresh the file list
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
            }
        });
    }

    const getIcon = (type: ManagedFile['type']) => {
        switch (type) {
            case 'image': return <ImageIcon className="h-5 w-5" />;
            case 'audio': return <Music className="h-5 w-5" />;
            case 'json': return <FileJson className="h-5 w-5" />;
            case 'video': return <Video className="h-5 w-5" />;
            default: return <FileText className="h-5 w-5" />;
        }
    }

    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    const renderFileBrowser = (title: string, description: string) => (
        <Card>
            <CardHeader className="flex flex-row justify-between items-start">
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                 <Button variant="outline" size="sm" onClick={fetchFiles} disabled={isListing}>
                    {isListing ? <Loader className="mr-2 animate-spin"/> : <RefreshCw className="mr-2"/>}
                    Refresh
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">Type</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isListing ? (
                             Array.from({length: 5}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={5} className="p-2"><div className="h-8 bg-muted rounded animate-pulse"></div></TableCell>
                                </TableRow>
                            ))
                        ) : files.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                    No files found in storage.
                                </TableCell>
                            </TableRow>
                        ) : (
                            files.map(file => (
                                <TableRow key={file.path}>
                                    <TableCell className="text-muted-foreground">{getIcon(file.type)}</TableCell>
                                    <TableCell className="font-medium hover:underline">
                                        <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                                    </TableCell>
                                    <TableCell>{formatBytes(file.size)}</TableCell>
                                    <TableCell>{formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" disabled={isDeleting}>
                                                    {isDeleting ? <Loader className="animate-spin"/> : <MoreVertical className="h-4 w-4" />}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onSelect={() => window.open(file.url, '_blank')}>
                                                    <Download className="mr-2"/> Download
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onSelect={() => handleDelete(file.path)}>
                                                    <Trash2 className="mr-2"/> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-4 font-headline">File Management</h1>
            <p className="text-muted-foreground mb-8">Organize, upload, and manage all your project assets in Firebase Storage.</p>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="all"><Folder className="mr-2"/>All Files</TabsTrigger>
                    <TabsTrigger value="upload"><UploadCloud className="mr-2"/>Upload Files</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                    {renderFileBrowser("Cloud Storage Library", "All files currently stored in your Firebase Storage bucket.")}
                </TabsContent>
                <TabsContent value="upload">
                     <Card>
                        <CardHeader>
                            <CardTitle>File Uploader</CardTitle>
                            <CardDescription>Upload new assets to your project. Select a file and click upload.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-muted rounded-lg p-8 space-y-4">
                                <UploadCloud className="h-16 w-16 text-muted-foreground"/>
                                <p className="text-muted-foreground text-center">
                                    {selectedFile ? `Selected: ${selectedFile.name} (${formatBytes(selectedFile.size)})` : "Drag and drop files here, or click to select files."}
                                </p>
                                <div className="flex w-full max-w-sm items-center space-x-2">
                                    <Input 
                                        type="file" 
                                        onChange={handleFileChange}
                                        disabled={isUploading}
                                    />
                                    <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
                                       {isUploading ? <Loader className="animate-spin" /> : <UploadCloud />}
                                    </Button>
                                </div>
                                {isUploading && (
                                    <div className="w-full max-w-sm">
                                        <Progress value={uploadProgress} className="w-full" />
                                        <p className="text-xs text-center mt-1">{Math.round(uploadProgress)}%</p>
                                    </div>
                                )}
                                {!isUploading && <p className="text-xs text-muted-foreground mt-2">Max file size: 50MB.</p> }
                           </div>
                        </CardContent>
                     </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
