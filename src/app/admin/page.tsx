
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Home, Settings, Database, Palette, KeyRound, Film, Image, Megaphone, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  
  const features = [
    { 
      href: "/admin/database", 
      icon: <Database/>, 
      title: "Data Management", 
      description: "Manage datasets, databases, and content for the application.",
      content: "Use the AI Agent to interact with your data, check for quality, and get enhancement suggestions."
    },
    { 
      href: "/admin/ui-customization", 
      icon: <Palette/>, 
      title: "UI Customization", 
      description: "Control the look and feel of the public-facing application.",
      content: "Modify themes, colors, and layouts without touching the code directly."
    },
    { 
      href: "/admin/api-keys", 
      icon: <KeyRound/>, 
      title: "API Keys", 
      description: "Securely store and manage API keys for various services.",
      content: "Manage keys for Genkit, Spotify, YouTube, and other integrations."
    },
    { 
      href: "/admin/video-tuning", 
      icon: <Film/>, 
      title: "Veo Fine-Tuning", 
      description: "Fine-tune video generation for each song in the album.",
      content: "Train the AI on specific visual styles to create unique videos for every track."
    },
    { 
      href: "/admin/album-art", 
      icon: <Image/>, 
      title: "Album Art Creation", 
      description: "Generate unique album art using AI.",
      content: "Use AI to design stunning, professional-quality album covers."
    },
    { 
      href: "/admin/marketing", 
      icon: <Megaphone/>, 
      title: "AI Marketing", 
      description: "Automate social media sharing and promotion.",
      content: "Let the AI agent schedule and post updates across multiple social networks."
    },
    { 
      href: "/admin/link-importer", 
      icon: <LinkIcon/>, 
      title: "Link Importer", 
      description: "Import tracks from external services.",
      content: "Load songs and their data directly from Spotify, SoundCloud, or YouTube links."
    }
  ]

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4 font-headline">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome to the control center for the RudyBtz Albumverse.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(feature => (
           <Link href={feature.href} key={feature.title}>
            <Card className="h-full hover:border-primary transition-colors">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">{feature.icon} {feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">{feature.content}</p>
                </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
