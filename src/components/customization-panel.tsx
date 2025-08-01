
"use client";

import type { Dispatch, SetStateAction } from "react";
import type { CubeCustomization } from "@/lib/types";
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { AiPanel } from "./ai-panel";
import { Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <SheetContent className="w-full md:w-[450px] sm:max-w-none md:max-w-[450px]">
      <SheetHeader>
        <SheetTitle>Quantum Cube Customization</SheetTitle>
        <SheetDescription>
          Craft your unique visual experience. All changes are applied live.
        </SheetDescription>
      </SheetHeader>
      <Tabs defaultValue="appearance" className="mt-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="albumArt">Album Art</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="text">3D Text</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
          <TabsTrigger value="ai">AI Tools</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[calc(100vh-150px)] pr-4">
          <TabsContent value="albumArt" className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label>Music Upload</Label>
                <div className="flex items-center gap-2">
                  <Input type="file" accept="audio/*" className="flex-grow"/>
                  <Button size="icon"><Upload className="h-4 w-4"/></Button>
                </div>
                <p className="text-xs text-muted-foreground">Upload a track to associate with a cube design.</p>
              </div>
               <div className="space-y-2">
                <Label>AI Album Art Generator</Label>
                 <Button className="w-full">Generate Album Art</Button>
                <p className="text-xs text-muted-foreground">Let AI create a unique cover for your track.</p>
              </div>
               <div className="space-y-2">
                <Label>Saved Presets</Label>
                 <div className="grid grid-cols-3 gap-2 h-32 border rounded-md p-2">
                    <div className="bg-muted flex items-center justify-center text-xs text-muted-foreground">Empty</div>
                    <div className="bg-muted flex items-center justify-center text-xs text-muted-foreground">Empty</div>
                    <div className="bg-muted flex items-center justify-center text-xs text-muted-foreground">Empty</div>
                 </div>
                <p className="text-xs text-muted-foreground">Your saved AI-generated presets will appear here.</p>
              </div>
          </TabsContent>

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
                                <Input type="color" name={key} id={key} value={customization[key] as string} onChange={handleInputChange} className="h-12 w-full p-1"/>
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
              <RadioGroup value={customization.edgeStyle} onValueChange={(value) => handleValueChange('edgeStyle', value)} className="grid grid-cols-3 gap-2">
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

            {customization.edgeStyle === 'round' && (
                <div className="space-y-2">
                    <Label htmlFor="roundness">Roundness: {customization.roundness.toFixed(2)}</Label>
                    <Slider id="roundness" name="roundness" min={0} max={0.5} step={0.01} value={[customization.roundness]} onValueChange={([val]) => handleValueChange('roundness', val)} />
                </div>
            )}
            
            <div className="space-y-4">
                <Label>Material Style</Label>
                <RadioGroup value={customization.materialStyle || 'solid'} onValueChange={(value) => handleValueChange('materialStyle', value)} className="grid grid-cols-3 gap-2">
                    {['solid', 'wireframe', 'cartoon', 'realist', 'draw', 'quantum dist'].map(style => (
                         <Label key={style} htmlFor={style} className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary capitalize">
                            <RadioGroupItem value={style} id={style} className="sr-only" />
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
                    <Input id={key} name={key} value={customization[key] as string} onChange={handleInputChange} />
                </div>
            ))}
          </TabsContent>
          <TabsContent value="environment" className="space-y-6 pt-4">
            <div className="space-y-4">
                <Label>Background Style</Label>
                <RadioGroup value={customization.background} onValueChange={(value) => handleValueChange('background', value)} className="grid grid-cols-3 gap-2">
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

    
