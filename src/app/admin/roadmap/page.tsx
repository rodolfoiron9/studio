
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CircleDashed, Rocket } from "lucide-react";

export default function RoadmapPage() {
  const roadmap = {
    done: [
      { title: "Interactive 3D Cube Experience", description: "Core scene with music visualization." },
      { title: "AI Scene Preset Generator", description: "Generate environments and cube styles from a prompt." },
      { title: "File Management System", description: "Upload and manage assets in Firebase Storage." },
      { title: "AI Data Agent", description: "Conversational interface for project data." },
      { title: "Live UI Customization", description: "Real-time theme editor for colors and fonts." },
      { title: "AI Marketing & Album Art", description: "Generate social media content and cover art." },
      { title: "Veo AI Video Generation", description: "Create background videos from text prompts." },
      { title: "Admin Dashboard Hub", description: "Centralized navigation for all admin tools." },
      { title: "Link Importer", description: "Import track data from Spotify, YouTube, etc." },
    ],
    inProgress: [
      { title: "Integrating Entangled Visual Algorithms", description: "Enhance audio-reactivity to link specific visual effects to distinct audio frequencies." },
      { title: "Developing Superpositional Audio Logic", description: "Implement audio blending and visual 'superposition' effects for the pre-selection state." },
       { title: "Optimizing Observer Effect Interactions", description: "Refine the 'Quantum Fluctuation' feature to create subtle, user-influenced visual artifacts." },
    ],
    future: [
      { title: "Preset Saving & Management", description: "Save generated scenes to a database for reuse across tracks." },
      { title: "Full E-commerce Integration", description: "Sell merchandise and digital downloads directly." },
      { title: "User Accounts & Profiles", description: "Allow fans to save their own cube customizations." },
    ]
  };

  const renderRoadmapColumn = (title: string, items: {title: string, description: string}[], icon: React.ReactNode) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-2xl font-bold font-headline">{title}</h2>
        <Badge variant="secondary">{items.length}</Badge>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4 font-headline">Development Roadmap</h1>
      <p className="text-muted-foreground mb-8">
        An overview of the project's progress and future features, now with Quantum Milestones.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {renderRoadmapColumn("Done", roadmap.done, <CheckCircle2 className="h-6 w-6 text-green-500" />)}
        {renderRoadmapColumn("In Progress", roadmap.inProgress, <Rocket className="h-6 w-6 text-blue-500" />)}
        {renderRoadmapColumn("Future", roadmap.future, <CircleDashed className="h-6 w-6 text-muted-foreground" />)}
      </div>
    </div>
  );
}
