// hooks/useMediaCapture.ts
import { useState, useCallback } from "react";

interface UseMediaCaptureReturn {
  capturedImage: string | null;
  isCapturing: boolean;
  captureFromCamera: () => Promise<void>;
  captureFromGallery: () => void;
  clearImage: () => void;
}

export function useMediaCapture(): UseMediaCaptureReturn {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const captureFromCamera = async () => {
    try {
      setIsCapturing(true);

      // Verifica se o navegador suporta a API de mídia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Seu navegador não suporta acesso à câmera");
        return;
      }

      // Solicita permissão para acessar a câmera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      // Cria um elemento de vídeo temporário
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      return new Promise<void>((resolve) => {
        video.addEventListener("loadeddata", () => {
          // Cria um canvas para capturar a foto
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Desenha o frame atual no canvas
          context?.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Converte para data URL (imagem)
          const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
          setCapturedImage(imageDataUrl);

          // Para a stream da câmera
          stream.getTracks().forEach((track) => track.stop());
          setIsCapturing(false);
          resolve();
        });
      });
    } catch (error) {
      console.error("Erro ao acessar a câmera:", error);
      setIsCapturing(false);

      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          alert("Permissão para acessar a câmera foi negada");
        } else if (error.name === "NotFoundError") {
          alert("Nenhuma câmera encontrada no dispositivo");
        } else {
          alert("Erro ao acessar a câmera: " + error.message);
        }
      }
    }
  };

  const captureFromGallery = useCallback(() => {
    // Cria um input file dinamicamente
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.position = "fixed";
    input.style.top = "-1000px";
    input.style.left = "-1000px";

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          alert("Por favor, selecione uma imagem válida");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          setCapturedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }

      // Remove o input do DOM
      document.body.removeChild(input);
    };

    document.body.appendChild(input);
    input.click();
  }, []);

  const clearImage = () => {
    setCapturedImage(null);
  };

  return {
    capturedImage,
    isCapturing,
    captureFromCamera,
    captureFromGallery,
    clearImage,
  };
}
