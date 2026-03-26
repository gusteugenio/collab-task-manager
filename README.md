<h1 align="center">📋 Collab Task Manager</h1>

<p align="center">
  <img src="https://github.com/user-attachments/assets/212d61f8-48d2-4b59-9dad-d69f96491967" alt="Collab Task Manager Preview" width="200" />
</p>

<p align="center">
  Uma aplicação fullstack moderna construída com <strong>Vue.js 3</strong> + <strong>Fastify</strong>, focada em gerenciamento de tarefas colaborativas, arquitetura serverless e observabilidade.<br />
  Permite criar, organizar e compartilhar tarefas com múltiplos usuários, acompanhando progresso em tempo real de forma simples e eficiente.<br />
  <a href="FRONTEND_URL" target="_blank">🚀 Acesse a versão online aqui</a>
</p>

TODO: Preencher URL 

---

## 🚀 Deploy

O projeto está disponível em produção com deploys separados para frontend e backend:

- Frontend hospedado no **Vercel**  
- Backend hospedado na **AWS (Lambda + API Gateway)**  

### 🔗 URLs

TODO: Preencher URLs

- Frontend: `FRONTEND_URL`
- API: `API_URL`

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
- **Frontend**: Vercel
- **Backend**: AWS Lambda + API Gateway (escalável automaticamente, sem servidor)
- **Database**: PostgreSQL em RDS
- **Observabilidade**: OpenTelemetry → Jaeger (Exclusivo para Ambiente Local)

Esta arquitetura garante que cada componente é independente e pode ser escalado conforme necessário.

---

## 💡 Decisões Técnicas

* **Fastify em vez de Express**: Optei pelo Fastify por sua alta performance e baixo overhead. Em ambientes serverless como AWS Lambda, respostas mais rápidas significam menor tempo de execução e, consequentemente, redução de custos. Além disso, o Fastify possui uma arquitetura mais organizada para plugins, facilitando a integração de ferramentas como monitoramento e logging.
* **Prisma ORM**: Utilizei o Prisma para garantir tipagem forte e consistência no acesso aos dados. Isso reduz erros comuns (como campos incorretos em queries) e torna o desenvolvimento mais seguro, produtivo e fácil de manter.
* **Organização em Camadas (Repository & Service)**: A separação entre regras de negócio (Service) e acesso a dados (Repository) melhora a organização do código e facilita a manutenção. Além disso, permite a criação de testes automatizados sem dependência direta do banco de dados.
* **Atualização Inteligente (Short Polling)**: Para otimizar a comunicação com o frontend, o sistema utiliza o campo `updatedAt` para buscar apenas os dados modificados desde a última requisição. Isso reduz o volume de dados trafegados e a carga no banco, mantendo uma experiência próxima de tempo real com menor custo.
* **Soft Delete**: As tarefas não são removidas fisicamente do banco ao serem deletadas. Em vez disso, são marcadas como excluídas. Isso garante consistência entre múltiplos usuários conectados, permitindo que o frontend sincronize corretamente a remoção dos dados.

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
- Implementação de um fluxo de sincronização incremental que simula o comportamento de streaming de dados, otimizando o consumo de recursos em ambiente Serverless.

---

## 📂 Estrutura do Projeto

O projeto está dividido em um monorepo simples:

- `api/`: Backend Fastify (Node.js)
  - `src/controllers/`: Manipulação de entradas/saídas HTTP.
  - `src/services/`: Toda a lógica de negócio e regras de colaboração.
  - `src/repositories/`: Abstração do banco de dados (Prisma).
  - `src/schemas/`: Validações de dados com Zod.
- `web/`: Frontend Vue.js 3
  - `src/components/`: Componentes UI reutilizáveis.
  - `src/stores/`: Gerenciamento de estado global com Pinia.
  - `src/views/`: Páginas principais da aplicação.

---

## 🗄️ Banco de Dados

A modelagem foi projetada para suportar um ambiente colaborativo, garantindo a rastreabilidade de quem criou cada tarefa e quem possui permissão para editá-la.

### Modelo de Dados (ERD)

<img width="600" height="1000" alt="collab-task-manager-tables" src="https://github.com/user-attachments/assets/a24c91ba-8900-4d6c-8480-a940774bad20" />

*Diagrama gerado via Mermaid representando as relações entre Usuários, Tarefas e Categorias.*

### Descrição das Entidades

* **User (`User`)**: Armazena as credenciais e o perfil do usuário. Possui uma relação de "Dono" com suas tarefas criadas e uma relação de "Colaborador" com as tarefas compartilhadas.
* **Task (`Task`)**: O núcleo da aplicação. Gerencia o ciclo de vida da atividade através de Enums de status (`TODO`, `DOING`, `DONE`) e timestamps automáticos de criação e conclusão.
* **Category (`Category`)**: Permite a rotulação das tarefas. É uma entidade independente e opcional, facilitando a organização sem engessar o fluxo de trabalho.
* **TaskCollaborator (`TaskCollaborator`)**: Tabela de junção (Pivot) que implementa a relação **Muitos-para-Muitos** entre usuários e tarefas, registrando exatamente quem foi convidado para colaborar em cada item.

### Regras de Negócio e Integridade

1.  **Propriedade Estrita**: Cada tarefa possui um `ownerId` obrigatório. Somente este usuário tem permissão para **deletar** ou **compartilhar** a tarefa com outros.
2.  **Colaboração Flexível**: Usuários registrados como colaboradores ganham permissão de **edição** sobre o status e conteúdo da tarefa, mas não sobre sua existência no banco.
3.  **Segurança de Deleção**: Foi implementada a estratégia `onDelete: SetNull` na relação de categorias. Isso garante que se uma categoria for excluída, as tarefas vinculadas a ela não sejam apagadas, apenas fiquem "sem categoria".
4.  **Performance**: Índices estratégicos foram aplicados nos campos de `email` (busca rápida no login) e `categoryId` (filtros eficientes no dashboard).
5.  **Sincronização Incremental**: O sistema usa o campo updatedAt para buscar apenas dados atualizados, reduzindo o tráfego e a carga no banco.
6.  **Testes unitários**: As principais funcionalidades são cobertas por testes para garantir a segurança e integridade da aplicação.
7.  **Soft Delete**: Ao deletar uma tarefa ela é mantida no banco de dados, mas com a marcação `deletedAt` para facilitar rastreabilidade.

---

## ⚙️ Como Rodar

### Pré-requisitos
- Node.js 20+
- npm
- Docker e Docker Compose

### Backend
```bash
cd api
npm install

# sobe Postgres + Jaeger
docker compose up -d

# aplica migrations no banco
npx prisma migrate deploy

# inicia API em modo desenvolvimento
npm run dev
```

API disponível em:

```text
http://localhost:3333
```

Swagger/OpenAPI:

```text
http://localhost:3333/documentation
```

### Frontend
```bash
cd web
npm install
npm run dev
```

Frontend disponível em:

```text
http://localhost:5173
```

---

## 🔐 Variáveis de Ambiente

### Backend
Arquivo: `api/.env`

```env
# Postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=tasks
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tasks?schema=public"

# JWT
JWT_SECRET="chave-secreta-do-collab-task-2026"

# URL do frontend para CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend
Arquivo: `web/.env`

```env
VITE_API_URL=http://localhost:3333
```

---

## 🐳 Docker

O ambiente Docker foi configurado para desenvolvimento local com PostgreSQL e Jaeger.

### Subir serviços

```bash
cd api
docker compose up -d
```

Serviços expostos:

- PostgreSQL: `localhost:5432`
- Jaeger UI: `http://localhost:16686`
- OpenTelemetry OTLP HTTP: `localhost:4318`

### Parar serviços

```bash
cd api
docker compose down
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

Para garantir que a arquitetura serverless não gere custos desnecessários com infraestrutura de monitoramento contínuo, o Jaeger e o Banco de Dados são executados localmente utilizando **Docker** durante o desenvolvimento. O deploy de produção foca exclusivamente na performance da API.

### Como acessar o Jaeger

```bash
cd api
docker compose up -d jaeger
```

Abra no navegador:

```text
http://localhost:16686
```

Se quiser subir Jaeger + Postgres juntos:

```bash
cd api
docker compose up -d
```

---

## 📊 Relatórios

Os relatórios incluem:
1. **Resumo de Tarefas**:
  - Total de tarefas criadas, concluídas e pendentes.
  - Percentual de conclusão (ex.: 75% das tarefas concluídas).

2. **Progresso por Categoria**:
  - Quantidade de tarefas por categoria (ex.: Trabalho, Pessoal).
  - Percentual de conclusão por categoria.

3. **Resumo por Período**:
  - Tarefas criadas e concluídas no período.

---

## 🧪 Testes

A aplicação utiliza **Jest** para testes unitários no backend.

### Estrutura atual

- Testes de controllers em `api/src/controllers/tests/*.spec.ts`
- Testes de services em `api/src/services/tests/*.spec.ts`
- Cobertura atual inclui autenticação, CRUD de tarefas/categorias, compartilhamento e relatórios

### Como executar

```bash
cd api
npm test
```

### Executar por camada

```bash
cd api
npm test -- src/controllers/tests
npm test -- src/services/tests
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
- [x] Filtros, busca e ordenação
- [x] Endpoints otimizados e leves para suportar requisições de Short Polling
- [x] Relatórios simples de progresso
- [x] Configurar OpenTelemetry + Jaeger
- [x] Swagger/OpenAPI documentação

### Testes
- [x] Testes unitários com Jest
- [x] Testes de integração de autenticação
- [x] Testes de CRUD (unitários)

### Frontend
- [x] Setup Vue 3 + Vite + TypeScript
- [x] Configurar ShadCN-Vue + Tailwind
- [x] Configura Axios
- [x] Pinia stores (auth, tasks, ui)
- [x] Configuração do Vue Router (Rotas e Guards de proteção)
- [x] Página de início
- [x] Páginas: Login, Registro
- [x] Páginas de Dashboard (Relatórios simples com gráficos de progresso)
- [x] Listagem e CRUD de categorias
- [x] Listagem e CRUD de tarefas
- [x] Compartilhamento de tarefas
- [x] Filtros e busca
- [x] Implementação de Short Polling (setInterval) inteligente para sincronização de tarefas, categorias e relatórios
- [x] Indicador de sincronização visual na interface
- [x] Feedback visual (loading, erros, sucesso)

### Deploy & DevOps
- [ ] Criar usuário IAM na AWS e configurar `aws-credentials` localmente
- [ ] Configurar o arquivo `serverless.yml` para integração com a AWS
- [ ] Configurar variáveis de ambiente de produção (Secrets)
- [ ] Provisionar banco de dados PostgreSQL (AWS RDS)
- [ ] Realizar o deploy da API via `serverless deploy`
- [ ] Configurar o deploy automático do Frontend na Vercel
- [ ] Validar a integração entre Frontend (Vercel) e Backend (AWS)
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
