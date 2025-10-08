import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scan, ImageIcon, Maximize2, Layers3 } from "lucide-react";

interface XRayTypeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const XRayTypeSelector = ({ value, onValueChange }: XRayTypeSelectorProps) => {
  return (
    <Tabs value={value} onValueChange={onValueChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 h-auto">
        <TabsTrigger value="periapical" className="flex flex-col items-center gap-1 py-3">
          <Scan className="h-5 w-5" />
          <span className="text-xs">Periapical</span>
        </TabsTrigger>
        <TabsTrigger value="bitewing" className="flex flex-col items-center gap-1 py-3">
          <ImageIcon className="h-5 w-5" />
          <span className="text-xs">Bitewing</span>
        </TabsTrigger>
        <TabsTrigger value="panoramica" className="flex flex-col items-center gap-1 py-3">
          <Maximize2 className="h-5 w-5" />
          <span className="text-xs">Panorámica</span>
        </TabsTrigger>
        <TabsTrigger value="cbct" className="flex flex-col items-center gap-1 py-3">
          <Layers3 className="h-5 w-5" />
          <span className="text-xs">CBCT</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
