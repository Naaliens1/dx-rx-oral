import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, ZoomIn, ZoomOut, RotateCw, X } from "lucide-react";
import { toast } from "sonner";

interface XRayViewerProps {
  onImageChange?: (hasImage: boolean) => void;
}

export const XRayViewer = ({ onImageChange }: XRayViewerProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/dicom'];
      const validExtensions = ['.jpg', '.jpeg', '.png', '.dcm', '.dicom'];
      
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        toast.error("Formato de archivo inválido. Use JPG, PNG o DICOM");
        return;
      }

      // Validar tamaño (máx 20MB)
      if (file.size > 20 * 1024 * 1024) {
        toast.error("El archivo es demasiado grande. Máximo 20MB");
        return;
      }

      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setFileName(file.name);
      setZoom(100);
      setRotation(0);
      onImageChange?.(true);
      toast.success("Radiografía cargada correctamente");
    }
  };

  const handleRemoveImage = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(null);
    setFileName("");
    setZoom(100);
    setRotation(0);
    onImageChange?.(false);
    toast.info("Radiografía eliminada");
  };

  return (
    <Card className="p-6 h-full flex flex-col fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Visor de Radiografías</h2>
          {fileName && (
            <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]" title={fileName}>
              {fileName}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            disabled={!imageUrl}
            title="Reducir zoom"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            disabled={!imageUrl}
            title="Aumentar zoom"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRotation((rotation + 90) % 360)}
            disabled={!imageUrl}
            title="Rotar 90°"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          {imageUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
              className="hover:bg-destructive/10 hover:text-destructive"
              title="Eliminar radiografía"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg flex items-center justify-center overflow-hidden relative border-2 border-dashed border-border">
        {!imageUrl ? (
          <div className="text-center p-8 max-w-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4 animate-pulse">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Cargar Radiografía
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Suba una imagen en formato <strong>JPG</strong>, <strong>PNG</strong> o <strong>DICOM</strong><br/>
              Tamaño máximo: 20MB
            </p>
            <label htmlFor="file-upload">
              <Button asChild size="lg" className="gap-2">
                <span className="cursor-pointer">
                  <Upload className="h-5 w-5" />
                  Seleccionar archivo
                </span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*,.dcm,.dicom"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={imageUrl}
              alt="Radiografía oral"
              className="max-w-full max-h-full object-contain transition-all duration-300"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              }}
            />
          </div>
        )}
      </div>

      {imageUrl && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            Zoom: <span className="text-foreground">{zoom}%</span>
          </span>
          <label htmlFor="file-upload-change">
            <Button variant="outline" size="sm" asChild className="gap-2">
              <span className="cursor-pointer">
                <Upload className="h-4 w-4" />
                Cambiar imagen
              </span>
            </Button>
          </label>
          <input
            id="file-upload-change"
            type="file"
            accept="image/*,.dcm,.dicom"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      )}
    </Card>
  );
};
