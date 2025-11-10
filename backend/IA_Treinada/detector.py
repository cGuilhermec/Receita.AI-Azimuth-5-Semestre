from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import yaml
import shutil
import os

# Caminhos do modelo
MODEL_PATH = "best.pt"
DATA_YAML = "data.yaml"
UPLOAD_FOLDER = "uploads"

# Cria pasta de uploads se não existir
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Carrega nomes do data.yaml
with open(DATA_YAML, "r", encoding="utf-8") as f:
    data = yaml.safe_load(f)
class_names = data.get("names", [])

# Carrega modelo YOLO
model = YOLO(MODEL_PATH)

# Cria app FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect")
async def detect_ingredients(
    texto: str = Form(...),
    image: UploadFile | None = None
):
    itens_detectados = []

    if image:
        caminho_imagem = os.path.join(UPLOAD_FOLDER, image.filename)
        with open(caminho_imagem, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        # Faz predição
        results = model.predict(source=caminho_imagem, verbose=False)
        for result in results:
            if result.boxes is not None:
                for cls_id in result.boxes.cls:
                    cls_index = int(cls_id)
                    if cls_index < len(class_names):
                        itens_detectados.append(class_names[cls_index])

        # Remove duplicatas
        itens_detectados = list(set(itens_detectados))

    return {
        "texto_usuario": texto,
        "itens_detectados": itens_detectados  # apenas nomes, sem quantidades
    }
