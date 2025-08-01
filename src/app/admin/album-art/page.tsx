
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Image } from "lucide-react";

export default function AlbumArtPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4 font-headline">AI Album Art Generator</h1>
      <p className="text-muted-foreground mb-8">Create stunning, professional-quality album covers using AI.</p>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Image /> Generate New Art</CardTitle>
                <CardDescription>Use a text prompt to generate unique album art. Describe the style, mood, and content you envision.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-center text-muted-foreground">Album art generation tools will be built here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
