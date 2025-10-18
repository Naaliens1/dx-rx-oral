import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, ArrowLeft } from "lucide-react";

interface ToothSelectorProps {
  xrayType: string;
  onToothSelect: (tooth: string) => void;
  selectedTeeth: string[];
}

const TEETH_BY_QUADRANT = {
  periapical: {
    title: "Seleccione el cuadrante y luego el diente",
    quadrants: [
      { 
        id: "1", 
        label: "Cuadrante 1 (Superior Derecho)",
        teeth: [
          { label: "1.1", number: "11" }, { label: "1.2", number: "12" }, 
          { label: "1.3", number: "13" }, { label: "1.4", number: "14" },
          { label: "1.5", number: "15" }, { label: "1.6", number: "16" },
          { label: "1.7", number: "17" }, { label: "1.8", number: "18" }
        ]
      },
      { 
        id: "2", 
        label: "Cuadrante 2 (Superior Izquierdo)",
        teeth: [
          { label: "2.1", number: "21" }, { label: "2.2", number: "22" },
          { label: "2.3", number: "23" }, { label: "2.4", number: "24" },
          { label: "2.5", number: "25" }, { label: "2.6", number: "26" },
          { label: "2.7", number: "27" }, { label: "2.8", number: "28" }
        ]
      },
      { 
        id: "3", 
        label: "Cuadrante 3 (Inferior Izquierdo)",
        teeth: [
          { label: "3.1", number: "31" }, { label: "3.2", number: "32" },
          { label: "3.3", number: "33" }, { label: "3.4", number: "34" },
          { label: "3.5", number: "35" }, { label: "3.6", number: "36" },
          { label: "3.7", number: "37" }, { label: "3.8", number: "38" }
        ]
      },
      { 
        id: "4", 
        label: "Cuadrante 4 (Inferior Derecho)",
        teeth: [
          { label: "4.1", number: "41" }, { label: "4.2", number: "42" },
          { label: "4.3", number: "43" }, { label: "4.4", number: "44" },
          { label: "4.5", number: "45" }, { label: "4.6", number: "46" },
          { label: "4.7", number: "47" }, { label: "4.8", number: "48" }
        ]
      }
    ]
  },
  bitewing: {
    title: "Seleccione el cuadrante y luego los dientes interproximales",
    quadrants: [
      { 
        id: "1", 
        label: "Cuadrante 1 (Superior Derecho)",
        teeth: [
          { label: "1.4-1.5", number: "14-15" }, { label: "1.5-1.6", number: "15-16" },
          { label: "1.6-1.7", number: "16-17" }, { label: "1.7-1.8", number: "17-18" }
        ]
      },
      { 
        id: "2", 
        label: "Cuadrante 2 (Superior Izquierdo)",
        teeth: [
          { label: "2.4-2.5", number: "24-25" }, { label: "2.5-2.6", number: "25-26" },
          { label: "2.6-2.7", number: "26-27" }, { label: "2.7-2.8", number: "27-28" }
        ]
      },
      { 
        id: "3", 
        label: "Cuadrante 3 (Inferior Izquierdo)",
        teeth: [
          { label: "3.4-3.5", number: "34-35" }, { label: "3.5-3.6", number: "35-36" },
          { label: "3.6-3.7", number: "36-37" }, { label: "3.7-3.8", number: "37-38" }
        ]
      },
      { 
        id: "4", 
        label: "Cuadrante 4 (Inferior Derecho)",
        teeth: [
          { label: "4.4-4.5", number: "44-45" }, { label: "4.5-4.6", number: "45-46" },
          { label: "4.6-4.7", number: "46-47" }, { label: "4.7-4.8", number: "47-48" }
        ]
      }
    ]
  },
  panoramica: {
    title: "Seleccione la región evaluada",
    quadrants: [
      {
        id: "maxilar",
        label: "Maxilar",
        teeth: [
          { label: "Maxilar derecho", number: "maxilar-derecho" },
          { label: "Maxilar izquierdo", number: "maxilar-izquierdo" },
          { label: "Región anterior", number: "region-anterior" }
        ]
      },
      {
        id: "mandibula",
        label: "Mandíbula",
        teeth: [
          { label: "Mandíbula derecha", number: "mandibula-derecha" },
          { label: "Mandíbula izquierda", number: "mandibula-izquierda" }
        ]
      },
      {
        id: "senos",
        label: "Senos Maxilares",
        teeth: [
          { label: "Seno maxilar derecho", number: "seno-derecho" },
          { label: "Seno maxilar izquierdo", number: "seno-izquierdo" }
        ]
      },
      {
        id: "atm",
        label: "ATM",
        teeth: [
          { label: "ATM derecha", number: "atm-derecha" },
          { label: "ATM izquierda", number: "atm-izquierda" }
        ]
      }
    ]
  },
  cbct: {
    title: "Seleccione la región evaluada (3D)",
    quadrants: [
      {
        id: "maxilar",
        label: "Maxilar",
        teeth: [
          { label: "Maxilar anterior", number: "maxilar-anterior" },
          { label: "Maxilar posterior derecho", number: "maxilar-post-der" },
          { label: "Maxilar posterior izquierdo", number: "maxilar-post-izq" }
        ]
      },
      {
        id: "mandibula",
        label: "Mandíbula",
        teeth: [
          { label: "Mandíbula anterior", number: "mandibula-anterior" },
          { label: "Mandíbula posterior derecha", number: "mandibula-post-der" },
          { label: "Mandíbula posterior izquierda", number: "mandibula-post-izq" }
        ]
      },
      {
        id: "senos",
        label: "Senos Maxilares",
        teeth: [
          { label: "Seno maxilar derecho", number: "seno-derecho-3d" },
          { label: "Seno maxilar izquierdo", number: "seno-izquierdo-3d" }
        ]
      },
      {
        id: "atm",
        label: "ATM",
        teeth: [
          { label: "ATM", number: "atm-3d" }
        ]
      }
    ]
  }
};

export const ToothSelector = ({ xrayType, onToothSelect, selectedTeeth }: ToothSelectorProps) => {
  const [selectedQuadrant, setSelectedQuadrant] = useState<string | null>(null);
  const config = TEETH_BY_QUADRANT[xrayType as keyof typeof TEETH_BY_QUADRANT] || TEETH_BY_QUADRANT.periapical;

  const isSelected = (tooth: string) => selectedTeeth.includes(tooth);

  const currentQuadrant = selectedQuadrant 
    ? config.quadrants.find(q => q.id === selectedQuadrant)
    : null;

  return (
    <Card className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Target className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-foreground">{config.title}</h3>
      </div>
      
      {!selectedQuadrant ? (
        // Vista de cuadrantes
        <div className="grid grid-cols-2 gap-4">
          {config.quadrants.map((quadrant) => {
            const hasSelectedTeeth = quadrant.teeth.some(t => isSelected(t.number));
            return (
              <Button
                key={quadrant.id}
                variant={hasSelectedTeeth ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedQuadrant(quadrant.id)}
                className="h-32 flex flex-col items-center justify-center gap-3 text-sm font-medium hover:scale-[1.02] transition-transform"
              >
                <span className="text-4xl font-semibold">{quadrant.id}</span>
                <span className="text-sm font-normal opacity-80">
                  {quadrant.label}
                </span>
                {hasSelectedTeeth && (
                  <Badge variant="secondary" className="text-xs mt-1 font-normal">
                    {quadrant.teeth.filter(t => isSelected(t.number)).length} seleccionados
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      ) : (
        // Vista de dientes dentro del cuadrante
        <div>
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedQuadrant(null)}
              className="gap-2 hover:bg-accent/50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Volver</span>
            </Button>
            <Badge variant="outline" className="text-sm font-medium px-3 py-1">
              {currentQuadrant?.label}
            </Badge>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {currentQuadrant?.teeth.map((tooth) => (
              <Button
                key={tooth.number}
                variant={isSelected(tooth.number) ? "default" : "outline"}
                size="sm"
                onClick={() => onToothSelect(tooth.number)}
                className="h-14 text-sm font-medium hover:scale-[1.02] transition-transform"
              >
                {tooth.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {selectedTeeth.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border/50">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Seleccionados ({selectedTeeth.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedTeeth.map((tooth) => {
              let toothData;
              for (const quadrant of config.quadrants) {
                toothData = quadrant.teeth.find(t => t.number === tooth);
                if (toothData) break;
              }
              return (
                <Badge 
                  key={tooth} 
                  variant="secondary" 
                  className="text-sm px-3 py-1 cursor-pointer hover:bg-secondary/70 transition-colors font-normal"
                  onClick={() => onToothSelect(tooth)}
                >
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