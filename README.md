# 🛡️ Relatório de Análise de Segurança

**Projeto:** Receita.AI – 5º Semestre – DSM
**Disciplina:** Segurança no Desenvolvimento de Aplicações

---

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


