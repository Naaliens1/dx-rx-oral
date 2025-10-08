import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";

interface DiagnosticFlowProps {
  xrayType: string;
}

const diagnosticSteps = {
  periapical: [
    {
      title: "Evaluar calidad de la imagen",
      checks: [
        "¿La densidad y contraste son adecuados?",
        "¿Hay artefactos (distorsión, superposición, movimiento)?",
        "¿La imagen está centrada en la región de interés?"
      ]
    },
    {
      title: "Revisar anatomía normal",
      checks: [
        "Identificar lámina dura",
        "Verificar espacio periodontal",
        "Evaluar cortical ósea"
      ]
    },
    {
      title: "Evaluar por regiones",
      checks: [
        "Corona: buscar caries",
        "Raíz: evaluar reabsorción, hipercementosis",
        "Hueso periapical: detectar lesiones radiolucentes",
        "Periodonto: pérdida ósea, lámina dura"
      ]
    },
    {
      title: "Identificar anomalías",
      checks: [
        "Evaluar densidad (radiolucente/radiopaca)",
        "Analizar bordes (definidos/difusos)",
        "Determinar localización exacta"
      ]
    }
  ],
  bitewing: [
    {
      title: "Evaluar calidad de la imagen",
      checks: [
        "¿Las superficies interproximales están visibles?",
        "¿Hay superposición de contactos?",
        "¿La densidad es adecuada?"
      ]
    },
    {
      title: "Evaluar caries interproximales",
      checks: [
        "Buscar radiolucencias triangulares en esmalte",
        "Evaluar extensión en dentina",
        "Clasificar profundidad (superficial/media/profunda)"
      ]
    },
    {
      title: "Evaluar hueso periodontal",
      checks: [
        "Medir distancia desde unión amelocementaria",
        "Identificar pérdida ósea (horizontal/vertical)",
        "Evaluar lámina dura"
      ]
    }
  ],
  panoramica: [
    {
      title: "Evaluar calidad y simetría",
      checks: [
        "¿La imagen está centrada?",
        "¿Hay artefactos de movimiento?",
        "Evaluar simetría bilateral"
      ]
    },
    {
      title: "Evaluar estructuras óseas",
      checks: [
        "Maxilar/mandíbula: evaluar corticales",
        "Buscar asimetrías",
        "Identificar fracturas o discontinuidades"
      ]
    },
    {
      title: "Evaluar dientes",
      checks: [
        "Identificar dientes impactados",
        "Buscar supernumerarios",
        "Evaluar relaciones con estructuras adyacentes"
      ]
    },
    {
      title: "Buscar lesiones",
      checks: [
        "Identificar radiolucencias (unilocular/multilocular)",
        "Evaluar radiopacidades",
        "Analizar bordes y extensión"
      ]
    }
  ],
  cbct: [
    {
      title: "Evaluar calidad de adquisición",
      checks: [
        "¿El volumen capturado es adecuado?",
        "¿Hay artefactos metálicos?",
        "Verificar resolución"
      ]
    },
    {
      title: "Revisar en múltiples planos",
      checks: [
        "Corte axial: evaluar extensión transversal",
        "Corte coronal: evaluar altura y relaciones verticales",
        "Corte sagital: evaluar profundidad anteroposterior"
      ]
    },
    {
      title: "Evaluar cortical ósea",
      checks: [
        "Identificar expansión cortical",
        "Evaluar erosión o perforación",
        "Medir grosor óseo"
      ]
    },
    {
      title: "Analizar extensión 3D",
      checks: [
        "Determinar límites exactos de lesiones",
        "Evaluar relación con estructuras vitales",
        "Planificar abordaje quirúrgico si necesario"
      ]
    }
  ]
};

export const DiagnosticFlow = ({ xrayType }: DiagnosticFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean[]>>({});

  const steps = diagnosticSteps[xrayType as keyof typeof diagnosticSteps] || diagnosticSteps.periapical;

  const handleCheckChange = (stepIndex: number, checkIndex: number, checked: boolean) => {
    setCheckedItems(prev => ({
      ...prev,
      [stepIndex]: {
        ...prev[stepIndex],
        [checkIndex]: checked
      }
    }));
  };

  const isStepComplete = (stepIndex: number) => {
    const checks = checkedItems[stepIndex];
    if (!checks) return false;
    return Object.values(checks).every(v => v === true);
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-foreground">
            Flujo de Diagnóstico
          </h2>
          <span className="text-sm text-muted-foreground">
            Paso {currentStep + 1} de {steps.length}
          </span>
        </div>
        <div className="flex gap-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-colors ${
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-2">
          {isStepComplete(currentStep) && (
            <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
          )}
          <h3 className="text-base font-medium text-foreground">
            {steps[currentStep].title}
          </h3>
        </div>

        <div className="space-y-3">
          {steps[currentStep].checks.map((check, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Checkbox
                id={`check-${currentStep}-${index}`}
                checked={checkedItems[currentStep]?.[index] || false}
                onCheckedChange={(checked) => 
                  handleCheckChange(currentStep, index, checked as boolean)
                }
              />
              <label
                htmlFor={`check-${currentStep}-${index}`}
                className="text-sm text-foreground cursor-pointer flex-1"
              >
                {check}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <Button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="flex-1"
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </Card>
  );
};
