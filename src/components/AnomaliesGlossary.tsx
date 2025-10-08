import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const anomalies = [
  {
    category: "Anomalías Fundamentales",
    items: [
      {
        name: "Artefactos",
        type: "radiopaca/radiolucente",
        description: "Sombras radiopacas/radiolucentes no anatómicas causadas por movimiento, superposición o problemas técnicos.",
        diagnosis: "Líneas irregulares, probable artefacto por movimiento/superposición.",
        steps: "Repetir imagen con técnica adecuada",
        page: "p. 41-63"
      },
      {
        name: "Pérdida de lámina dura",
        type: "radiolucente",
        description: "Ausencia de línea radiopaca que rodea la raíz dental, indica inflamación o patología periapical.",
        diagnosis: "Lámina dura discontinua en [diente], sugiere inflamación periodontal o periapical.",
        steps: "Correlacionar con pruebas de vitalidad pulpar, evaluación clínica",
        page: "p. 97-120"
      },
      {
        name: "Variaciones anatómicas (torus)",
        type: "radiopaca",
        description: "Masa ósea radiopaca simétrica, generalmente benigna, en paladar o mandíbula.",
        diagnosis: "Masa radiopaca en paladar/mandíbula, compatible con torus palatino/mandibular.",
        steps: "Descartar tumores óseos mediante evaluación clínica y seguimiento",
        page: "p. 105"
      }
    ]
  },
  {
    category: "Anomalías Dentales",
    items: [
      {
        name: "Caries dental",
        type: "radiolucente",
        description: "Radiolucencia triangular en esmalte/dentina por desmineralización bacteriana.",
        diagnosis: "Caries en [diente], afecta esmalte/dentina [superficial/media/profunda].",
        steps: "Clasificar profundidad (C1-C4), planificar restauración según extensión",
        page: "p. 171-190"
      },
      {
        name: "Lesión periapical",
        type: "radiolucente",
        description: "Radiolucencia en ápice radicular con bordes definidos (quiste) o difusos (absceso/granuloma).",
        diagnosis: "Lesión radiolucente en ápice de [diente], sugiere absceso/granuloma/quiste periapical.",
        steps: "Pruebas pulpares (vitalidad), considerar endodoncia o exodoncia",
        page: "p. 191-210"
      },
      {
        name: "Reabsorción radicular",
        type: "radiolucente",
        description: "Acortamiento o muescas en raíz, externa (trauma, ortodoncia) o interna (pulpitis).",
        diagnosis: "Reabsorción [externa/interna] en [diente], probablemente por trauma/ortodoncia.",
        steps: "CBCT para evaluar extensión, tratamiento endodóntico si interna",
        page: "p. 211-230"
      },
      {
        name: "Calcificaciones pulpares",
        type: "radiopaca",
        description: "Áreas radiopacas dentro de la cámara pulpar (piedras pulpares, dentículos).",
        diagnosis: "Calcificaciones en pulpa de [diente], probablemente piedras pulpares por edad/trauma.",
        steps: "Evaluar vitalidad pulpar, considerar si afecta acceso endodóntico",
        page: "p. 200"
      },
      {
        name: "Diente impactado/supernumerario",
        type: "radiopaco",
        description: "Diente no erupcionado (impactado) o adicional (supernumerario) en posición ectópica.",
        diagnosis: "Diente [impactado/supernumerario] en [ubicación], evaluar relación con estructuras.",
        steps: "CBCT para planificación quirúrgica, valorar extracción",
        page: "p. 215"
      }
    ]
  },
  {
    category: "Anomalías Óseas",
    items: [
      {
        name: "Pérdida ósea periodontal",
        type: "radiolucente",
        description: "Reducción horizontal o vertical de la cresta alveolar por enfermedad periodontal.",
        diagnosis: "Pérdida ósea [horizontal/vertical] en [región], compatible con periodontitis [leve/moderada/severa].",
        steps: "Medir desde unión amelocementaria, tratamiento periodontal según severidad",
        page: "p. 261-280"
      },
      {
        name: "Quiste dentígero",
        type: "radiolucente",
        description: "Radiolucencia unilocular bien definida alrededor de corona de diente impactado.",
        diagnosis: "Lesión radiolucente unilocular en corona de [diente impactado], quiste dentígero.",
        steps: "CBCT para evaluar extensión, biopsia y enucleación quirúrgica",
        page: "p. 321-340"
      },
      {
        name: "Ameloblastoma",
        type: "radiolucente",
        description: "Lesión radiolucente multilocular con patrón 'jabonera' o 'panal de abejas', localmente agresiva.",
        diagnosis: "Lesión multilocular en [región mandibular], patrón jabonera, posible ameloblastoma.",
        steps: "Biopsia urgente, CBCT para planificación quirúrgica, resección amplia",
        page: "p. 361-380"
      },
      {
        name: "Hipercementosis",
        type: "radiopaca",
        description: "Engrosamiento radiopaco del cemento en ápice radicular, aspecto bulboso.",
        diagnosis: "Raíz bulbosa en [diente], hipercementosis benigna.",
        steps: "Descartar osteoma, considerar dificultad en extracción dental",
        page: "p. 300"
      },
      {
        name: "Fractura ósea",
        type: "radiolucente",
        description: "Línea radiolucente que atraviesa cortical ósea, indica discontinuidad traumática.",
        diagnosis: "Fractura en [hueso maxilar/mandibular], línea radiolucente evidente.",
        steps: "CBCT si fractura compleja, valorar reducción y fijación quirúrgica",
        page: "p. 281-300"
      },
      {
        name: "Displasia fibrosa",
        type: "radiopaca/mixta",
        description: "Patrón óseo 'vidrio esmerilado' con mezcla de radiolucencia y radiopacidad.",
        diagnosis: "Área difusa con patrón vidrio esmerilado en [maxilar/mandíbula], displasia fibrosa.",
        steps: "Descartar osteoma u otros tumores, biopsia si atípico, seguimiento",
        page: "p. 461-480"
      },
      {
        name: "Carcinoma de células escamosas",
        type: "radiolucente",
        description: "Destrucción ósea irregular, invasiva, con bordes mal definidos (malignidad).",
        diagnosis: "Lesión destructiva irregular en [región], altamente sospechosa de malignidad (carcinoma).",
        steps: "Biopsia urgente, CBCT/PET para estadificación, referir a oncología",
        page: "p. 421-440"
      },
      {
        name: "Osteomielitis",
        type: "radiolucente/mixta",
        description: "Lesión difusa con sequestros radiopacos (hueso necrótico) por infección bacteriana.",
        diagnosis: "Lesión difusa con sequestros radiopacos en [hueso], osteomielitis aguda/crónica.",
        steps: "Correlacionar con infección clínica, antibióticos, desbridamiento quirúrgico",
        page: "p. 285"
      }
    ]
  }
];

export const AnomaliesGlossary = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAnomalies = anomalies.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <Card className="p-6 h-full overflow-hidden flex flex-col">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Glosario de Anomalías
          </h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar anomalía..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1 pr-2">
        <Accordion type="single" collapsible className="space-y-2">
          {filteredAnomalies.map((category, idx) => (
            <AccordionItem key={idx} value={`category-${idx}`} className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium">
                {category.category} ({category.items.length})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {category.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="p-3 bg-muted/30 rounded-lg space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-foreground">{item.name}</h4>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium text-primary">Diagnóstico:</span>{" "}
                          <span className="text-foreground italic">"{item.diagnosis}"</span>
                        </p>
                        <p className="text-sm">
                          <span className="font-medium text-accent">Pasos:</span>{" "}
                          <span className="text-foreground">{item.steps}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          White & Pharoah {item.page}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Card>
  );
};
