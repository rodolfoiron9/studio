
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Home, Settings, Database, Palette, KeyRound, Film, Image, Megaphone, Link as LinkIcon } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4 font-headline">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome to the control center for the RudyBtz Albumverse.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Database/> Data Management</CardTitle>
                <CardDescription>Manage datasets, databases, and content for the application.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm">Use the AI Agent to interact with your data, check for quality, and get enhancement suggestions.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Palette/> UI Customization</CardTitle>
                <CardDescription>Control the look and feel of the public-facing application.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm">Modify themes, colors, and layouts without touching the code directly.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><KeyRound/> API Keys</CardTitle>
                <CardDescription>Securely store and manage API keys for various services.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm">Manage keys for Genkit, Spotify, YouTube, and other integrations.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Film/> Veo Fine-Tuning</CardTitle>
                <CardDescription>Fine-tune video generation for each song in the album.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm">Train the AI on specific visual styles to create unique videos for every track.</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Image/> Album Art Creation</CardTitle>
                <CardDescription>Generate unique album art using AI.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm">Use AI to design stunning, professional-quality album covers.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Megaphone/> AI Marketing</CardTitle>
                <CardDescription>Automate social media sharing and promotion.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm">Let the AI agent schedule and post updates across multiple social networks.</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><LinkIcon/> Link Importer</CardTitle>
                <CardDescription>Import tracks from external services.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm">Load songs and their data directly from Spotify, SoundCloud, or YouTube links.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
