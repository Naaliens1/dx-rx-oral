import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DiagnosticStepper } from "./DiagnosticStepper";

interface DiagnosticFlowProps {
  xrayType: string;
  currentStep: number;
  onStepChange: (step: number) => void;
  completedSteps: number[];
  onStepComplete: (step: number, completed: boolean) => void;
  selectedTeeth: string[];
  onGenerateFinding: (finding: string) => void;
  hasImage: boolean;
}

interface CheckItem {
  id: string;
  text: string;
  finding?: string;
}

interface DiagnosticStep {
  title: string;
  description: string;
  checks: CheckItem[];
}

// Flujos diagnósticos específicos basados en White & Pharoah (8ª ed.)
const DIAGNOSTIC_STEPS: Record<string, DiagnosticStep[]> = {
  periapical: [
    {
      title: "Paso 1: Evaluar calidad de imagen",
      description: "Verificar condiciones técnicas antes de diagnóstico (p. 41-63)",
      checks: [
        { id: "density", text: "Densidad y contraste adecuados" },
        { id: "artifacts", text: "Sin artefactos por movimiento/superposición" },
        { id: "positioning", text: "Posicionamiento correcto del sensor" },
        { id: "quality", text: "Calidad diagnóstica suficiente" }
      ]
    },
    {
      title: "Paso 2: Estructuras periapicales",
      description: "Evaluar estructuras anatómicas normales (p. 97-120)",
      checks: [
        { id: "lamina_dura", text: "Lámina dura intacta y continua", finding: "Lámina dura continua sin discontinuidades. Espacio del ligamento periodontal uniforme. (p. 97-120)" },
        { id: "periodontal", text: "Espacio del ligamento periodontal uniforme", finding: "Espacio periodontal preservado con grosor uniforme. (p. 97-120)" },
        { id: "bone_density", text: "Densidad ósea periapical normal", finding: "Densidad ósea trabecular normal. (p. 97-120)" }
      ]
    }
  ],
  bitewing: [
    {
      title: "Paso 1: Evaluar calidad de imagen",
      description: "Verificar técnica bitewing (p. 171-190)",
      checks: [
        { id: "density", text: "Densidad y contraste adecuados" },
        { id: "no_overlap", text: "Sin solapamiento interproximal" },
        { id: "positioning", text: "Plano oclusal horizontal" }
      ]
    },
    {
      title: "Paso 2: Detección de caries",
      description: "Identificar caries tempranas (p. 171-190)",
      checks: [
        { id: "interproximal", text: "Superficies interproximales", finding: "Superficies interproximales sin caries. (p. 171-190)" },
        { id: "occlusal", text: "Superficies oclusales", finding: "Superficies oclusales normales. (p. 171-190)" }
      ]
    }
  ],
  panoramica: [
    {
      title: "Paso 1: Evaluar calidad",
      description: "Técnica panorámica (p. 140-160)",
      checks: [
        { id: "positioning", text: "Posicionamiento correcto" },
        { id: "symmetry", text: "Simetría bilateral" }
      ]
    },
    {
      title: "Paso 2: Estructuras anatómicas",
      description: "Identificar hitos (p. 97-120)",
      checks: [
        { id: "maxilla", text: "Maxilar y senos", finding: "Maxilar y senos normales. (p. 97-120)" },
        { id: "mandible", text: "Mandíbula", finding: "Mandíbula con morfología normal. (p. 97-120)" }
      ]
    }
  ],
  cbct: [
    {
      title: "Paso 1: Calidad volumétrica",
      description: "Verificar calidad 3D (p. 180-200)",
      checks: [
        { id: "resolution", text: "Resolución adecuada" },
        { id: "planes", text: "Cortes correctos" }
      ]
    },
    {
      title: "Paso 2: Análisis 3D",
      description: "Evaluación tridimensional",
      checks: [
        { id: "bone", text: "Densidad ósea", finding: "Densidad ósea adecuada en CBCT." },
        { id: "cortical", text: "Corticales intactas", finding: "Corticales óseas íntegras." }
      ]
    }
  ]
};

export const DiagnosticFlow = ({ 
  xrayType, 
  currentStep, 
  onStepChange, 
  completedSteps, 
  onStepComplete,
  selectedTeeth,
  onGenerateFinding,
  hasImage
}: DiagnosticFlowProps) => {
  const [checkStates, setCheckStates] = useState<Record<string, boolean>>({});
  
  const steps = DIAGNOSTIC_STEPS[xrayType] || DIAGNOSTIC_STEPS.periapical;
  const currentStepData = steps[currentStep];
  
  const isCurrentStepComplete = currentStepData.checks.every(
    check => checkStates[`${currentStep}-${check.id}`]
  );

  useEffect(() => {
    onStepComplete(currentStep, isCurrentStepComplete);
  }, [checkStates, currentStep, isCurrentStepComplete, onStepComplete]);

  const handleCheckboxChange = (checkId: string, checked: boolean, finding?: string) => {
    const key = `${currentStep}-${checkId}`;
    setCheckStates(prev => ({ ...prev, [key]: checked }));

    if (checked && finding && selectedTeeth.length > 0) {
      const location = selectedTeeth.length === 1 ? `diente ${selectedTeeth[0]}` : `dientes ${selectedTeeth.join(", ")}`;
      onGenerateFinding(`${finding} - Localización: ${location}.`);
    }
  };

  return (
    <Card className="p-6 fade-in-up">
      {!hasImage && (
        <Alert className="mb-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Cargue una radiografía para iniciar</AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <CheckCircle2 className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Flujo Diagnóstico</h3>
          <p className="text-xs text-muted-foreground">White & Pharoah (8ª ed.)</p>
        </div>
      </div>

      <DiagnosticStepper currentStep={currentStep} totalSteps={steps.length} completedSteps={completedSteps} />

      <div className="mt-6 bg-gradient-to-r from-primary/5 to-accent/5 p-5 rounded-lg border">
        <h4 className="text-base font-semibold mb-2">{currentStepData.title}</h4>
        <p className="text-sm text-muted-foreground mb-4">{currentStepData.description}</p>

        <div className="space-y-2.5">
          {currentStepData.checks.map((check) => {
            const key = `${currentStep}-${check.id}`;
            const isChecked = checkStates[key] || false;
            
            return (
              <div key={check.id} className={`flex items-start gap-3 p-3.5 rounded-lg border transition-all ${isChecked ? 'bg-success/5 border-success/30' : 'bg-background hover:bg-muted/30'}`}>
                <Checkbox id={key} checked={isChecked} onCheckedChange={(checked) => handleCheckboxChange(check.id, checked as boolean, check.finding)} disabled={!hasImage} />
                <label htmlFor={key} className={`text-sm cursor-pointer flex-1 ${!hasImage ? 'opacity-50' : ''}`}>
                  {check.text}
                  {check.finding && selectedTeeth.length === 0 && <Badge variant="outline" className="ml-2 text-xs">Requiere dientes</Badge>}
                </label>
                {isChecked && <CheckCircle2 className="h-5 w-5 text-success fade-in" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={() => onStepChange(currentStep - 1)} disabled={currentStep === 0 || !hasImage} size="lg" className="flex-1">
          <ChevronLeft className="h-5 w-5 mr-2" />Anterior
        </Button>
        <Button onClick={() => onStepChange(currentStep + 1)} disabled={currentStep === steps.length - 1 || !isCurrentStepComplete || !hasImage} size="lg" className="flex-1">
          Siguiente<ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </Card>
  );
};
