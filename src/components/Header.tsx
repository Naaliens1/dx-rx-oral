import { Activity } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Asistente de Diagnóstico en Radiología Oral
            </h1>
            <p className="text-sm text-muted-foreground">
              Guía sistemática basada en White and Pharoah (8ª ed.)
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
