// components/image-capture-area.tsx
import { Camera, HelpCircle, Image, Edit3, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useMediaCapture } from "../hooks/useMediaCapture";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ImageCaptureAreaProps {
  onImageCaptured: (imageDataUrl: string) => void;
  showTutorial?: boolean;
  onShowTutorialChange?: (show: boolean) => void;
}

export function ImageCaptureArea({
  onImageCaptured,
  showTutorial = false,
  onShowTutorialChange,
}: ImageCaptureAreaProps) {
  const [showCaptureOptions, setShowCaptureOptions] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualIngredientName, setManualIngredientName] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const {
    capturedImage,
    isCapturing,
    captureFromCamera,
    captureFromGallery,
    clearImage,
  } = useMediaCapture();

  // Quando uma imagem é capturada, mostra o preview
  useEffect(() => {
    if (capturedImage) {
      setShowPreview(true);
    }
  }, [capturedImage]);

  const confirmImage = () => {
    if (capturedImage) {
      onImageCaptured(capturedImage);
      clearImage();
      setShowPreview(false);
    }
  };

  const discardImage = () => {
    clearImage();
    setShowPreview(false);
  };

  const handleCaptureButtonClick = () => {
    setShowCaptureOptions(true);
  };

  const handleCameraOption = async () => {
    setShowCaptureOptions(false);
    await captureFromCamera();
  };

  const handleGalleryOption = () => {
    setShowCaptureOptions(false);
    captureFromGallery();
  };

  const handleManualOption = () => {
    setShowCaptureOptions(false);
    setShowManualInput(true);
  };

  const handleManualIngredientSubmit = () => {
    if (manualIngredientName.trim()) {
      const textImage = createTextImage(manualIngredientName.trim());
      onImageCaptured(textImage);
      setManualIngredientName("");
      setShowManualInput(false);
    }
  };

  const createTextImage = (text: string): string => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 400;
    canvas.height = 200;

    if (ctx) {
      ctx.fillStyle = "#4ECDC4";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const words = text.split(" ");
      let line = "";
      const lines = [];
      const maxWidth = canvas.width - 40;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          lines.push(line);
          line = words[i] + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      const lineHeight = 28;
      const startY = (canvas.height - lines.length * lineHeight) / 2;

      lines.forEach((line, index) => {
        ctx.fillText(
          line.trim(),
          canvas.width / 2,
          startY + index * lineHeight
        );
      });
    }

    return canvas.toDataURL();
  };

  return (
    <>
      {/* Capture Area */}
      <div className="px-6">
        <div className="relative">
          <button
            onClick={handleCaptureButtonClick}
            disabled={isCapturing}
            className="w-full bg-[#F8F9FA] border-2 border-dashed border-[#6C757D]/30 rounded-xl p-12 flex flex-col items-center justify-center gap-3 hover:bg-[#F8F9FA]/80 hover:border-[#FF6B35]/50 transition-interactive focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Fotografar ingredientes"
          >
            {isCapturing ? (
              <>
                <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                <div className="text-center">
                  <p className="text-[#343A40]">Preparando câmera...</p>
                  <p className="text-sm text-[#6C757D] mt-1">
                    Aguardando permissão
                  </p>
                </div>
              </>
            ) : (
              <>
                <Camera className="w-12 h-12 text-[#FF6B35]" />
                <div className="text-center">
                  <p className="text-[#343A40]">
                    Toque para fotografar ingredientes
                  </p>
                  <p className="text-sm text-[#6C757D] mt-1">
                    ou escolher da galeria
                  </p>
                </div>
              </>
            )}
          </button>

          <button
            onClick={() => onShowTutorialChange?.(true)}
            className="absolute top-3 right-3 touch-target w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-sm transition-interactive focus-ring"
            aria-label="Ajuda de captura"
          >
            <HelpCircle className="w-5 h-5 text-[#FF6B35]" />
          </button>
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Imagem</DialogTitle>
          </DialogHeader>
          {capturedImage && (
            <div className="py-4">
              <img
                src={capturedImage}
                alt="Prévia da imagem capturada"
                className="w-full rounded-lg object-cover max-h-96"
              />
            </div>
          )}
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={discardImage}
              className="flex-1 h-[44px] transition-interactive focus-ring"
            >
              Descartar
            </Button>
            <Button
              onClick={confirmImage}
              className="flex-1 h-[44px] bg-[#FF6B35] hover:bg-[#FF6B35]/90 transition-interactive focus-ring"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Capture Options Sheet */}
      <Sheet open={showCaptureOptions} onOpenChange={setShowCaptureOptions}>
        <SheetContent side="bottom" className="h-auto">
          <SheetHeader>
            <SheetTitle>Como deseja adicionar ingredientes?</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-3">
            <button
              onClick={handleCameraOption}
              className="w-full h-[60px] flex items-center gap-4 px-4 rounded-lg bg-[#F8F9FA] hover:bg-[#FF6B35]/10 border-2 border-transparent hover:border-[#FF6B35]/30 transition-interactive focus-ring"
            >
              <div className="w-12 h-12 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
                <Camera className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[#343A40]">Tirar Foto</p>
                <p className="text-sm text-[#6C757D]">
                  Usar a câmera do dispositivo
                </p>
              </div>
            </button>

            <button
              onClick={handleGalleryOption}
              className="w-full h-[60px] flex items-center gap-4 px-4 rounded-lg bg-[#F8F9FA] hover:bg-[#4ECDC4]/10 border-2 border-transparent hover:border-[#4ECDC4]/30 transition-interactive focus-ring"
            >
              <div className="w-12 h-12 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center">
                <Image className="w-6 h-6 text-[#4ECDC4]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[#343A40]">Escolher da Galeria</p>
                <p className="text-sm text-[#6C757D]">
                  Selecionar uma imagem existente
                </p>
              </div>
            </button>

            <button
              onClick={handleManualOption}
              className="w-full h-[60px] flex items-center gap-4 px-4 rounded-lg bg-[#F8F9FA] hover:bg-[#FFD166]/10 border-2 border-transparent hover:border-[#FFD166]/30 transition-interactive focus-ring"
            >
              <div className="w-12 h-12 rounded-full bg-[#FFD166]/10 flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-[#FFD166]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[#343A40]">Adicionar Manualmente</p>
                <p className="text-sm text-[#6C757D]">
                  Digitar os ingredientes
                </p>
              </div>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Manual Ingredient Input Dialog */}
      <Dialog open={showManualInput} onOpenChange={setShowManualInput}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Ingrediente</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ingredient-name">Nome do Ingrediente</Label>
              <Input
                id="ingredient-name"
                value={manualIngredientName}
                onChange={(e) => setManualIngredientName(e.target.value)}
                placeholder="Ex: Tomate, Cebola, Alho..."
                className="h-[44px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleManualIngredientSubmit();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowManualInput(false);
                setManualIngredientName("");
              }}
              className="flex-1 h-[44px] transition-interactive focus-ring"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleManualIngredientSubmit}
              disabled={!manualIngredientName.trim()}
              className="flex-1 h-[44px] bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 transition-interactive focus-ring disabled:opacity-50"
            >
              <Check className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
