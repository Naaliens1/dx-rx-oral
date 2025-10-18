import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

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
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPos = margin;

      // Header
      doc.setFillColor(33, 96, 158);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text('INFORME RADIOLÓGICO ORAL', pageWidth / 2, 25, { align: 'center' });
      
      yPos = 50;

      // Date and X-ray type
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      const date = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.text(`Fecha: ${date}`, margin, yPos);
      yPos += 8;

      const xrayTypeNames: Record<string, string> = {
        periapical: "Periapical",
        bitewing: "Bitewing",
        panoramica: "Panorámica",
        cbct: "CBCT (Tomografía Computarizada de Haz Cónico)"
      };
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`Tipo de Radiografía: ${xrayTypeNames[xrayType] || "No especificado"}`, margin, yPos);
      doc.setFont(undefined, 'normal');
      yPos += 15;

      // Findings section
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('HALLAZGOS RADIOGRÁFICOS', margin, yPos);
      doc.setFont(undefined, 'normal');
      yPos += 10;

      if (pathologyEntries.length === 0) {
        doc.setFontSize(11);
        doc.text('No se han registrado hallazgos patológicos.', margin, yPos);
        yPos += 10;
      } else {
        doc.setFontSize(10);
        pathologyEntries.forEach((entry, index) => {
          // Check if we need a new page
          if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = margin;
          }

          const lines = doc.splitTextToSize(
            `${index + 1}. ${entry.diagnosticText}`,
            maxWidth
          );
          
          lines.forEach((line: string) => {
            if (yPos > pageHeight - 40) {
              doc.addPage();
              yPos = margin;
            }
            doc.text(line, margin, yPos);
            yPos += 7;
          });
          
          yPos += 3;
        });
      }

      // Footer
      yPos = pageHeight - 30;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;
      
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      const footerText = 'Basado en White and Pharoah\'s Oral Radiology: Principles and Interpretation (8ª ed., 2019)';
      doc.text(footerText, pageWidth / 2, yPos, { align: 'center' });

      doc.save(`informe-radiologico-${Date.now()}.pdf`);
      toast.success("Informe PDF descargado exitosamente");
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.error("Error al generar el PDF");
    }
  };

  return (
    <Card className="p-6 h-full flex flex-col slide-in-right">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">Informe Diagnóstico</h3>
          <Badge variant="secondary" className="text-xs mt-1">
            {pathologyEntries.length} hallazgo{pathologyEntries.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 rounded-lg border bg-gradient-to-b from-muted/30 to-muted/10 p-4 mb-4">
        {pathologyEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-2">
              Sin hallazgos registrados
            </p>
            <p className="text-xs text-muted-foreground max-w-[250px]">
              Complete el flujo diagnóstico y seleccione patologías para generar el informe
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pathologyEntries.map((entry, index) => (
              <div 
                key={entry.id} 
                className="bg-background p-3.5 rounded-lg border shadow-sm hover:shadow-md transition-shadow fade-in"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <Badge variant="default" className="text-xs font-semibold">
                    #{index + 1}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveEntry(entry.id)}
                    className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                    title="Eliminar hallazgo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {entry.diagnosticText}
                </p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="space-y-3 pt-2">
        <Button 
          onClick={downloadReport} 
          size="lg"
          className="w-full gap-2 font-semibold"
          disabled={pathologyEntries.length === 0}
        >
          <Download className="h-5 w-5" />
          Descargar Informe Completo (PDF)
        </Button>
        
        {pathologyEntries.length > 0 && (
          <p className="text-xs text-center text-muted-foreground">
            Informe profesional basado en White & Pharoah (8ª ed.)
          </p>
        )}
      </div>
    </Card>
  );
};