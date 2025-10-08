import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

export const DiagnosticReport = () => {
  const [findings, setFindings] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [recommendations, setRecommendations] = useState("");

  const generateReport = () => {
    const date = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const reportContent = `
INFORME RADIOLÓGICO ORAL
${date}

HALLAZGOS:
${findings || 'No especificado'}

DIAGNÓSTICO:
${diagnosis || 'No especificado'}

RECOMENDACIONES:
${recommendations || 'No especificado'}

---
Basado en White and Pharoah's Oral Radiology: Principles and Interpretation (8ª ed., 2019)
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `informe-radiologico-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Informe generado y descargado");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Notas de Diagnóstico
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="findings" className="text-sm font-medium">
            Hallazgos radiográficos
          </Label>
          <Textarea
            id="findings"
            placeholder="Describa los hallazgos observados en la radiografía..."
            value={findings}
            onChange={(e) => setFindings(e.target.value)}
            className="mt-1 min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="diagnosis" className="text-sm font-medium">
            Diagnóstico provisional
          </Label>
          <Textarea
            id="diagnosis"
            placeholder="Indique el diagnóstico más probable basado en los hallazgos..."
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="mt-1 min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="recommendations" className="text-sm font-medium">
            Recomendaciones
          </Label>
          <Textarea
            id="recommendations"
            placeholder="Pruebas adicionales, tratamiento sugerido, derivaciones..."
            value={recommendations}
            onChange={(e) => setRecommendations(e.target.value)}
            className="mt-1 min-h-[80px]"
          />
        </div>

        <Button onClick={generateReport} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Generar y Descargar Informe
        </Button>
      </div>
    </Card>
  );
};
