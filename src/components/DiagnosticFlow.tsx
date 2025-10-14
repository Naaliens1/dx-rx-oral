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
  selectedTeeth: string[];
  onGenerateFinding: (finding: string) => void;
}

const DIAGNOSTIC_STEPS = {
  periapical: [
    { 
      title: "1. Evaluar calidad de imagen",
      checks: [
        { text: "Densidad y contraste adecuados", finding: "Imagen con densidad y contraste adecuados para diagnóstico." },
        { text: "Sin artefactos por movimiento", finding: "No se observan artefactos por movimiento del paciente." },
        { text: "Sin superposición de estructuras", finding: "Ausencia de superposición de estructuras anatómicas." },
        { text: "Posicionamiento correcto del sensor", finding: "Posicionamiento técnico correcto del sensor radiográfico." }
      ]
    },
    {
      title: "2. Revisar anatomía normal",
      checks: [
        { text: "Lámina dura visible y continua", finding: "Lámina dura presente y continua alrededor del diente evaluado." },
        { text: "Espacio del ligamento periodontal uniforme", finding: "Espacio del ligamento periodontal uniforme (0.25-0.30mm)." },
        { text: "Cresta ósea alveolar definida", finding: "Cresta ósea alveolar 1-2mm bajo unión amelocementaria (normal)." },
        { text: "Estructuras anatómicas normales identificadas", finding: "Estructuras anatómicas circundantes dentro de límites normales." }
      ]
    },
    {
      title: "3. Evaluar por regiones",
      checks: [
        { text: "Corona: caries, restauraciones, fracturas", finding: "Corona evaluada: esmalte y dentina intactos, sin evidencia de caries." },
        { text: "Raíz: reabsorción, fracturas, hipercementosis", finding: "Raíz con contorno normal, sin signos de reabsorción ni fracturas." },
        { text: "Hueso periapical: lesiones radiolucentes/radiopacas", finding: "Región periapical sin lesiones radiolucentes ni radiopacas." },
        { text: "Periodonto: pérdida ósea, lámina dura", finding: "Soporte periodontal conservado, sin pérdida ósea evidente." }
      ]
    },
    {
      title: "4. Identificar anomalías específicas",
      checks: [
        { text: "Caries: profundidad y extensión", finding: null },
        { text: "Lesiones periapicales: tamaño y bordes", finding: null },
        { text: "Calcificaciones pulpares", finding: null },
        { text: "Reabsorción radicular: interna o externa", finding: null }
      ]
    }
  ],
  bitewing: [
    {
      title: "1. Evaluar calidad de imagen",
      checks: [
        { text: "Superposición interproximal correcta", finding: "Superposición interproximal adecuada (<1mm en premolares, <2mm en molares)." },
        { text: "Contactos abiertos visibles", finding: "Contactos interproximales abiertos y visibles para evaluación." },
        { text: "Cresta ósea visible", finding: "Cresta ósea alveolar visible en toda la imagen." },
        { text: "Sin elongación ni acortamiento", finding: "Ausencia de distorsión por elongación o acortamiento radiográfico." }
      ]
    },
    {
      title: "2. Revisar anatomía normal",
      checks: [
        { text: "Cresta ósea 1-2mm bajo unión amelocementaria", finding: "Nivel de cresta ósea 1-2mm bajo unión amelocementaria (normal)." },
        { text: "Lámina dura continua", finding: "Lámina dura continua en región interproximal." },
        { text: "Espacio periodontal uniforme", finding: "Espacio del ligamento periodontal uniforme bilateralmente." },
        { text: "Simetría bilateral", finding: "Simetría bilateral de estructuras óseas." }
      ]
    },
    {
      title: "3. Evaluar superficies interproximales",
      checks: [
        { text: "Caries incipientes en esmalte", finding: "Superficies interproximales evaluadas, sin lesiones incipientes en esmalte." },
        { text: "Caries en dentina: superficial, media, profunda", finding: null },
        { text: "Caries recurrentes bajo restauraciones", finding: "Restauraciones evaluadas sin evidencia de caries recurrente." },
        { text: "Estado de restauraciones existentes", finding: "Restauraciones presentes con adaptación marginal adecuada." }
      ]
    },
    {
      title: "4. Evaluar pérdida ósea periodontal",
      checks: [
        { text: "Pérdida horizontal: leve, moderada, severa", finding: null },
        { text: "Pérdida vertical (angular) si presente", finding: null },
        { text: "Distribución: localizada vs generalizada", finding: "Distribución evaluada en todos los dientes visibles." },
        { text: "Medir desde unión amelocementaria", finding: "Mediciones realizadas desde unión amelocementaria a cresta ósea." }
      ]
    }
  ],
  panoramica: [
    {
      title: "1. Evaluar calidad de imagen",
      checks: [
        { text: "Posicionamiento del paciente correcto", finding: "Posicionamiento del paciente adecuado, plano oclusal recto." },
        { text: "Sin artefactos fantasma o dobles", finding: "Ausencia de artefactos fantasma o imágenes dobles." },
        { text: "Simetría de estructuras bilaterales", finding: "Simetría bilateral de ramas mandibulares y cóndilos." },
        { text: "Nitidez adecuada", finding: "Nitidez diagnóstica adecuada en toda la imagen." }
      ]
    },
    {
      title: "2. Evaluar maxilar y mandíbula",
      checks: [
        { text: "Simetría de estructuras óseas", finding: "Estructuras óseas maxilares y mandibulares simétricas." },
        { text: "Continuidad de corticales", finding: "Corticales superior e inferior de mandíbula continuas." },
        { text: "Senos maxilares: tamaño, radiopacidad", finding: "Senos maxilares de tamaño normal, radiolúcidos bilateralmente." },
        { text: "ATM bilateral", finding: "Articulación temporomandibular bilateral sin alteraciones visibles." }
      ]
    },
    {
      title: "3. Evaluar dientes",
      checks: [
        { text: "Dientes impactados: posición y relación", finding: null },
        { text: "Dientes supernumerarios", finding: "No se observan dientes supernumerarios." },
        { text: "Ausencias dentales", finding: null },
        { text: "Anomalías de forma y número", finding: "Forma y número dentario sin anomalías evidentes." }
      ]
    },
    {
      title: "4. Identificar lesiones óseas",
      checks: [
        { text: "Radiolucencias: uniloculares vs multiloculares", finding: null },
        { text: "Radiopacidades: densidad y bordes", finding: null },
        { text: "Quistes dentígeros en impactados", finding: null },
        { text: "Lesiones tumorales sospechosas", finding: "No se observan lesiones con características tumorales." }
      ]
    }
  ],
  cbct: [
    {
      title: "1. Evaluar calidad de imagen 3D",
      checks: [
        { text: "Resolución adecuada para diagnóstico", finding: "Resolución volumétrica adecuada para evaluación diagnóstica." },
        { text: "Sin artefactos metálicos significativos", finding: "Artefactos metálicos mínimos que no comprometen el diagnóstico." },
        { text: "Campo de visión apropiado", finding: "Campo de visión apropiado para región de interés." },
        { text: "Orientación correcta de los planos", finding: "Planos axial, coronal y sagital correctamente orientados." }
      ]
    },
    {
      title: "2. Revisar en 3 planos",
      checks: [
        { text: "Plano axial: extensión horizontal", finding: "Plano axial revisado, extensión horizontal evaluada." },
        { text: "Plano coronal: relación vertical", finding: "Plano coronal analizado, relaciones verticales normales." },
        { text: "Plano sagital: relación anteroposterior", finding: "Plano sagital evaluado, relaciones anteroposteriores adecuadas." },
        { text: "Reconstrucciones 3D si necesario", finding: "Reconstrucción 3D realizada para mejor visualización." }
      ]
    },
    {
      title: "3. Evaluar hueso cortical y medular",
      checks: [
        { text: "Integridad de corticales vestibular/lingual", finding: "Corticales vestibular y lingual/palatina íntegras." },
        { text: "Expansión o perforación cortical", finding: null },
        { text: "Patrón trabecular del hueso medular", finding: "Patrón trabecular de hueso medular normal." },
        { text: "Densidad ósea relativa", finding: "Densidad ósea dentro de parámetros normales." }
      ]
    },
    {
      title: "4. Medir y caracterizar lesiones",
      checks: [
        { text: "Dimensiones exactas en 3D", finding: null },
        { text: "Relación con estructuras vitales", finding: null },
        { text: "Extensión a tejidos blandos", finding: null },
        { text: "Características internas de la lesión", finding: null }
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
  onGenerateFinding
}: DiagnosticFlowProps) => {
  const steps = DIAGNOSTIC_STEPS[xrayType as keyof typeof DIAGNOSTIC_STEPS] || DIAGNOSTIC_STEPS.periapical;
  const currentStepData = steps[currentStep];

  const handleCheckboxChange = (checked: boolean, checkItem: { text: string; finding: string | null }) => {
    if (checked && checkItem.finding && selectedTeeth.length > 0) {
      const location = selectedTeeth.join(", ");
      const findingText = checkItem.finding.replace(/diente evaluado|región evaluada|dientes visibles/g, `diente(s) ${location}`);
      onGenerateFinding(findingText);
    }
  };

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
                  handleCheckboxChange(!!checked, check);
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
                {check.text}
                {!check.finding && selectedTeeth.length > 0 && (
                  <Badge variant="outline" className="ml-2 text-xs">Requiere patología específica</Badge>
                )}
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
