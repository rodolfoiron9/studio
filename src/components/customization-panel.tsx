"use client";

import type { Dispatch, SetStateAction } from "react";
import type { CubeCustomization } from "@/lib/types";
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { AiPanel } from "./ai-panel";

interface CustomizationPanelProps {
  customization: CubeCustomization;
  setCustomization: Dispatch<SetStateAction<CubeCustomization>>;
}

export function CustomizationPanel({ customization, setCustomization }: CustomizationPanelProps) {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCustomization(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleValueChange = (name: string, value: string | number | boolean) => {
     setCustomization(prev => ({ ...prev, [name]: value }));
  };

  const faceColorKeys: (keyof CubeCustomization)[] = ["faceColor1", "faceColor2", "faceColor3", "faceColor4", "faceColor5", "faceColor6"];
  const particleColorKeys: (keyof CubeCustomization)[] = ["particleColor1", "particleColor2", "particleColor3"];
  const textKeys: (keyof CubeCustomization)[] = ["text1", "text2", "text3", "text4", "text5", "text6"];

  return (
    <SheetContent className="w-full md:w-[400px] sm:max-w-none md:max-w-[400px]">
      <SheetHeader>
        <SheetTitle>Quantum Cube Customization</SheetTitle>
        <SheetDescription>
          Craft your unique visual experience. All changes are applied live.
        </SheetDescription>
      </SheetHeader>
      <Tabs defaultValue="appearance" className="mt-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
          <TabsTrigger value="ai">AI Tools</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[calc(100vh-150px)] pr-4">
          <TabsContent value="appearance" className="space-y-6 pt-4">
            <div className="space-y-2">
                <Label>Face Colors</Label>
                <div className="grid grid-cols-3 gap-2">
                    {faceColorKeys.map((key, index) => (
                        <div key={key} className="relative">
                            <Input type="color" name={key} id={key} value={customization[key] as string} onChange={handleInputChange} className="h-12 w-full p-1"/>
                            <Label htmlFor={key} className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-white mix-blend-difference pointer-events-none">Face {index+1}</Label>
                        </div>
                    ))}
                </div>
            </div>
             <div className="space-y-4">
                <Label>Edge Style</Label>
                <RadioGroup value={customization.edgeStyle} onValueChange={(value) => handleValueChange('edgeStyle', value)} className="flex gap-4">
                   <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sharp" id="sharp" />
                        <Label htmlFor="sharp">Sharp</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="round" id="round" />
                        <Label htmlFor="round">Round</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bevel" id="bevel" />
                        <Label htmlFor="bevel">Bevel</Label>
                    </div>
                </RadioGroup>
            </div>
            {customization.edgeStyle === 'round' && (
                <div className="space-y-2">
                    <Label htmlFor="roundness">Roundness: {customization.roundness.toFixed(2)}</Label>
                    <Slider id="roundness" name="roundness" min={0} max={0.5} step={0.01} value={[customization.roundness]} onValueChange={([val]) => handleValueChange('roundness', val)} />
                </div>
            )}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label>Wireframe Edges</Label>
                <p className="text-xs text-muted-foreground">Display edges as lines.</p>
              </div>
              <Switch name="wireframe" checked={customization.wireframe} onCheckedChange={(checked) => handleValueChange('wireframe', checked)} />
            </div>
          </TabsContent>
          <TabsContent value="text" className="space-y-4 pt-4">
            <Label>3D Text (On Cube Faces)</Label>
            {textKeys.map((key, index) => (
                <div key={key} className="space-y-1">
                    <Label htmlFor={key} className="text-xs text-muted-foreground">Face {index+1} Text</Label>
                    <Input id={key} name={key} value={customization[key] as string} onChange={handleInputChange} />
                </div>
            ))}
          </TabsContent>
          <TabsContent value="environment" className="space-y-6 pt-4">
            <div className="space-y-4">
                <Label>Background Style</Label>
                <RadioGroup value={customization.background} onValueChange={(value) => handleValueChange('background', value)} className="flex gap-4">
                   <div className="flex items-center space-x-2">
                        <RadioGroupItem value="particles" id="particles" />
                        <Label htmlFor="particles">Particles</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="snow" id="snow" />
                        <Label htmlFor="snow">Snow</Label>
                    </div>
                </RadioGroup>
            </div>
            {customization.background === 'particles' && (
                <div className="space-y-2">
                    <Label>Particle Colors</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {particleColorKeys.map((key, index) => (
                            <div key={key} className="relative">
                                <Input type="color" name={key} id={key} value={customization[key] as string} onChange={handleInputChange} className="h-12 w-full p-1"/>
                                <Label htmlFor={key} className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-white mix-blend-difference pointer-events-none">Color {index+1}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </TabsContent>
          <TabsContent value="ai" className="pt-4">
            <AiPanel setCustomization={setCustomization} currentCustomization={customization} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </SheetContent>
  );
}
