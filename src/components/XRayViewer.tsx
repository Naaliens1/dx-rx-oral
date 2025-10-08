import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

export const XRayViewer = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Visor de Radiografías</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            disabled={!imageUrl}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            disabled={!imageUrl}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRotation((rotation + 90) % 360)}
            disabled={!imageUrl}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-muted rounded-lg flex items-center justify-center overflow-hidden relative">
        {!imageUrl ? (
          <div className="text-center p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Cargar Radiografía
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sube una imagen en formato JPG, PNG o DICOM
            </p>
            <label htmlFor="file-upload">
              <Button asChild>
                <span className="cursor-pointer">Seleccionar archivo</span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={imageUrl}
              alt="Radiografía"
              className="max-w-full max-h-full object-contain transition-transform"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              }}
            />
          </div>
        )}
      </div>

      {imageUrl && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Zoom: {zoom}%
          </span>
          <label htmlFor="file-upload-change">
            <Button variant="outline" size="sm" asChild>
              <span className="cursor-pointer">Cambiar imagen</span>
            </Button>
          </label>
          <input
            id="file-upload-change"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      )}
    </Card>
  );
};
