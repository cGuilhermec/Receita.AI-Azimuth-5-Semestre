// services/iaService.ts - ARQUIVO CORRIGIDO
import { api } from "../components/api/api";

export interface RecipeResponse {
  isReceita: boolean;
  mensagem?: string;
  titulo?: string;
  ingredientes?: string[];
  modo_preparo?: string;
}

export interface ChatResponse {
  chatId: string;
  resposta: RecipeResponse;
}

export const iaService = {
  async sendToAI(
    ingredients: string[],
    imageDataUrls: string[],
    userMessage?: string, // ← MUDEI: Agora aceita a mensagem do usuário
    chatId?: string,
    isGuest: boolean = true
  ): Promise<ChatResponse> {
    const formData = new FormData();

    // ✅ AGORA USA A MENSAGEM DO USUÁRIO SE EXISTIR
    // ✅ Se não, usa os ingredientes como fallback
    const texto =
      userMessage ||
      (ingredients.length > 0
        ? `Crie uma receita usando estes ingredientes: ${ingredients.join(
            ", "
          )}`
        : "Analise os ingredientes e crie uma receita");

    formData.append("texto", texto);
    if (chatId) formData.append("chatId", chatId);

    // ✅ Envia apenas UMA imagem
    if (imageDataUrls.length > 0) {
      try {
        const file = await dataURLtoFile(imageDataUrls[0], "ingredient.jpg");
        formData.append("imagem", file);
      } catch (error) {
        console.error("Erro ao converter imagem:", error);
      }
    }

    console.log("📤 Enviando IA:");
    console.log("texto:", texto);
    console.log("chatId:", chatId);
    console.log("imagens:", imageDataUrls.length);

    try {
      const endpoint = isGuest ? "/chat/ia/guest" : "/chat/ia";
      const response = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: !isGuest,
        timeout: 120000,
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ Erro ao enviar para IA:", error);
      throw new Error(
        error.response?.data?.error || "Erro ao processar receita"
      );
    }
  },
};

// ✅ Função para converter DataURL para File
function dataURLtoFile(dataurl: string, filename: string): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      const arr = dataurl.split(",");
      if (arr.length < 2) {
        reject(new Error("DataURL inválido"));
        return;
      }

      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch) {
        reject(new Error("Tipo MIME não encontrado"));
        return;
      }

      const mime = mimeMatch[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      const file = new File([u8arr], filename, { type: mime });
      resolve(file);
    } catch (error) {
      reject(error);
    }
  });
}
