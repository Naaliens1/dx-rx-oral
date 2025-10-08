import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

interface PathologySelection {
  pathology: string;
  location: string;
  severity?: string;
  zone?: string;
}

interface PathologySelectorProps {
  selectedTeeth: string[];
  onPathologySelect: (selection: PathologySelection) => void;
  xrayType: string;
}

const PATHOLOGIES = {
  "Anomalías Fundamentales": [
    {
      name: "Artefactos",
      zones: ["No aplica"],
      severities: ["Leve", "Moderado", "Severo"],
      template: (loc: string, sev: string) => `Artefacto ${sev.toLowerCase()} por movimiento/superposición en ${loc}. Repetir imagen con técnica adecuada.`
    },
    {
      name: "Pérdida de lámina dura",
      zones: ["Apical", "Lateral", "Completa"],
      severities: ["Leve", "Moderada", "Severa"],
      template: (loc: string, zone: string, sev: string) => `Lámina dura ${zone.toLowerCase()} discontinua en diente ${loc}, pérdida ${sev.toLowerCase()}. Sugiere inflamación periodontal/periapical. Correlacionar con vitalidad pulpar.`
    },
    {
      name: "Variaciones anatómicas (torus)",
      zones: ["Palatino", "Mandibular"],
      severities: ["No aplica"],
      template: (loc: string, zone: string) => `Masa radiopaca simétrica en ${zone.toLowerCase()}, región ${loc}, compatible con torus. Variante anatómica benigna.`
    }
  ],
  "Anomalías Dentales": [
    {
      name: "Caries dental",
      zones: ["Corona (oclusal)", "Interproximal (mesial)", "Interproximal (distal)", "Cervical", "Radicular"],
      severities: ["Esmalte", "Dentina superficial", "Dentina media", "Dentina profunda", "Pulpar"],
      template: (loc: string, zone: string, sev: string) => `Caries en diente ${loc}, zona ${zone.toLowerCase()}, afecta ${sev.toLowerCase()}. Clasificar profundidad para planificar restauración.`
    },
    {
      name: "Lesión periapical",
      zones: ["Apical", "Periapical"],
      severities: ["Pequeña (<5mm)", "Mediana (5-10mm)", "Grande (>10mm)"],
      template: (loc: string, zone: string, sev: string) => `Lesión radiolucente ${zone.toLowerCase()} en diente ${loc}, tamaño ${sev.toLowerCase()}. Sugiere absceso/granuloma/quiste periapical. Requiere pruebas pulpares.`
    },
    {
      name: "Reabsorción radicular",
      zones: ["Externa", "Interna", "Apical", "Cervical"],
      severities: ["Leve", "Moderada", "Severa"],
      template: (loc: string, zone: string, sev: string) => `Reabsorción ${zone.toLowerCase()} ${sev.toLowerCase()} en diente ${loc}. Probable causa: trauma/ortodoncia. CBCT para evaluar extensión.`
    },
    {
      name: "Calcificaciones pulpares",
      zones: ["Cámara pulpar", "Conducto radicular"],
      severities: ["Leve", "Moderada", "Severa"],
      template: (loc: string, zone: string, sev: string) => `Calcificaciones ${sev.toLowerCase()}s en ${zone.toLowerCase()} de diente ${loc}. Piedras pulpares, probablemente por edad/trauma.`
    },
    {
      name: "Diente impactado/supernumerario",
      zones: ["Horizontal", "Vertical", "Mesioangular", "Distoangular", "Invertido"],
      severities: ["Impactado", "Supernumerario"],
      template: (loc: string, zone: string, sev: string) => `Diente ${sev.toLowerCase()} en posición ${zone.toLowerCase()}, región ${loc}. CBCT para planificación quirúrgica.`
    }
  ],
  "Anomalías Óseas": [
    {
      name: "Pérdida ósea periodontal",
      zones: ["Horizontal", "Vertical (angular)", "Generalizada", "Localizada"],
      severities: ["Leve (1-2mm)", "Moderada (3-4mm)", "Severa (>5mm)"],
      template: (loc: string, zone: string, sev: string) => `Pérdida ósea ${zone.toLowerCase()} ${sev.toLowerCase()} en región ${loc}. Compatible con periodontitis. Medir desde unión amelocementaria.`
    },
    {
      name: "Quiste dentígero",
      zones: ["Pericoronario", "Lateral"],
      severities: ["Pequeño (<2cm)", "Mediano (2-4cm)", "Grande (>4cm)"],
      template: (loc: string, zone: string, sev: string) => `Lesión radiolucente unilocular ${zone.toLowerCase()} ${sev.toLowerCase()} en ${loc}. Compatible con quiste dentígero. CBCT y biopsia recomendada.`
    },
    {
      name: "Ameloblastoma",
      zones: ["Unilocular", "Multilocular (jabonera)", "Panal de abejas"],
      severities: ["Pequeño", "Mediano", "Grande con expansión cortical"],
      template: (loc: string, zone: string, sev: string) => `Lesión multilocular patrón ${zone.toLowerCase()} en ${loc}, tamaño ${sev.toLowerCase()}. ALTAMENTE SOSPECHOSO de ameloblastoma. BIOPSIA URGENTE.`
    },
    {
      name: "Hipercementosis",
      zones: ["Apical", "Difusa"],
      severities: ["Leve", "Moderada", "Severa"],
      template: (loc: string, zone: string, sev: string) => `Hipercementosis ${zone.toLowerCase()} ${sev.toLowerCase()} en diente ${loc}. Raíz bulbosa, benigna. Considerar dificultad en extracción.`
    },
    {
      name: "Fractura ósea",
      zones: ["Simple", "Conminuta", "Cortical", "Completa"],
      severities: ["No desplazada", "Desplazada"],
      template: (loc: string, zone: string, sev: string) => `Fractura ${zone.toLowerCase()} ${sev.toLowerCase()} en ${loc}. Línea radiolucente evidente. CBCT si compleja.`
    },
    {
      name: "Displasia fibrosa",
      zones: ["Monostótica", "Poliostótica"],
      severities: ["Leve", "Moderada", "Severa con deformidad"],
      template: (loc: string, zone: string, sev: string) => `Lesión ${zone.toLowerCase()} ${sev.toLowerCase()} patrón vidrio esmerilado en ${loc}. Compatible con displasia fibrosa. Biopsia si atípico.`
    },
    {
      name: "Carcinoma de células escamosas",
      zones: ["Destructiva irregular", "Invasiva"],
      severities: ["Temprana", "Avanzada con destrucción ósea"],
      template: (loc: string, zone: string, sev: string) => `Lesión ${zone.toLowerCase()} ${sev.toLowerCase()} en ${loc}. ALTAMENTE SOSPECHOSA DE MALIGNIDAD. BIOPSIA URGENTE y estadificación.`
    },
    {
      name: "Osteomielitis",
      zones: ["Aguda", "Crónica con sequestros"],
      severities: ["Leve", "Moderada", "Severa"],
      template: (loc: string, zone: string, sev: string) => `Osteomielitis ${zone.toLowerCase()} ${sev.toLowerCase()} en ${loc}. Lesión difusa con sequestros radiopacos. Antibióticos y desbridamiento.`
    }
  ]
};

export const PathologySelector = ({ selectedTeeth, onPathologySelect, xrayType }: PathologySelectorProps) => {
  const [selectedPathology, setSelectedPathology] = useState<string>("");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("");

  const handleAddPathology = () => {
    if (!selectedPathology || selectedTeeth.length === 0) return;

    const pathologyData = Object.values(PATHOLOGIES)
      .flat()
      .find(p => p.name === selectedPathology);

    if (!pathologyData) return;

    selectedTeeth.forEach(tooth => {
      onPathologySelect({
        pathology: selectedPathology,
        location: tooth,
        zone: selectedZone,
        severity: selectedSeverity
      });
    });

    // Reset
    setSelectedPathology("");
    setSelectedZone("");
    setSelectedSeverity("");
  };

  const currentPathology = selectedPathology ? 
    Object.values(PATHOLOGIES).flat().find(p => p.name === selectedPathology) : null;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <h3 className="text-sm font-semibold text-foreground">Identificar Patología</h3>
      </div>

      {selectedTeeth.length === 0 && (
        <div className="p-3 bg-muted/50 rounded-lg mb-4">
          <p className="text-xs text-muted-foreground">
            Primero seleccione un diente o región arriba
          </p>
        </div>
      )}

      <Accordion type="single" collapsible className="space-y-2">
        {Object.entries(PATHOLOGIES).map(([category, pathologies]) => (
          <AccordionItem key={category} value={category} className="border rounded-lg px-3">
            <AccordionTrigger className="text-xs font-medium py-2">
              {category}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {pathologies.map((path) => (
                  <Button
                    key={path.name}
                    variant={selectedPathology === path.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPathology(path.name)}
                    className="w-full text-xs justify-start"
                    disabled={selectedTeeth.length === 0}
                  >
                    {path.name}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {currentPathology && (
        <div className="mt-4 space-y-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <div>
            <label className="text-xs font-medium mb-1 block">Zona/Tipo</label>
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Seleccione zona" />
              </SelectTrigger>
              <SelectContent>
                {currentPathology.zones.map(zone => (
                  <SelectItem key={zone} value={zone} className="text-xs">{zone}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentPathology.severities[0] !== "No aplica" && (
            <div>
              <label className="text-xs font-medium mb-1 block">Severidad/Extensión</label>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Seleccione severidad" />
                </SelectTrigger>
                <SelectContent>
                  {currentPathology.severities.map(sev => (
                    <SelectItem key={sev} value={sev} className="text-xs">{sev}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            onClick={handleAddPathology}
            size="sm"
            className="w-full"
            disabled={!selectedZone || (!selectedSeverity && currentPathology.severities[0] !== "No aplica")}
          >
            Agregar al Diagnóstico
          </Button>
        </div>
      )}
    </Card>
  );
};