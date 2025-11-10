from ultralytics import YOLO
import yaml
import sys
import os

# Caminhos relativos à pasta do script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "best.pt")
DATA_YAML = os.path.join(BASE_DIR, "data.yaml")

# Carrega nomes do data.yaml
with open(DATA_YAML, "r", encoding="utf-8") as f:
    data = yaml.safe_load(f)
class_names = data.get("names", [])

# Carrega modelo YOLO
model = YOLO(MODEL_PATH)

# Recebe o caminho da imagem como argumento
if len(sys.argv) < 2:
    print("Nenhuma imagem fornecida")
    sys.exit(1)

image_path = sys.argv[1]
if not os.path.exists(image_path):
    print("Arquivo não encontrado")
    sys.exit(1)

# Faz predição
results = model.predict(source=image_path, verbose=False)
itens_detectados = []
for result in results:
    if result.boxes is not None:
        for cls_id in result.boxes.cls:
            cls_index = int(cls_id)
            if cls_index < len(class_names):
                itens_detectados.append(class_names[cls_index])

# Remove duplicatas e imprime
itens_detectados = list(set(itens_detectados))
print(",".join(itens_detectados))
