import { useState } from "react";
import { Header } from "@/components/Header";
import { XRayTypeSelector } from "@/components/XRayTypeSelector";
import { XRayViewer } from "@/components/XRayViewer";
import { DiagnosticFlow } from "@/components/DiagnosticFlow";
import { ToothSelector } from "@/components/ToothSelector";
import { PathologySelector } from "@/components/PathologySelector";
import { DiagnosticGenerator } from "@/components/DiagnosticGenerator";

interface PathologyEntry {
  id: string;
  pathology: string;
  location: string;
  zone?: string;
  severity?: string;
  diagnosticText: string;
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

const Index = () => {
  const [selectedXRayType, setSelectedXRayType] = useState("periapical");
  const [selectedTeeth, setSelectedTeeth] = useState<string[]>([]);
  const [pathologyEntries, setPathologyEntries] = useState<PathologyEntry[]>([]);

  const handleToothSelect = (tooth: string) => {
    setSelectedTeeth(prev => {
      if (prev.includes(tooth)) {
        return prev.filter(t => t !== tooth);
      }
      return [...prev, tooth];
    });
  };

  const handlePathologySelect = (selection: { pathology: string; location: string; zone?: string; severity?: string }) => {
    const template = PATHOLOGY_TEMPLATES[selection.pathology];
    if (!template) return;

    const diagnosticText = template(
      selection.location,
      selection.zone || "",
      selection.severity || ""
    );

    const newEntry: PathologyEntry = {
      id: `${Date.now()}-${Math.random()}`,
      pathology: selection.pathology,
      location: selection.location,
      zone: selection.zone,
      severity: selection.severity,
      diagnosticText
    };

    setPathologyEntries(prev => [...prev, newEntry]);
  };

  const handleRemoveEntry = (id: string) => {
    setPathologyEntries(prev => prev.filter(entry => entry.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <XRayTypeSelector 
            value={selectedXRayType} 
            onValueChange={(value) => {
              setSelectedXRayType(value);
              setSelectedTeeth([]);
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel izquierdo: Visor y selector de dientes */}
          <div className="lg:col-span-1 space-y-4">
            <div className="h-[400px]">
              <XRayViewer />
            </div>
            <ToothSelector
              xrayType={selectedXRayType}
              selectedTeeth={selectedTeeth}
              onToothSelect={handleToothSelect}
            />
          </div>

          {/* Panel central: Flujo de diagnóstico y selección de patologías */}
          <div className="lg:col-span-1 space-y-4">
            <DiagnosticFlow xrayType={selectedXRayType} />
            <PathologySelector
              selectedTeeth={selectedTeeth}
              onPathologySelect={handlePathologySelect}
              xrayType={selectedXRayType}
            />
          </div>

          {/* Panel derecho: Diagnóstico generado */}
          <div className="lg:col-span-1">
            <DiagnosticGenerator
              pathologyEntries={pathologyEntries}
              onRemoveEntry={handleRemoveEntry}
              xrayType={selectedXRayType}
            />
          </div>
        </div>

        <footer className="mt-12 py-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            Basado en <span className="font-medium">White and Pharoah's Oral Radiology: Principles and Interpretation</span> (8ª edición, 2019)
          </p>
          <p className="mt-2">
            Asistente de Diagnóstico en Radiología Oral - Herramienta educativa profesional
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
