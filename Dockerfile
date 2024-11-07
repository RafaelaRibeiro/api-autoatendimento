# Etapa 1: Build da aplicação
FROM node:16 AS build
WORKDIR /app

# Copiar package.json e package-lock.json para instalar dependências
COPY package*.json ./
RUN npm install

# Copiar todo o código para o diretório de trabalho
COPY . .

# Gerar o cliente Prisma
RUN npx prisma generate

# Construir a aplicação
RUN npm run build

# Etapa 2: Configuração da imagem final para produção
FROM node:16 AS production
WORKDIR /app

# Definir NODE_ENV como production


# Copiar apenas as dependências de produção
COPY package*.json ./
RUN npm install --only=production

# Copiar a pasta de build da etapa anterior
COPY --from=build /app/dist ./dist

# Copiar a pasta .prisma e o schema para produção
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/prisma /app/prisma

# Definir o comando para rodar a aplicação
CMD ["npm", "run", "start:prod"]
