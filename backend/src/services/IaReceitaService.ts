import { MensagemModel } from "../model/MensagemModel";
import { ChatModel } from "../model/ChatModel";
import apiIaReceita from "../api/ApiIaReceita";
import { UserModel } from "../model/UserModel";
import { spawn } from "child_process"; // Para chamar Python
import path from "path";

// Função para chamar Python CLI e retornar os ingredientes detectados
async function detectarIngredientes(caminhoImagem: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
   const scriptPath = path.resolve(
     __dirname,
     "../../IA_Treinada/detect_imagem_cli.py"
   );
 // caminho do script
    const pyProcess = spawn("py", [scriptPath, caminhoImagem]);

    let output = "";
    pyProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pyProcess.stderr.on("data", (data) => {
      console.error("Erro Python:", data.toString());
    });

    pyProcess.on("close", (code) => {
      if (code === 0) {
        const itens = output
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean);
        resolve(itens);
      } else {
        reject(new Error(`Python script finalizou com código ${code}`));
      }
    });
  });
}

async function traduzirIngrediente(ingrediente: string): Promise<string> {
  const prompt = `Traduza esta palavra para português: ${ingrediente} passe apenas a palavra traduzida como resposta.`;

  try {
    const result = await apiIaReceita.post("/generate", {
      prompt,
      model: "llama3",
      stream: false,
      timeOut: 2000,
    });

    const respostaRaw = result.data;
    let traducao;
    try {
      traducao =
        JSON.parse(respostaRaw.response).mensagem || respostaRaw.response;
    } catch {
      traducao = respostaRaw.response;
    }

    return traducao.trim();
  } catch (err) {
    console.error("Erro ao traduzir ingrediente:", err);
    return ingrediente; // retorna original se falhar
  }
}


export class IaReceitaService {
  private mensagemModel: MensagemModel;
  private chatModel: ChatModel;
  private userModel: UserModel;

  constructor() {
    this.mensagemModel = new MensagemModel();
    this.chatModel = new ChatModel();
    this.userModel = new UserModel();
  }

  async enviarMensagem(
    userId: string,
    chatId: string | null,
    nome: string,
    texto: string,
    caminhoImagem?: string
  ) {
    let chatIdFinal: string;

    // Criação/verificação do chat
    if (!chatId) {
      const novoChat = await this.chatModel.createChat(
        userId,
        `Conversa de ${nome}`
      );
      chatIdFinal = novoChat._id.toString();
    } else {
      const chatExistente = await this.chatModel.findChatById(chatId);
      chatIdFinal = chatExistente
        ? chatId
        : (
            await this.chatModel.createChat(userId, `Conversa de ${nome}`)
          )._id.toString();
    }

    // Salva a mensagem do usuário ANTES de processar
    await this.mensagemModel.addMensagem({
      chatId: chatIdFinal,
      userId,
      role: "user",
      conteudo: texto,
      criadoEm: new Date(),
    } as any);

    // Se houver imagem, processa e salva como mensagem separada
    let ingredientesDetectados: string[] = [];
    if (caminhoImagem) {
      try {
        ingredientesDetectados = await detectarIngredientes(caminhoImagem);

        // Salva a mensagem da imagem como uma mensagem do sistema
        if (ingredientesDetectados.length > 0) {
          const ingredientesTraduzidos = await Promise.all(
            ingredientesDetectados.map(traduzirIngrediente)
          );

          const conteudoImagem = `Ingredientes detectados na imagem: ${ingredientesTraduzidos.join(
            ", "
          )}`;

          await this.mensagemModel.addMensagem({
            chatId: chatIdFinal,
            userId,
            role: "user",
            conteudo: conteudoImagem,
            criadoEm: new Date(),
          } as any);
        }

        // Validações para imagem
        if (ingredientesDetectados.length === 0) {
          return {
            chatId: chatIdFinal,
            resposta: {
              isReceita: false,
              mensagem:
                "Não foi possível identificar nenhum ingrediente na imagem. Por favor, tente enviar outra imagem ou descreva o que contém nela.",
            },
          };
        }

        if (ingredientesDetectados.length === 1) {
          const ingredienteTraduzido = await traduzirIngrediente(
            ingredientesDetectados[0]
          );
          return {
            chatId: chatIdFinal,
            resposta: {
              isReceita: false,
              mensagem: `Eu detectei apenas ${ingredienteTraduzido}. Você tem mais algum ingrediente disponível?`,
            },
          };
        }
      } catch (err) {
        console.error("Erro ao processar imagem:", err);
        return {
          chatId: chatIdFinal,
          resposta: {
            isReceita: false,
            mensagem:
              "Ocorreu um erro ao processar a imagem. Por favor, tente novamente.",
          },
        };
      }
    }

    // Busca histórico ATUALIZADO (incluindo a mensagem que acabou de ser salva)
    const mensagensAnteriores = await this.mensagemModel.getMensagensByChat(
      chatIdFinal
    );

    // Informações do usuário
    let userInfos = {};
    try {
      userInfos = await this.userModel.getUserInfo(userId);
    } catch (error) {
      userInfos = {};
    }

    const infoUsuario = Object.entries(userInfos)
      .map(([key, value]) => `${key.replace(/_/g, " ")}: ${value}`)
      .join("\n");

    // Monta o contexto na ordem CORRETA (mais antigo para mais recente)
    const contexto = mensagensAnteriores
      .map((m) => `${m.role === "user" ? nome : "IA"}: ${m.conteudo}`)
      .join("\n");

    // Monta o prompt
    const prompt = `
Você é uma IA especialista em saúde, alimentação e receitas.
Responda baseado no histórico completo da conversa, nas informações do usuário e ingredientes disponíveis.

INFORMAÇÕES DO USUÁRIO:
${infoUsuario || "(sem informações do usuário)"}

HISTÓRICO COMPLETO DA CONVERSA (em ordem cronológica):
${contexto || "(sem histórico ainda)"}

INGREDIENTES DETECTADOS NA IMAGEM:
${
  ingredientesDetectados.length > 0
    ? ingredientesDetectados.join(", ")
    : "Nenhum"
}

INSTRUÇÕES IMPORTANTES:
- Mantenha o contexto da conversa anterior
- Se o usuário mencionou ingredientes anteriormente, considere-os junto com qualquer novo ingrediente
- Não utilize ingredientes que o usuário seja alérgico ou intolerante
- Respeite todas as restrições alimentares
- Se precisar de mais informações, pergunte claramente

MENSAGEM ATUAL DE ${nome}: ${texto}

Se for para gerar uma receita, responda no formato JSON:
{
  "isReceita": true,
  "titulo": "Nome da Receita",
  "ingredientes": ["ingrediente 1", "ingrediente 2"],
  "modo_preparo": "Passo a passo do preparo"
}
Caso contrário:
{
  "isReceita": false,
  "mensagem": "sua resposta normal aqui"
}
Sempre responda no formato JSON válido, sem nada antes ou depois.
`;

    try {
      // Chama a IA
      const result = await apiIaReceita.post("/generate", {
        prompt,
        model: "llama3",
        stream: false,
        timeOut: 2000,
      });

      const respostaRaw = result.data;
      let resposta;

      try {
        resposta = JSON.parse(respostaRaw.response);
      } catch (err) {
        console.error(
          "❌ Erro ao parsear resposta da IA:",
          respostaRaw.response
        );
        resposta = {
          isReceita: false,
          mensagem:
            "Desculpe, não consegui entender a resposta. Podemos tentar novamente?",
        };
      }

      const conteudoIA = resposta.isReceita
        ? `Receita: ${resposta.titulo || "Sem título"} - ${
            resposta.ingredientes?.join(", ") || "Sem ingredientes"
          }`
        : resposta.mensagem || "Sem mensagem";

      // Salva a resposta da IA
      await this.mensagemModel.addMensagem({
        chatId: chatIdFinal,
        userId,
        role: "ia",
        conteudo: conteudoIA,
        isReceita: resposta.isReceita,
        titulo: resposta.titulo || "",
        ingredientes: resposta.ingredientes || [],
        modo_preparo: resposta.modo_preparo || "",
        criadoEm: new Date(),
      } as any);

      return { chatId: chatIdFinal, resposta };
    } catch (error) {
      console.error("Erro ao responder:", error);
      throw new Error("Erro ao responder o usuário");
    }
  }
}