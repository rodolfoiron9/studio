
"use client";

import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { CubeCustomization } from "@/lib/types";
import { SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { AiPanel } from "./ai-panel";
import { Upload, Save, RotateCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface CustomizationPanelProps {
  customization: CubeCustomization;
  setCustomization: Dispatch<SetStateAction<CubeCustomization>>;
}

export function CustomizationPanel({ customization, setCustomization }: CustomizationPanelProps) {
  const [localCustomization, setLocalCustomization] = useState<CubeCustomization>(customization);

  useEffect(() => {
    // When the external customization changes (e.g. via AI preset),
    // update the local state to match it.
    setLocalCustomization(customization);
  }, [customization]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLocalCustomization(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleValueChange = (name: string, value: string | number | boolean) => {
     setLocalCustomization(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    setCustomization(localCustomization);
    // Maybe show a toast message here
  };
  
  const handleResetChanges = () => {
    setLocalCustomization(customization);
    // Maybe show a toast message here
  };

  const faceColorKeys: (keyof CubeCustomization)[] = ["faceColor1", "faceColor2", "faceColor3", "faceColor4", "faceColor5", "faceColor6"];
  const particleColorKeys: (keyof CubeCustomization)[] = ["particleColor1", "particleColor2", "particleColor3"];
  const textKeys: (keyof CubeCustomization)[] = ["text1", "text2", "text3", "text4", "text5", "text6"];

  return (
    <SheetContent className="w-full md:w-[450px] sm:max-w-none md:max-w-[450px] flex flex-col">
      <SheetHeader>
        <SheetTitle>Quantum Cube Customization</SheetTitle>
        <SheetDescription>
          Craft your unique visual experience. Click Save to apply changes.
        </SheetDescription>
      </SheetHeader>
      <Tabs defaultValue="appearance" className="mt-4 flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="text">3D Text</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
          <TabsTrigger value="ai">AI Tools</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[calc(100vh-220px)] pr-4">
          <TabsContent value="appearance" className="space-y-6 pt-4">
            <div className="space-y-2">
                <Label>Face Style</Label>
                <Tabs defaultValue="colors">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                  </TabsList>
                  <TabsContent value="colors" className="pt-4">
                     <div className="grid grid-cols-3 gap-2">
                        {faceColorKeys.map((key, index) => (
                            <div key={key} className="relative">
                                <Input type="color" name={key} id={key} value={localCustomization[key] as string} onChange={handleInputChange} className="h-12 w-full p-1"/>
                                <Label htmlFor={key} className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-white mix-blend-difference pointer-events-none">Face {index+1}</Label>
                            </div>
                        ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="images" className="pt-4">
                    <div className="grid grid-cols-3 gap-2">
                      {faceColorKeys.map((_, index) => (
                        <Button key={`face-img-${index}`} variant="outline" className="h-12 w-full flex-col">
                          <Upload className="h-4 w-4"/>
                          <span className="text-xs">Face {index + 1}</span>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
            </div>

            <div className="space-y-4">
              <Label>Edge Style</Label>
              <RadioGroup value={localCustomization.edgeStyle} onValueChange={(value) => handleValueChange('edgeStyle', value)} className="grid grid-cols-3 gap-2">
                  <Label htmlFor="sharp" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem value="sharp" id="sharp" className="sr-only" />
                    Sharp
                  </Label>
                  <Label htmlFor="round" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem value="round" id="round" className="sr-only" />
                    Round
                  </Label>
                  <Label htmlFor="bevel" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem value="bevel" id="bevel" className="sr-only" />
                    Bevel
                  </Label>
              </RadioGroup>
            </div>

            {localCustomization.edgeStyle === 'round' && (
                <div className="space-y-2">
                    <Label htmlFor="roundness">Roundness: {localCustomization.roundness.toFixed(2)}</Label>
                    <Slider id="roundness" name="roundness" min={0} max={0.5} step={0.01} value={[localCustomization.roundness]} onValueChange={([val]) => handleValueChange('roundness', val)} />
                </div>
            )}
            
            <div className="space-y-4">
                <Label>Material Style</Label>
                <RadioGroup value={localCustomization.materialStyle || 'solid'} onValueChange={(value) => handleValueChange('materialStyle', value)} className="grid grid-cols-3 gap-2">
                    {['solid', 'wireframe', 'cartoon', 'realist', 'draw', 'quantum dist', 'glass', 'metallic'].map(style => (
                         <Label key={style} htmlFor={style} className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary capitalize">
                            <RadioGroupItem value={style} id={style} className="sr-only" />
                            {style}
                        </Label>
                    ))}
                </RadioGroup>
            </div>

            <div className="space-y-4">
                <Label>Lyric Display</Label>
                <RadioGroup value={localCustomization.lyricDisplay || 'underneath'} onValueChange={(value) => handleValueChange('lyricDisplay', value)} className="grid grid-cols-3 gap-2">
                    {['underneath', 'cube', 'off'].map(style => (
                         <Label key={style} htmlFor={`lyric-${style}`} className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary capitalize">
                            <RadioGroupItem value={style} id={`lyric-${style}`} className="sr-only" />
                            {style}
                        </Label>
                    ))}
                </RadioGroup>
            </div>

          </TabsContent>
          <TabsContent value="text" className="space-y-4 pt-4">
             <div className="space-y-4">
                <Label>3D Text Presets</Label>
                <RadioGroup defaultValue="none" className="grid grid-cols-3 gap-2">
                     {['metallic', 'glass', 'cartoon'].map(style => (
                         <Label key={style} htmlFor={`text-${style}`} className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary capitalize">
                            <RadioGroupItem value={style} id={`text-${style}`} className="sr-only" />
                            {style}
                        </Label>
                    ))}
                </RadioGroup>
            </div>
             <div className="space-y-2">
                <Label>Font Customization</Label>
                <Select disabled>
                    <SelectTrigger><SelectValue placeholder="Select a font" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="space-grotesk">Space Grotesk</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Label>Text (On Cube Faces)</Label>
            {textKeys.map((key, index) => (
                <div key={key} className="space-y-1">
                    <Label htmlFor={key} className="text-xs text-muted-foreground">Face {index+1} Text</Label>
                    <Input id={key} name={key} value={localCustomization[key] as string} onChange={handleInputChange} />
                </div>
            ))}
          </TabsContent>
          <TabsContent value="environment" className="space-y-6 pt-4">
            <div className="space-y-4">
                <Label>Background Style</Label>
                <RadioGroup value={localCustomization.background} onValueChange={(value) => handleValueChange('background', value)} className="grid grid-cols-3 gap-2">
                   {['particles', 'snow', 'image', 'video'].map(style => (
                       <Label key={style} htmlFor={style} className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary capitalize">
                          <RadioGroupItem value={style} id={style} className="sr-only" />
                          {style}
                      </Label>
                  ))}
                </RadioGroup>
            </div>
             <div className="space-y-2">
                <Label>Environment Presets</Label>
                <div className="grid grid-cols-2 gap-2">
                    {['hiptop underground', 'london', 'new york', 'sao paulo'].map(preset => (
                        <Button key={preset} variant="outline" className="h-16 capitalize">{preset}</Button>
                    ))}
                </div>
            </div>
            {localCustomization.background === 'particles' && (
                <div className="space-y-2">
                    <Label>Particle Colors</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {particleColorKeys.map((key, index) => (
                            <div key={key} className="relative">
                                <Input type="color" name={key} id={key} value={localCustomization[key] as string} onChange={handleInputChange} className="h-12 w-full p-1"/>
                                <Label htmlFor={key} className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-white mix-blend-difference pointer-events-none">Color {index+1}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </TabsContent>
          <TabsContent value="ai" className="pt-4">
            <AiPanel setCustomization={setCustomization} currentCustomization={localCustomization} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
       <SheetFooter className="mt-auto pt-4">
            <Separator className="mb-4" />
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleResetChanges}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
                <Button onClick={handleSaveChanges}>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
            </div>
        </SheetFooter>
    </SheetContent>
  );
}
