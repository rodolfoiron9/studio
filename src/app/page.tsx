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
    faceColor1: "#0a0a1a",
    faceColor2: "#0a0a1a",
    faceColor3: "#0a0a1a",
    faceColor4: "#0a0a1a",
    faceColor5: "#0a0a1a",
    faceColor6: "#0a0a1a",
    edgeStyle: "round",
    wireframe: true,
    roundness: 0.2,
    background: "snow",
    particleColor1: "#7DF9FF",
    particleColor2: "#9400D3",
    particleColor3: "#FFFFFF",
    text1: "RUDYBTZ",
    text2: "THE ALBUM",
    text3: "",
    text4: "",
    text5: "",
    text6: "",
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
