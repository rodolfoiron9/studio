"use client";

import * as React from "react";
import { ThreeScene } from "@/components/three-scene";
import { LandingContent } from "@/components/landing-content";
import { CustomizationPanel } from "@/components/customization-panel";
import type { CubeCustomization } from "@/lib/types";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings, Loader } from "lucide-react";

export default function Home() {
  const [isMounted, setIsMounted] = React.useState(false);
  const [customization, setCustomization] = React.useState<CubeCustomization>({
    faceColor1: "#9400D3",
    faceColor2: "#4B0082",
    faceColor3: "#7DF9FF",
    faceColor4: "#1A237E",
    faceColor5: "#FFFFFF",
    faceColor6: "#000000",
    edgeStyle: "round",
    wireframe: false,
    roundness: 0.1,
    background: "particles",
    particleColor1: "#9400D3",
    particleColor2: "#7DF9FF",
    particleColor3: "#FFFFFF",
    text1: "RudyBtz",
    text2: "Making",
    text3: "Magic",
    text4: "Drum",
    text5: "and",
    text6: "Bass",
    animation: "pulse",
    environmentImage: "",
  });

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <ThreeScene customization={customization} />
      
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 z-20 bg-background/50 backdrop-blur-sm"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Open Customization Panel</span>
          </Button>
        </SheetTrigger>
        <CustomizationPanel
          customization={customization}
          setCustomization={setCustomization}
        />
      </Sheet>

      <LandingContent />
    </main>
  );
}
