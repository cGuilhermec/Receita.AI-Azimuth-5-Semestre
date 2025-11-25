# 🍽️ Receita.AI  
### _Aplicativo móvel em React Native para identificar alimentos via foto e gerar receitas automaticamente_

---

## 📌 Sobre o Projeto
O **Receita.AI** é um aplicativo desenvolvido em **React Native** como projeto acadêmico do 5º semestre.  
O objetivo do aplicativo é permitir que o usuário **fotografe os alimentos presentes em sua geladeira**, e então o sistema utiliza técnicas de **reconhecimento de imagem** para identificar esses alimentos e sugerir **receitas inteligentes** com base neles.

O projeto foi desenvolvido em **3 Sprints**, seguindo metodologia ágil, e inclui desde captura de imagem, reconhecimento de itens, até a geração das receitas.

---

## 🎯 Objetivo do Aplicativo
- Reduzir o desperdício de alimentos.
- Mostrar receitas rápidas com base no que o usuário já possui.
- Facilitar o dia a dia de pessoas com o uso de IA e visão computacional.
- Criar uma experiência simples: **tire a foto → veja os alimentos → receba uma receita**.

---

## 🧩 Funcionalidades Desenvolvidas
- 📷 **Captura de Foto** usando a câmera do dispositivo.  
- 🔎 **Identificação de alimentos** por meio de processamento da imagem.  
- 🥕 **Lista editável de ingredientes detectados**.  
- 🍛 **Geração automática de receitas** utilizando os ingredientes disponíveis.  
- ⭐ **Favoritar e salvar receitas** (se implementado no seu projeto).  
- 🧭 **Navegação entre telas** limpa e organizada.  

---

## 🛠️ Tecnologias Utilizadas
- **React Native**
- Biblioteca de câmera: _preencher conforme o projeto real_  
- Navegação: _React Navigation_ (ou outra usada)  
- Processamento / reconhecimento de imagem: _API externa / modelo local_  
- Armazenamento: _AsyncStorage / SQLite_  
- Estilização: _Styled Components / StyleSheet / outra_

> Obs.: Se quiser, posso atualizar esta seção com as bibliotecas reais do projeto — basta enviar o ZIP ou a estrutura.

---

## 📅 Histórico de Sprints

### **Sprint 1 — 16/09/2025 → 02/10/2025**
**Entrega principal:** Base do app e sistema de câmera  
- Configuração inicial do ambiente React Native  
- Estrutura de pastas  
- Primeiras telas  
- Implementação da captura de fotos  
- Protótipo de navegação  
- Primeiras documentações

---

### **Sprint 2 — 13/10/2025 → 31/10/2025**
**Entrega principal:** Lógica de identificação dos alimentos  
- Conexão com o modelo de visão computacional  
- Retorno e exibição da lista de alimentos detectados  
- Tela de edição/ajuste dos ingredientes  
- Início da lógica de geração de receitas

---

### **Sprint 3 — 06/11/2025 → 24/11/2025**
**Entrega principal:** Tela final de receitas + melhorias gerais  
- Tela com modo de preparo, tempo, porções, etc.  
- Otimização das telas e UX  
- Correções de bugs  
- Salvamento de receitas (opcional)  
- Documentação final (este README)

---

## 📂 Estrutura do Projeto (exemplo)
> Assim que você enviar o ZIP, posso adaptar exatamente para o seu projeto.

```
src/
 ├─ screens/
 │   ├─ CameraScreen.js
 │   ├─ IngredientsScreen.js
 │   └─ RecipeScreen.js
 ├─ components/
 ├─ services/
 │   ├─ vision.js
 │   └─ recipeGenerator.js
 ├─ assets/
 └─ navigation/
```

---

## ▶️ Como Executar o Projeto

### **1. Instale as dependências**
```
npm install
```
ou
```
yarn
```

### **2. Execute o aplicativo**
Expo:
```
expo start
```

React Native CLI:
```
npx react-native run-android
npx react-native run-ios
```

---

## 📘 Como Usar
1. Abra o app  
2. Acesse a tela de câmera  
3. Fotografe os alimentos da geladeira  
4. Confirme/edite os ingredientes detectados  
5. Receba uma receita baseada nesses alimentos  
6. Opcional: Salve a receita  

---

## 👨‍💻 Equipe de Desenvolvimento
- **Gustavo Carvalho** – Desenvolvimento Mobile / Integração de IA  
- (adicionar os outros membros)

---

## 📄 Licença
Este projeto foi desenvolvido para fins educacionais.  
Você pode utilizá-lo como referência ou base para estudos.

---

## 📬 Contato
Se quiser que eu personalize ainda mais o README, gere uma versão com imagens ou adapte para o seu código real, basta me enviar o **ZIP do projeto**.  
