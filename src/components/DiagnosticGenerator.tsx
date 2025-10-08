import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface PathologyEntry {
  id: string;
  pathology: string;
  location: string;
  zone?: string;
  severity?: string;
  diagnosticText: string;
}

interface DiagnosticGeneratorProps {
  pathologyEntries: PathologyEntry[];
  onRemoveEntry: (id: string) => void;
  xrayType: string;
}

const PATHOLOGY_TEMPLATES: Record<string, (loc: string, zone: string, sev: string) => string> = {
  "Artefactos": (loc, sev) => `Artefacto ${sev.toLowerCase()} por movimiento/superposición en ${loc}. Repetir imagen con técnica adecuada. (p. 41-63)`,
  "Pérdida de lámina dura": (loc, zone, sev) => `Lámina dura ${zone.toLowerCase()} discontinua en diente ${loc}, pérdida ${sev.toLowerCase()}. Sugiere inflamación periodontal/periapical. Correlacionar con vitalidad pulpar. (p. 97-120)`,
  "Variaciones anatómicas (torus)": (loc, zone) => `Masa radiopaca simétrica en ${zone.toLowerCase()}, región ${loc}, compatible con torus. Variante anatómica benigna. (p. 105)`,
  "Caries dental": (loc, zone, sev) => `Caries en diente ${loc}, zona ${zone.toLowerCase()}, afecta ${sev.toLowerCase()}. Clasificar profundidad para planificar restauración. (p. 171-190)`,
  "Lesión periapical": (loc, zone, sev) => `Lesión radiolucente ${zone.toLowerCase()} en diente ${loc}, tamaño ${sev.toLowerCase()}. Sugiere absceso/granuloma/quiste periapical. Requiere pruebas pulpares. (p. 191-210)`,
  "Reabsorción radicular": (loc, zone, sev) => `Reabsorción ${zone.toLowerCase()} ${sev.toLowerCase()} en diente ${loc}. Probable causa: trauma/ortodoncia. CBCT para evaluar extensión. (p. 211-230)`,
  "Calcificaciones pulpares": (loc, zone, sev) => `Calcificaciones ${sev.toLowerCase()}s en ${zone.toLowerCase()} de diente ${loc}. Piedras pulpares, probablemente por edad/trauma. (p. 200)`,
  "Diente impactado/supernumerario": (loc, zone, sev) => `Diente ${sev.toLowerCase()} en posición ${zone.toLowerCase()}, región ${loc}. CBCT para planificación quirúrgica. (p. 215)`,
  "Pérdida ósea periodontal": (loc, zone, sev) => `Pérdida ósea ${zone.toLowerCase()} ${sev.toLowerCase()} en región ${loc}. Compatible con periodontitis. Medir desde unión amelocementaria. (p. 261-280)`,
  "Quiste dentígero": (loc, zone, sev) => `Lesión radiolucente unilocular ${zone.toLowerCase()} ${sev.toLowerCase()} en ${loc}. Compatible con quiste dentígero. CBCT y biopsia recomendada. (p. 321-340)`,
  "Ameloblastoma": (loc, zone, sev) => `Lesión multilocular patrón ${zone.toLowerCase()} en ${loc}, tamaño ${sev.toLowerCase()}. ALTAMENTE SOSPECHOSO de ameloblastoma. BIOPSIA URGENTE. (p. 361-380)`,
  "Hipercementosis": (loc, zone, sev) => `Hipercementosis ${zone.toLowerCase()} ${sev.toLowerCase()} en diente ${loc}. Raíz bulbosa, benigna. Considerar dificultad en extracción. (p. 300)`,
  "Fractura ósea": (loc, zone, sev) => `Fractura ${zone.toLowerCase()} ${sev.toLowerCase()} en ${loc}. Línea radiolucente evidente. CBCT si compleja. (p. 281-300)`,
  "Displasia fibrosa": (loc, zone, sev) => `Lesión ${zone.toLowerCase()} ${sev.toLowerCase()} patrón vidrio esmerilado en ${loc}. Compatible con displasia fibrosa. Biopsia si atípico. (p. 461-480)`,
  "Carcinoma de células escamosas": (loc, zone, sev) => `Lesión ${zone.toLowerCase()} ${sev.toLowerCase()} en ${loc}. ALTAMENTE SOSPECHOSA DE MALIGNIDAD. BIOPSIA URGENTE y estadificación. (p. 421-440)`,
  "Osteomielitis": (loc, zone, sev) => `Osteomielitis ${zone.toLowerCase()} ${sev.toLowerCase()} en ${loc}. Lesión difusa con sequestros radiopacos. Antibióticos y desbridamiento. (p. 285)`
};

export const DiagnosticGenerator = ({ pathologyEntries, onRemoveEntry, xrayType }: DiagnosticGeneratorProps) => {
  const [fullReport, setFullReport] = useState<string>("");

  useEffect(() => {
    generateFullReport();
  }, [pathologyEntries, xrayType]);

  const generateFullReport = () => {
    const date = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const xrayTypeNames: Record<string, string> = {
      periapical: "Periapical",
      bitewing: "Bitewing",
      panoramica: "Panorámica",
      cbct: "CBCT"
    };

    let report = `INFORME RADIOLÓGICO ORAL
${date}

TIPO DE RADIOGRAFÍA: ${xrayTypeNames[xrayType] || "No especificado"}

HALLAZGOS RADIOGRÁFICOS:
`;

    if (pathologyEntries.length === 0) {
      report += "No se han registrado hallazgos patológicos.\n";
    } else {
      pathologyEntries.forEach((entry, index) => {
        report += `\n${index + 1}. ${entry.diagnosticText}\n`;
      });
    }

    report += `\n---
Basado en White and Pharoah's Oral Radiology: Principles and Interpretation (8ª ed., 2019)`;

    setFullReport(report);
  };

  const downloadReport = () => {
    const blob = new Blob([fullReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `informe-radiologico-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Informe descargado exitosamente");
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Diagnóstico Generado</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          {pathologyEntries.length} hallazgos
        </Badge>
      </div>

      <ScrollArea className="h-[300px] w-full rounded-lg border bg-muted/30 p-3 mb-4">
        {pathologyEntries.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">
            Seleccione dientes y patologías para generar el diagnóstico automáticamente
          </p>
        ) : (
          <div className="space-y-3">
            {pathologyEntries.map((entry, index) => (
              <div key={entry.id} className="bg-background p-2 rounded border">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveEntry(entry.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-foreground leading-relaxed">
                  {entry.diagnosticText}
                </p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="space-y-2">
        <Button 
          onClick={downloadReport} 
          className="w-full"
          disabled={pathologyEntries.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Descargar Informe Completo
        </Button>
      </div>
    </Card>
  );
};