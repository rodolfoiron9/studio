
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Image as ImageIcon, Folder, FileJson, UploadCloud } from "lucide-react";

export default function FileManagementPage() {
    
    const renderPlaceholder = (title: string) => (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>This section is under construction. Check back later for file management features.</CardDescription>
            </CardHeader>
        </Card>
    );

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-4 font-headline">File Management</h1>
            <p className="text-muted-foreground mb-8">Organize, upload, and manage all your project assets.</p>

            <Tabs defaultValue="images">
                <TabsList className="grid w-full grid-cols-5 mb-4">
                    <TabsTrigger value="images"><ImageIcon className="mr-2"/>Images</TabsTrigger>
                    <TabsTrigger value="music"><Music className="mr-2"/>Music</TabsTrigger>
                    <TabsTrigger value="models"><Folder className="mr-2"/>3D Models</TabsTrigger>
                    <TabsTrigger value="presets"><FileJson className="mr-2"/>Presets</TabsTrigger>
                    <TabsTrigger value="upload"><UploadCloud className="mr-2"/>Upload</TabsTrigger>
                </TabsList>
                
                <TabsContent value="images">
                    {renderPlaceholder("Image & Album Art Library")}
                </TabsContent>
                <TabsContent value="music">
                    {renderPlaceholder("Music & Audio Files")}
                </TabsContent>
                <TabsContent value="models">
                    {renderPlaceholder("3D Cube Models")}
                </TabsContent>
                <TabsContent value="presets">
                    {renderPlaceholder("JSON Preset Files")}
                </TabsContent>
                <TabsContent value="upload">
                     <Card>
                        <CardHeader>
                            <CardTitle>Uploader</CardTitle>
                            <CardDescription>This section is under construction. Check back later to upload files.</CardDescription>
                        </CardHeader>
                     </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
