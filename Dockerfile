FROM node:20.13-alpine3.19

WORKDIR /app

ARG DATABASE_URL="postgresql://username:password@postgres:5432/database"
ENV DATABASE_URL=$DATABASE_URL

# Não expor link de banco/Secret keys
ARG JWT_SECRET="Secret_of_your_project"
ENV JWT_SECRET=$JWT_SECRET

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["ash", "-c", "npm run prisma:deploy && npm run build && node dist/main.js"]
