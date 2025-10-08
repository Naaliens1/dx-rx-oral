import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";

interface ToothSelectorProps {
  xrayType: string;
  onToothSelect: (tooth: string) => void;
  selectedTeeth: string[];
}

const TEETH_QUADRANTS = {
  periapical: {
    title: "Seleccione el diente evaluado",
    teeth: [
      { label: "1.1", number: "11" }, { label: "1.2", number: "12" }, { label: "1.3", number: "13" }, 
      { label: "1.4", number: "14" }, { label: "1.5", number: "15" }, { label: "1.6", number: "16" },
      { label: "1.7", number: "17" }, { label: "1.8", number: "18" },
      { label: "2.1", number: "21" }, { label: "2.2", number: "22" }, { label: "2.3", number: "23" },
      { label: "2.4", number: "24" }, { label: "2.5", number: "25" }, { label: "2.6", number: "26" },
      { label: "2.7", number: "27" }, { label: "2.8", number: "28" },
      { label: "3.1", number: "31" }, { label: "3.2", number: "32" }, { label: "3.3", number: "33" },
      { label: "3.4", number: "34" }, { label: "3.5", number: "35" }, { label: "3.6", number: "36" },
      { label: "3.7", number: "37" }, { label: "3.8", number: "38" },
      { label: "4.1", number: "41" }, { label: "4.2", number: "42" }, { label: "4.3", number: "43" },
      { label: "4.4", number: "44" }, { label: "4.5", number: "45" }, { label: "4.6", number: "46" },
      { label: "4.7", number: "47" }, { label: "4.8", number: "48" }
    ]
  },
  bitewing: {
    title: "Seleccione los dientes evaluados (interproximales)",
    teeth: [
      { label: "1.4-1.5", number: "14-15" }, { label: "1.5-1.6", number: "15-16" }, 
      { label: "1.6-1.7", number: "16-17" }, { label: "1.7-1.8", number: "17-18" },
      { label: "2.4-2.5", number: "24-25" }, { label: "2.5-2.6", number: "25-26" },
      { label: "2.6-2.7", number: "26-27" }, { label: "2.7-2.8", number: "27-28" },
      { label: "3.4-3.5", number: "34-35" }, { label: "3.5-3.6", number: "35-36" },
      { label: "3.6-3.7", number: "36-37" }, { label: "3.7-3.8", number: "37-38" },
      { label: "4.4-4.5", number: "44-45" }, { label: "4.5-4.6", number: "45-46" },
      { label: "4.6-4.7", number: "46-47" }, { label: "4.7-4.8", number: "47-48" }
    ]
  },
  panoramica: {
    title: "Seleccione la región evaluada",
    teeth: [
      { label: "Maxilar derecho", number: "maxilar-derecho" },
      { label: "Maxilar izquierdo", number: "maxilar-izquierdo" },
      { label: "Mandíbula derecha", number: "mandibula-derecha" },
      { label: "Mandíbula izquierda", number: "mandibula-izquierda" },
      { label: "Región anterior", number: "region-anterior" },
      { label: "Seno maxilar derecho", number: "seno-derecho" },
      { label: "Seno maxilar izquierdo", number: "seno-izquierdo" },
      { label: "ATM derecha", number: "atm-derecha" },
      { label: "ATM izquierda", number: "atm-izquierda" }
    ]
  },
  cbct: {
    title: "Seleccione la región evaluada (3D)",
    teeth: [
      { label: "Maxilar anterior", number: "maxilar-anterior" },
      { label: "Maxilar posterior derecho", number: "maxilar-post-der" },
      { label: "Maxilar posterior izquierdo", number: "maxilar-post-izq" },
      { label: "Mandíbula anterior", number: "mandibula-anterior" },
      { label: "Mandíbula posterior derecha", number: "mandibula-post-der" },
      { label: "Mandíbula posterior izquierda", number: "mandibula-post-izq" },
      { label: "Seno maxilar derecho", number: "seno-derecho-3d" },
      { label: "Seno maxilar izquierdo", number: "seno-izquierdo-3d" },
      { label: "ATM", number: "atm-3d" }
    ]
  }
};

export const ToothSelector = ({ xrayType, onToothSelect, selectedTeeth }: ToothSelectorProps) => {
  const config = TEETH_QUADRANTS[xrayType as keyof typeof TEETH_QUADRANTS] || TEETH_QUADRANTS.periapical;

  const isSelected = (tooth: string) => selectedTeeth.includes(tooth);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Target className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">{config.title}</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {config.teeth.map((tooth) => (
          <Button
            key={tooth.number}
            variant={isSelected(tooth.number) ? "default" : "outline"}
            size="sm"
            onClick={() => onToothSelect(tooth.number)}
            className="h-8 text-xs"
          >
            {tooth.label}
          </Button>
        ))}
      </div>

      {selectedTeeth.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-2">Seleccionados:</p>
          <div className="flex flex-wrap gap-1">
            {selectedTeeth.map((tooth) => {
              const toothData = config.teeth.find(t => t.number === tooth);
              return (
                <Badge key={tooth} variant="secondary" className="text-xs">
                  {toothData?.label}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};