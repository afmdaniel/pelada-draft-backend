# ESTÁGIO 1: Compilação (Builder)
FROM node:22-alpine AS builder

# Define a pasta de trabalho dentro do contentor
WORKDIR /app

# Copia os ficheiros de dependências
COPY package*.json ./

# Instala TODAS as dependências (incluindo as de desenvolvimento)
RUN npm ci

# Copia o resto do código
COPY . .

# Gera o cliente do Prisma e compila o código TypeScript para JavaScript (pasta dist)
RUN npx prisma generate
RUN npm run build

# ---------------------------------------------------

# ESTÁGIO 2: Produção
FROM node:22-alpine

WORKDIR /app

# Copia apenas as dependências de produção para manter a imagem leve
COPY package*.json ./
COPY prisma.config.ts ./
COPY src/infra/database/prisma ./src/infra/database/prisma

RUN npm ci --only=production

# Copia o código compilado e os ficheiros do Prisma do Estágio 1
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/infra/database/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

# Expõe a porta que a aplicação vai utilizar
EXPOSE 3000

# Comando para correr as migrações do banco e iniciar a aplicação
# Isto garante que o banco de dados tem as tabelas criadas antes de a API arrancar
CMD [ "sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && npm run start:prod" ]