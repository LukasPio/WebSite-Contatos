# WebSite-Contatos

Aplicação web de contatos com **React + Vite**, autenticação **JWT** e comunicação com uma API REST existente. Implementação da atividade *Projeto: Contatos com Autenticação (React + JWT)*.

## Funcionalidades

- Cadastro de usuário: `POST /usuarios/registrar`.
- Login com e-mail e senha: `POST /usuarios/login`.
- Armazenamento do JWT no `localStorage` e gerenciamento global via Context API.
- Rota `/contatos` protegida com `PrivateRoute`.
- JWT adicionado automaticamente ao cabeçalho `Authorization: Bearer <token>` nas requisições Axios.
- Listagem dos contatos do usuário: `GET /contatos`.
- Cadastro de contato: `POST /contatos`.
- Logout que apaga o token, atualiza a interface e volta ao login.
- Estados de carregamento, validação básica e mensagens de erro.

## Executar localmente

Requisitos: Node.js 20.19+ (recomendado Node 22) e npm.

```bash
git clone https://github.com/LukasPio/WebSite-Contatos.git
cd WebSite-Contatos
npm install
npm run dev
```

Acesse o endereço mostrado pelo Vite (geralmente `http://localhost:5173`).

Por padrão, a aplicação utiliza a API da atividade:

```text
https://api-contatos-auth-04-09-25.onrender.com
```

Para alterar o endereço, copie `.env.example` para `.env.local` e edite `VITE_API_URL`. Reinicie o servidor após mudar variáveis de ambiente.

## Testes e build

```bash
npm test
npm run build
npm run preview
```

Os testes unitários e de integração de componentes usam Vitest e React Testing Library sem depender da API real. O workflow GitHub Actions executa testes e build em pushes e pull requests.

## Estrutura principal

```text
src/
  api/api.js             # Axios, baseURL e interceptor JWT
  api/errors.js          # Mensagens de erro de rede/servidor
  components/Navbar.jsx  # Navegação e logout
  components/PrivateRoute.jsx
  context/AuthContext.jsx
  pages/Login.jsx
  pages/Registrar.jsx
  pages/Contatos.jsx
  App.jsx                 # Rotas públicas e privadas
  main.jsx                # Entrada React
  styles.css              # Estilos responsivos
```

## Fluxo da atividade

1. Acesse **Criar conta** e informe nome, e-mail e senha.
2. Após o cadastro, faça login.
3. A API devolve um JWT; o React o salva no contexto e no `localStorage`.
4. A rota privada permite entrar na agenda; Axios inclui o JWT no header.
5. Cadastre um contato e observe a atualização da lista.
6. Clique em **Sair**; o token é apagado e a rota privada volta a exigir login.

**Observações:** a aplicação depende da disponibilidade da API remota e de sua configuração de CORS. Para esta atividade didática foi mantido o JWT no `localStorage`, conforme o enunciado. Em produção, considere os riscos de XSS ao armazenar tokens acessíveis por JavaScript e avalie cookies `HttpOnly` com proteção CSRF conforme a arquitetura. A checagem de rota no React é apenas uma proteção de navegação: **a API deve validar o JWT e autorizar cada operação de contato**.
