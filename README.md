# Pelada Draft API ⚽

Uma API desenvolvida em Node.js para gerenciamento de peladas e jogadores e escalação de times equilibrados, focada em código limpo e facilidade de manutenção.

Este projeto foi construído utilizando **Node.js** e o framework **NestJS**, focado na separação de responsabilidades, alta testabilidade e fácil manutenção.

## 🎯 Arquitetura e Decisões de Design

Este projeto foi desenhado com foco no longo prazo, priorizando princípios de engenharia de software que garantem um código testável, escalável e de fácil entendimento.

- **Clean Architecture & SOLID:** A base de código é estritamente separada em camadas (Domain, Application, Infraestructure). As regras de negócio (Entities e Use Cases) são totalmente isoladas de frameworks externos, garantindo que o núcleo da aplicação seja agnóstico.
- **Padrão Mapper:** Utilizado para a conversão segura de dados entre a camada de persistência (Prisma/Postgres) e as Entidades de Domínio, evitando o vazamento de detalhes do banco de dados para a regra de negócio.
- **NestJS:** Adotado como framework web por sua estrutura opinativa e modular, que se alinha naturalmente com injeção de dependências e arquiteturas sólidas.
- **Prisma ORM (v7+):** Escolhido para a comunicação com o banco de dados. O projeto já utiliza a nova arquitetura do Prisma 7 (`prisma.config.ts`), isolando as configurações de deploy e conexão das definições de modelagem (`schema.prisma`).
- **Docker Multi-stage Builds:** O processo de CI/CD e conteinerização foi otimizado utilizando estágios (Builder e Production). Isso reduz drasticamente o tamanho da imagem final na VPS, contendo apenas o código compilado e as dependências de produção.

O projeto foi desenhado utilizando princípios de **Clean Architecture (Arquitetura Limpa)** e **Domain-Driven Design (DDD)**. A base de código é dividida principalmente em duas grandes camadas:

- **`src/core/`**: O coração da aplicação. Totalmente isolado de frameworks e dependências externas.
  - **`domain/`**: Entidades da aplicação e erros de domínio (ex: erros de autenticação e validações de regras de negócio).
  - **`application/`**: Casos de uso da aplicação (ex: `DrawTeams`), portas e interfaces.
- **`src/infra/`**: Detalhes de implementação e comunicação externa.
  - **`http/`**: Controladores do NestJS (`Controllers`), DTOs, Guards de autenticação (`AuthGuard`, `PeladaAccessGuard`) e documentação Swagger.
  - **`database/`**: Implementação de repositórios, comunicação com o banco de dados e ORMs.

## 🛠️ Tecnologias Utilizadas

- **Ecossistema:** Node.js, NestJS, Typescript
- **Banco de Dados:** PostgreSQL, Prisma ORM
- **Infraestrutura:** Docker, Docker Compose
- **Padronização:** ESLint, Prettier
- Autenticação via Cookies (JWT)
- Swagger (OpenAPI) para documentação

## 📋 Pré-requisitos

Antes de iniciar, você precisará ter as seguintes ferramentas instaladas na sua máquina:

- **[Node.js](https://nodejs.org/pt-br/download/)** (Versão 22 ou superior recomendada)
- **[Docker](https://docs.docker.com/get-docker/)** e **[Docker Compose](https://docs.docker.com/compose/install/)** (Para rodar a infraestrutura e o banco de dados)
- **Git** (Para clonar o repositório)

## 🚀 Como testar e rodar o projeto

Clone o repositório:

```bash
git clone https://github.com/afmdaniel/pelada-draft-backend.git
```

Você pode executar o projeto de duas maneiras diferentes, dependendo do seu ambiente e necessidade. Antes de começar, renomeie o arquivo `.env.example` para `.env` na raiz do projeto.

### Opção 1: O Fluxo de Desenvolvimento (API Local + DB no Docker)

_Recomendado para o dia a dia, pois mantém o hot-reload da API ativo._

1. No arquivo `.env`, certifique-se de que o host da URL do banco seja `localhost`:
   `DATABASE_URL="postgresql://user:password@localhost:5432/peladas_db?schema=public"`
2. Suba apenas o contêiner do banco de dados em background:

   ```bash
   docker-compose up -d db
   ```

3. Instale as dependências locais:
   ```bash
   npm ci
   ```
4. Rode as migrações para criar as tabelas no banco de dados, gere o client e popule o banco com o usuário ADMIN:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   npx prisma db seed
   ```
5. Inicie a API:

   ```bash
   npm run start:dev
   ```

6. Acesse a documentação da API:
   Com o servidor rodando, acesse a documentação do Swagger disponível em `http://localhost:3000/api-docs`.

### Opção 2: O Fluxo de Produção (Tudo via Docker)

1. No arquivo .env, o host da URL do banco deve ser obrigatoriamente o nome do serviço do docker (db):

   `DATABASE_URL="postgresql://user:password@db:5432/peladas_db?schema=public"`

2. Construa as imagens e suba a infraestrutura completa:

   ```Bash
   docker-compose up --build
   ```

   (O banco de dados subirá automaticamente, as migrações serão aplicadas no estágio de deploy e a API ficará online na porta 3000).

3. Com os contêiners rodando, execture o seed dentro do contêiner da API para criar o usuário ADMIN:

   ```bash
   docker exec -it peladas_api node dist/src/infra/database/prisma/seed.js
   ```

4. Acesse a documentação da API:
   Com o servidor rodando, acesse a documentação do Swagger disponível em `http://localhost:3000/api-docs`.

5. A API estará rodando isolada no contêiner e acessível na porta configurada. Para parar a execução e remover os contêineres, basta rodar:

   ```bash
   docker-compose down
   ```

## 🗄️ Visualizando os Dados

Com o banco de dados rodando (seja via Docker ou Local) e a URL do `.env` apontando para localhost, você pode abrir a interface gráfica do Prisma para gerenciar as tabelas diretamente pelo navegador:

```bash
npx prisma studio
```

## 🔑 Autenticação e Permissões

A API utiliza autenticação baseada em tokens JWT armazenados de forma segura via _Cookies_ (`access_token` e `refresh_token`). As rotas são protegidas por Guards do NestJS, validando não apenas se o usuário está logado, mas também se ele possui os privilégios corretos na _pelada_ específica (através do `PeladaAccessGuard`).

## 🤝 Contribuindo

1. Faça um _fork_ do projeto
2. Crie uma branch para a sua feature (`git checkout -b feature/MinhaFeature`)
3. Faça commit de suas alterações (`git commit -m 'feat: Minha nova feature'`)
4. Faça push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um _Pull Request_

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
