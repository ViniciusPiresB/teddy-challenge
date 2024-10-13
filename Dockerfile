FROM node:20.13-alpine3.19

WORKDIR /app

# Alterado para PostgreSQL
ARG DATABASE_URL="postgresql://username:password@postgres:5432/database"
ENV DATABASE_URL=$DATABASE_URL

# Não expor link de banco/Secret keys
ARG JWT_SECRET="Secret_of_your_project"
ENV JWT_SECRET=$JWT_SECRET

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

# Comando para rodar o Prisma migration e iniciar a aplicação
CMD ["ash", "-c", "npm run prisma:deploy && npm run build && node dist/main.js"]
