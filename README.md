# 📋 Collab Task Manager

<p align="center">
  <img src="https://github.com/user-attachments/assets/212d61f8-48d2-4b59-9dad-d69f96491967" width="200" alt="gif-checklist" />
</p>

Aplicação fullstack moderna de gerenciamento de tarefas colaborativas, desenvolvida para demonstrar arquitetura serverless, observabilidade e boas práticas de desenvolvimento.

O sistema permite que usuários criem, organizem e compartilhem tarefas, acompanhando o progresso de forma simples, visual e eficiente.

---

## 🚀 Demo

TODO: adicionar URL do frontend e da API

---

## 🛠️ Tecnologias Utilizadas

### Frontend (Interface do usuário)
- ![Vue.js 3](https://img.shields.io/badge/Vue.js_3-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white) **Vue.js 3**
- ![ShadCN Vue](https://img.shields.io/badge/ShadCN--Vue-000000?style=for-the-badge) **ShadCN Vue**
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) **Tailwind CSS**
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) **TypeScript**
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) **Vite**
- ![Axios](https://img.shields.io/badge/Axios-671DDF?style=for-the-badge&logo=axios&logoColor=white) **Axios**
- ![Pinia](https://img.shields.io/badge/Pinia-FCD34D?style=for-the-badge) **Pinia**

### Backend (Servidor)
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) **Node.js**
- ![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white) **Fastify**
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) **TypeScript**
- ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) **Prisma**
- ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white) **JWT**
- ![bcrypt](https://img.shields.io/badge/bcrypt-003366?style=for-the-badge) **bcrypt**
- ![Zod](https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logo=zod&logoColor=white) **Zod**
- ![ESLint](https://img.shields.io/badge/ESLint-4B3B8C?style=for-the-badge&logo=eslint&logoColor=white) **ESLint**
- ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black) **Prettier**

### Banco de Dados
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white) **PostgreSQL**

### Testes
- ![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white) **Jest**

### Monitoramento
- ![OpenTelemetry](https://img.shields.io/badge/OpenTelemetry-000000?style=for-the-badge) **OpenTelemetry**
- ![Jaeger](https://img.shields.io/badge/Jaeger-00B4E0?style=for-the-badge&logo=jaeger&logoColor=white) **Jaeger**
- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) **Docker**

### Deploy & Infraestrutura
- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) **Docker**
- ![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=aws-lambda&logoColor=white) **AWS Lambda**
- ![AWS API Gateway](https://img.shields.io/badge/AWS_API_Gateway-FF9900?style=for-the-badge) **AWS API Gateway**
- ![AWS RDS](https://img.shields.io/badge/AWS_RDS-FF9900?style=for-the-badge) **AWS RDS**
- ![Serverless](https://img.shields.io/badge/Serverless-FD5750?style=for-the-badge&logo=serverless&logoColor=white) **Serverless Framework**

---

## 🧠 Arquitetura

A aplicação segue uma **arquitetura distribuída com padrão em camadas**:

### Backend (Camadas)
- **Controllers** → recebem requisições HTTP
- **Services** → lógica de negócio e regras
- **Repositories** → acesso aos dados (Prisma)
- **Middleware** → autenticação, validação, observabilidade

### Distribuição (Serverless)
- **Frontend**: AWS S3 (hospedagem estática)
- **Backend**: AWS Lambda + API Gateway (escalável automaticamente, sem servidor)
- **Database**: PostgreSQL em RDS
- **Observabilidade**: OpenTelemetry → Jaeger (Exclusivo para Ambiente Local)

Esta arquitetura garante que cada componente é independente e pode ser escalado conforme necessário.

---

## ✨ Funcionalidades

### Core
- Cadastro e login de usuários (JWT)
- CRUD completo de tarefas
- Organização por categorias
- Compartilhamento de tarefas entre colaboradores
- Controle de status (TODO, DOING, DONE)
- Filtros e busca de tarefas
- Relatórios simples de progresso e produtividade

### Extras (Diferenciais)
- **Colaboração Reativa** com atualizações simulando tempo real via Short Polling (arquitetura otimizada para Serverless)
- Documentação de endpoints com Swagger/OpenAPI
- Observabilidade distribuída com OpenTelemetry + Jaeger no desenvolvimento

---

## 🗄️ Banco de Dados

TODO: descrever modelagem

---

## ⚙️ Como Rodar

### Backend
```
TODO
```

### Frontend
```
TODO
```

---

## 🔐 Variáveis de Ambiente

### Backend
```
TODO
```

### Frontend
```
TODO
```

---

## 🐳 Docker

```
TODO
```

---

## 📡 API

A documentação dos endpoints da API foi gerada utilizando o padrão **Swagger/OpenAPI**. Para acessar a documentação, inicie o backend e acesse o seguinte endpoint:

```
GET /documentation
```

A documentação inclui:
- Descrição detalhada de cada endpoint.
- Parâmetros de entrada e saída.
- Exemplos de requisições e respostas.

---

## 🔐 Autenticação

A aplicação utiliza autenticação baseada em **JWT (JSON Web Token)**.

Fluxo de autenticação:

1. O usuário realiza login informando email e senha  
2. O backend valida as credenciais  
3. Um token JWT é gerado e retornado ao cliente  
4. O cliente deve enviar esse token em todas as requisições protegidas  

Formato do header:

```http
Authorization: Bearer <seu_token_jwt>
```

---

## 📊 Observabilidade

A aplicação utiliza **OpenTelemetry** para instrumentação e rastreamento de requisições, com visualização através do **Jaeger**.

Com isso, é possível acompanhar todo o fluxo de execução da aplicação, incluindo:

- Tempo total de cada requisição  
- Tempo gasto em cada camada (controller, service, banco de dados)  
- Identificação de gargalos de performance  
- Rastreamento de erros ao longo da execução  

Para garantir que a arquitetura serverless não gere custos desnecessários com infraestrutura de monitoramento contínuo, o Jaeger e o Banco de Dados são executados localmente utilizando **Docker** e `docker-compose` durante o desenvolvimento. O deploy de produção foca exclusivamente na performance da API.

---

## 📊 Relatórios

Os relatórios incluem:
1. **Resumo de Tarefas**:
  - Total de tarefas criadas, concluídas e pendentes.
  - Percentual de conclusão (ex.: 75% das tarefas concluídas).

2. **Progresso por Categoria**:
  - Quantidade de tarefas por categoria (ex.: Trabalho, Pessoal).
  - Percentual de conclusão por categoria.

3. **Colaboração**:
  - Número de tarefas compartilhadas.
  - Usuários mais ativos (baseado em tarefas criadas ou atualizadas).

5. **Resumo Diário/Semanal**:
  - Tarefas criadas e concluídas no período.

---

## 🧪 Testes

A aplicação utiliza **Jest** para testes unitários e de integração.

```
TODO: Adicionar testes de autenticação, CRUD, validações
```

---

## ☁️ Deploy

A aplicação é deployada com o **Serverless Framework** em AWS Lambda.

```bash
serverless deploy --stage prod
```

**Configuração**:
- **Backend**: AWS Lambda + API Gateway.
- **Banco de Dados**: PostgreSQL em AWS RDS (db.t3.micro).
- **Frontend**: Hospedado na Vercel.

Todo o deploy está configurado para funcionar diretamente com as ferramentas e serviços descritos.

---

## ✅ Checklist de Desenvolvimento

### Backend & Banco de Dados
- [x] Docker e Docker Compose (configurar apenas banco Postgres e Jaeger para ambiente local)
- [x] Configurar Fastify com TypeScript
- [x] Configurar Prisma e PostgreSQL
- [x] Definir e criar modelagem do banco (User, Task, Category)
- [x] Criar autenticação JWT com bcrypt
- [x] Endpoint para Listagem de usuários (para colaboração)
- [x] CRUD completo de tarefas
- [x] Compartilhamento e colaboração de tarefas
- [x] Crud de categorias
- [ ] Filtros, busca e ordenação
- [ ] Endpoints otimizados e leves para suportar requisições de Short Polling
- [ ] Relatórios simples de progresso
- [ ] Configurar OpenTelemetry + Jaeger
- [ ] Testes com Jest (autenticação, CRUD, validações)
- [ ] Swagger/OpenAPI documentação

### Frontend
- [ ] Setup Vue 3 + Vite + TypeScript
- [ ] Configurar ShadCN-Vue + Tailwind
- [ ] Pinia stores (auth, tasks, ui)
- [ ] Páginas: Login, Registro, Dashboard
- [ ] Listagem e CRUD de tarefas
- [ ] Compartilhamento de tarefas
- [ ] Filtros e busca
- [ ] Implementação de Short Polling (setInterval) inteligente para sincronização de tarefas
- [ ] Indicador de sincronização visual na interface
- [ ] Relatórios simples (gráficos de progresso)
- [ ] Feedback visual (loading, erros, sucesso)
- [ ] Responsiveness e accessibilidade

### Testes
- [ ] Testes unitários com Jest
- [ ] Testes de integração de autenticação
- [ ] Testes de CRUD
- [ ] Cobertura mínima de 80%

### Deploy & DevOps
- [ ] Configurar Serverless Framework com AWS credentials
- [ ] Variáveis de ambiente para prod
- [ ] AWS Lambda + API Gateway
- [ ] AWS RDS PostgreSQL
- [ ] Deploy em produção com `serverless deploy`
- [ ] Testar endpoints do API Gateway
---

## 📬 Contato

<div align="center">
  <p>Desenvolvido com 💙 por <strong>Gustavo Eugênio</strong></p>
  <a href="mailto:gustavoeugenio297@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
  <a href="https://www.linkedin.com/in/gusteugenio/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
</div>
