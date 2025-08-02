
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Image as ImageIcon, FileJson, UploadCloud, MoreVertical, FileText, Trash2, Download, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

type FileType = 'image' | 'audio' | 'preset' | 'video';

interface MockFile {
    name: string;
    type: FileType;
    size: string;
    date: string;
    source: 'User Upload' | 'AI Generated';
}

const mockFiles: MockFile[] = [
    { name: "album-art-final.png", type: 'image', size: "1.2MB", date: "2024-08-01", source: 'AI Generated'},
    { name: "cyberpunk-bg.jpeg", type: 'image', size: "2.5MB", date: "2024-07-30", source: 'AI Generated'},
    { name: "rising_above.mp3", type: 'audio', size: "8.9MB", date: "2024-07-29", source: 'User Upload'},
    { name: "dark-dnb-preset.json", type: 'preset', size: "12KB", date: "2024-07-28", source: 'AI Generated'},
    { name: "futuristic-city.mp4", type: 'video', size: "15.3MB", date: "2024-07-27", source: 'AI Generated'},
    { name: "user-avatar.png", type: 'image', size: "300KB", date: "2024-07-26", source: 'User Upload'},
];


export default function FileManagementPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [files, setFiles] = useState<MockFile[]>(mockFiles);

    const getIcon = (type: FileType) => {
        switch (type) {
            case 'image': return <ImageIcon className="h-5 w-5" />;
            case 'audio': return <Music className="h-5 w-5" />;
            case 'preset': return <FileJson className="h-5 w-5" />;
            case 'video': return <FileText className="h-5 w-5" />; // Using FileText for video as placeholder
            default: return <FileText className="h-5 w-5" />;
        }
    }
    
    const renderFileBrowser = (title: string, description: string, filterType: FileType) => (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">Type</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {files.filter(f => f.type === filterType).map(file => (
                            <TableRow key={file.name}>
                                <TableCell className="text-muted-foreground">{getIcon(file.type)}</TableCell>
                                <TableCell className="font-medium">{file.name}</TableCell>
                                <TableCell>
                                    <Badge variant={file.source === 'AI Generated' ? 'default' : 'secondary'}>
                                        {file.source}
                                    </Badge>
                                </TableCell>
                                <TableCell>{file.size}</TableCell>
                                <TableCell>{file.date}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem><Pencil className="mr-2"/> Rename</DropdownMenuItem>
                                            <DropdownMenuItem><Download className="mr-2"/> Download</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2"/> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-4 font-headline">File Management</h1>
            <p className="text-muted-foreground mb-8">Organize, upload, and manage all your project assets.</p>

            <Tabs defaultValue="images" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                    <TabsTrigger value="images"><ImageIcon className="mr-2"/>Images & Art</TabsTrigger>
                    <TabsTrigger value="music"><Music className="mr-2"/>Music & Audio</TabsTrigger>
                    <TabsTrigger value="presets"><FileJson className="mr-2"/>Presets & Data</TabsTrigger>
                    <TabsTrigger value="upload"><UploadCloud className="mr-2"/>Upload Files</TabsTrigger>
                </TabsList>
                
                <TabsContent value="images">
                    {renderFileBrowser("Image & Album Art Library", "Manage uploaded images and AI-generated album covers.", 'image')}
                </TabsContent>
                <TabsContent value="music">
                    {renderFileBrowser("Music & Audio Files", "A library of all your uploaded tracks and audio samples.", 'audio')}
                </TabsContent>
                <TabsContent value="presets">
                    {renderFileBrowser("JSON Preset Files", "Manage saved cube customization presets and other JSON data.", 'preset')}
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
                                    {selectedFile ? `Selected: ${selectedFile.name}` : "Drag and drop files here, or click to select files."}
                                </p>
                                <div className="flex w-full max-w-sm items-center space-x-2">
                                    <Input 
                                        type="file" 
                                        onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                                    />
                                    <Button type="submit" disabled={!selectedFile}>Upload</Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">Max file size: 50MB. File upload functionality is for demonstration.</p>
                           </div>
                        </CardContent>
                     </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
