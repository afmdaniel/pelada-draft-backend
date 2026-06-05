# Pelada Draft API ⚽

Uma API para sorteio de times equilibrados em peladas de futebol.

Este projeto foi construído utilizando **Node.js** e o framework **NestJS**, focado na separação de responsabilidades, alta testabilidade e fácil manutenção.

## 🏗️ Arquitetura

O projeto foi desenhado utilizando princípios de **Clean Architecture (Arquitetura Limpa)** e **Domain-Driven Design (DDD)**. A base de código é dividida principalmente em duas grandes camadas:

- **`src/core/`**: O coração da aplicação. Totalmente isolado de frameworks e dependências externas.
  - **`domain/`**: Entidades da aplicação e erros de domínio (ex: erros de autenticação e validações de regras de negócio).
  - **`application/`**: Casos de uso da aplicação (ex: `DrawTeams`), portas e interfaces.
- **`src/infra/`**: Detalhes de implementação e comunicação externa.
  - **`http/`**: Controladores do NestJS (`Controllers`), DTOs, Guards de autenticação (`AuthGuard`, `PeladaAccessGuard`) e documentação Swagger.
  - **`database/`**: Implementação de repositórios, comunicação com o banco de dados e ORMs.

## 🚀 Tecnologias

- NestJS
- TypeScript
- Prisma
- Autenticação via Cookies (JWT)
- Swagger (OpenAPI) para documentação

## 📋 Pré-requisitos

Antes de começar, você vai precisar ter as seguintes ferramentas instaladas em sua máquina:

- Node.js (Versão 22+ recomendada)
- npm, yarn ou pnpm

## 🛠️ Como rodar em Desenvolvimento

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/pelada-draft.git
```

2. Acesse a pasta do projeto:

```bash
cd pelada-draft
```

3. Instale as dependências:

```bash
npm install
```

4. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto baseado no `.env.example` (se houver) e preencha as configurações necessárias (Credenciais de Banco de Dados, Secrets de JWT, etc).

5. Inicie o banco de dados:
   Caso não tenha um PostgreSQL instalado na sua máquina, você pode utilizar o Docker para subir apenas o serviço do banco de dados em background:

```bash
docker-compose up db -d
```

6. Inicie o servidor de desenvolvimento:

```bash
npm run start:dev
```

6. Acesse a documentação da API:
   Com o servidor rodando, acesse a documentação do Swagger disponível em `http://localhost:3000/api-docs`.

## 📦 Como rodar em Produção

Para ambientes de produção, o código deve ser compilado (transpilado de TypeScript para JavaScript) antes de ser executado para garantir a melhor performance.

1. Compile o projeto:

```bash
npm run build
```

2. Inicie a aplicação compilada:

```bash
npm run start:prod
```

_Nota: Em ambientes reais de produção, considere utilizar gerenciadores de processos como o `PM2` ou o próprio `Docker` para garantir que a aplicação se mantenha online._

## 🐳 Como rodar com Docker

Se preferir, você pode executar toda a aplicação (e seus serviços dependentes, como o banco de dados) de forma simplificada utilizando contêineres.

1. Certifique-se de ter o **Docker** e o **Docker Compose** instalados na sua máquina.
2. Configure o seu arquivo `.env` com as variáveis necessárias com base no `.env.example`.
3. Execute o comando abaixo na raiz do projeto para construir e subir os contêineres em background:

```bash
docker-compose up -d --build
```

4. A API estará rodando isolada no contêiner e acessível na porta configurada. Para parar a execução e remover os contêineres, basta rodar:

```bash
docker-compose down
```

## � Autenticação e Permissões

A API utiliza autenticação baseada em tokens JWT armazenados de forma segura via _Cookies_ (`access_token` e `refresh_token`). As rotas são protegidas por Guards do NestJS, validando não apenas se o usuário está logado, mas também se ele possui os privilégios corretos na _pelada_ específica (através do `PeladaAccessGuard`).

## 🤝 Contribuindo

1. Faça um _fork_ do projeto
2. Crie uma branch para a sua feature (`git checkout -b feature/MinhaFeature`)
3. Faça commit de suas alterações (`git commit -m 'feat: Minha nova feature'`)
4. Faça push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um _Pull Request_

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
