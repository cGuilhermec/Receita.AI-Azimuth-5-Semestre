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
- (adicionar os outros membros)# 🛡️ Relatório de Análise de Segurança

**Projeto:** Receita.AI – 5º Semestre – DSM
**Disciplina:** Segurança no Desenvolvimento de Aplicações

---
<br>
<br>
<br>
<br>
<br>

# Relatório de Segurança

## 🔒 1) SQL Injection

* A aplicação utiliza **MongoDB**, portanto não há uso de SQL.
* Foram verificados os endpoints que utilizam `findOne`, `find`, `update` e `delete` para garantir que não ocorram inserções maliciosas de comandos.

---

## 🔐 2) Cross-Site Scripting (XSS)

* O front-end utiliza **React**, que já oferece proteção padrão contra XSS.
* Foi verificado o uso de `dangerouslySetInnerHTML`.
* Foi validado se dados vindos da API não são exibidos sem sanitização.

---

## 🔁 3) Cross-Site Request Forgery (CSRF)

* O requisito **não foi implementado** na aplicação atual.
  ❗ *Observação: recomendado implementar em versões futuras.*

---

## 🔓 4) Broken Access Control

### Análise

* Verificados os endpoints protegidos com **authMiddleware**.
* Conferido o escopo de permissões: cada usuário consegue acessar e alterar **somente suas próprias receitas**.

---

## 🧩 5) Broken Authentication

### Análise

Foram verificados os seguintes itens:

* Política de senhas.
* Hash seguro utilizando **bcrypt** ou **argon2**.
* Expiração dos tokens.
* Cookies configurados com `HttpOnly`, `Secure` e `SameSite`.

---

## 🛡️ 6) Cryptographic Failures

### 6.1 Criptografia de dados em repouso

* Os dados enviados ao MongoDB são **criptografados antes do envio**.

### 6.2 Criptografia no nível da aplicação

* As senhas são **criptografadas antes de serem armazenadas no banco de dados**.

### 6.3 Chaves e certificados

* Nenhuma chave ou certificado foi incluído no repositório Git.
* Utilização segura da variável de ambiente **JWT_SECRET**.


