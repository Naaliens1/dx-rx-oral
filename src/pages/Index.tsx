import { useState } from "react";
import { Header } from "@/components/Header";
import { XRayTypeSelector } from "@/components/XRayTypeSelector";
import { XRayViewer } from "@/components/XRayViewer";
import { DiagnosticFlow } from "@/components/DiagnosticFlow";
import { AnomaliesGlossary } from "@/components/AnomaliesGlossary";
import { DiagnosticReport } from "@/components/DiagnosticReport";

const Index = () => {
  const [selectedXRayType, setSelectedXRayType] = useState("periapical");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <XRayTypeSelector 
            value={selectedXRayType} 
            onValueChange={setSelectedXRayType}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel izquierdo: Visor de radiografías */}
          <div className="lg:col-span-1 h-[600px]">
            <XRayViewer />
          </div>

          {/* Panel central: Flujo de diagnóstico */}
          <div className="lg:col-span-1 space-y-6">
            <DiagnosticFlow xrayType={selectedXRayType} />
            <DiagnosticReport />
          </div>

          {/* Panel derecho: Glosario de anomalías */}
          <div className="lg:col-span-1 h-[600px]">
            <AnomaliesGlossary />
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
