import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardList, ChevronRight, ChevronLeft } from "lucide-react";

interface DiagnosticFlowProps {
  xrayType: string;
  currentStep: number;
  onStepChange: (step: number) => void;
  completedSteps: number[];
  onStepComplete: (step: number, completed: boolean) => void;
}

const DIAGNOSTIC_STEPS = {
  periapical: [
    { 
      title: "1. Evaluar calidad de imagen",
      checks: [
        "Densidad y contraste adecuados",
        "Sin artefactos por movimiento",
        "Sin superposición de estructuras",
        "Posicionamiento correcto del sensor"
      ]
    },
    {
      title: "2. Revisar anatomía normal",
      checks: [
        "Lámina dura visible y continua",
        "Espacio del ligamento periodontal uniforme",
        "Cresta ósea alveolar definida",
        "Estructuras anatómicas normales identificadas"
      ]
    },
    {
      title: "3. Evaluar por regiones",
      checks: [
        "Corona: caries, restauraciones, fracturas",
        "Raíz: reabsorción, fracturas, hipercementosis",
        "Hueso periapical: lesiones radiolucentes/radiopacas",
        "Periodonto: pérdida ósea, lámina dura"
      ]
    },
    {
      title: "4. Identificar anomalías específicas",
      checks: [
        "Caries: profundidad y extensión",
        "Lesiones periapicales: tamaño y bordes",
        "Calcificaciones pulpares",
        "Reabsorción radicular: interna o externa"
      ]
    }
  ],
  bitewing: [
    {
      title: "1. Evaluar calidad de imagen",
      checks: [
        "Superposición interproximal correcta",
        "Contactos abiertos visibles",
        "Cresta ósea visible",
        "Sin elongación ni acortamiento"
      ]
    },
    {
      title: "2. Revisar anatomía normal",
      checks: [
        "Cresta ósea 1-2mm bajo unión amelocementaria",
        "Lámina dura continua",
        "Espacio periodontal uniforme",
        "Simetría bilateral"
      ]
    },
    {
      title: "3. Evaluar superficies interproximales",
      checks: [
        "Caries incipientes en esmalte",
        "Caries en dentina: superficial, media, profunda",
        "Caries recurrentes bajo restauraciones",
        "Estado de restauraciones existentes"
      ]
    },
    {
      title: "4. Evaluar pérdida ósea periodontal",
      checks: [
        "Pérdida horizontal: leve, moderada, severa",
        "Pérdida vertical (angular) si presente",
        "Distribución: localizada vs generalizada",
        "Medir desde unión amelocementaria"
      ]
    }
  ],
  panoramica: [
    {
      title: "1. Evaluar calidad de imagen",
      checks: [
        "Posicionamiento del paciente correcto",
        "Sin artefactos fantasma o dobles",
        "Simetría de estructuras bilaterales",
        "Nitidez adecuada"
      ]
    },
    {
      title: "2. Evaluar maxilar y mandíbula",
      checks: [
        "Simetría de estructuras óseas",
        "Continuidad de corticales",
        "Senos maxilares: tamaño, radiopacidad",
        "ATM bilateral"
      ]
    },
    {
      title: "3. Evaluar dientes",
      checks: [
        "Dientes impactados: posición y relación",
        "Dientes supernumerarios",
        "Ausencias dentales",
        "Anomalías de forma y número"
      ]
    },
    {
      title: "4. Identificar lesiones óseas",
      checks: [
        "Radiolucencias: uniloculares vs multiloculares",
        "Radiopacidades: densidad y bordes",
        "Quistes dentígeros en impactados",
        "Lesiones tumorales sospechosas"
      ]
    }
  ],
  cbct: [
    {
      title: "1. Evaluar calidad de imagen 3D",
      checks: [
        "Resolución adecuada para diagnóstico",
        "Sin artefactos metálicos significativos",
        "Campo de visión apropiado",
        "Orientación correcta de los planos"
      ]
    },
    {
      title: "2. Revisar en 3 planos",
      checks: [
        "Plano axial: extensión horizontal",
        "Plano coronal: relación vertical",
        "Plano sagital: relación anteroposterior",
        "Reconstrucciones 3D si necesario"
      ]
    },
    {
      title: "3. Evaluar hueso cortical y medular",
      checks: [
        "Integridad de corticales vestibular/lingual",
        "Expansión o perforación cortical",
        "Patrón trabecular del hueso medular",
        "Densidad ósea relativa"
      ]
    },
    {
      title: "4. Medir y caracterizar lesiones",
      checks: [
        "Dimensiones exactas en 3D",
        "Relación con estructuras vitales",
        "Extensión a tejidos blandos",
        "Características internas de la lesión"
      ]
    }
  ]
};

export const DiagnosticFlow = ({ 
  xrayType, 
  currentStep, 
  onStepChange,
  completedSteps,
  onStepComplete
}: DiagnosticFlowProps) => {
  const steps = DIAGNOSTIC_STEPS[xrayType as keyof typeof DIAGNOSTIC_STEPS] || DIAGNOSTIC_STEPS.periapical;
  const currentStepData = steps[currentStep];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">Flujo de Diagnóstico Sistemático</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          Paso {currentStep + 1}/{steps.length}
        </Badge>
      </div>

      {/* Progress indicator */}
      <div className="flex gap-1 mb-4">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors ${
              completedSteps.includes(index)
                ? 'bg-primary'
                : index === currentStep
                ? 'bg-primary/50'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Current step */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          {currentStepData.title}
        </h4>
        <div className="space-y-2">
          {currentStepData.checks.map((check, index) => (
            <div 
              key={index} 
              className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Checkbox 
                id={`check-${currentStep}-${index}`}
                onCheckedChange={(checked) => {
                  // Auto-complete step when all checks are done
                  const allChecked = currentStepData.checks.every((_, i) => {
                    const checkbox = document.getElementById(`check-${currentStep}-${i}`) as HTMLInputElement;
                    return i === index ? checked : checkbox?.checked;
                  });
                  if (allChecked && !completedSteps.includes(currentStep)) {
                    onStepComplete(currentStep, true);
                  }
                }}
              />
              <label
                htmlFor={`check-${currentStep}-${index}`}
                className="text-xs text-foreground cursor-pointer flex-1 leading-relaxed"
              >
                {check}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex-1"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            if (!completedSteps.includes(currentStep)) {
              onStepComplete(currentStep, true);
            }
            onStepChange(Math.min(steps.length - 1, currentStep + 1));
          }}
          disabled={currentStep === steps.length - 1}
          className="flex-1"
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* ABCDE Method reminder */}
      <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Método ABCDE:</strong> Airway (vías aéreas), Bone (hueso), 
          Calcifications (calcificaciones), Dental (estructuras dentales), Extra (estructuras adicionales)
        </p>
      </div>
    </Card>
  );
};
