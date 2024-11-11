# Desafio Desenvolvedor Backend Node.JS Teddy Open Finance

Este é um repositório para testar minhas habilidades como desenvolvedor backend enviado pela Teddy Open Finance, foi pedido um sistema completo que encurte URLs com banco de dados.

## Autor

Vinicius Pires Barreto

## Ambiente

Para montar o ambiente, siga estes passos:

1. Clone o repositório: `git clone https://github.com/ViniciusPiresB/teddy-challenge.git`

3. Navegue até a pasta do repositório

2. Instale as dependências: `npm install`

Obs: Certifique de utilizar versão do node compatível, se possível utilize as mesmas da sessão "Versão do Node.js e npm".

## Testes

Para rodar os testes, execute o seguinte comando:

```bash

npm  test

```

## Aplicação

## Rodando com Docker

Para rodar a aplicação com Docker, siga os passos abaixo:

1. Tenha o Docker instalado em sua máquina.

2. No terminal, navegue até a pasta do projeto.

3. No arquivo Dockerfile, verifique de colocar a variável JWT_SECRET na linha 8 conforme colocaria no arquivo .env
4. Crie um arquivo .env na raiz do projeto e copie a variável BASE_URL de `.env.example` e insira a base que você irá rodar localmente: Ex: `http://localhost:8000`

5. Construa a imagem do Docker: `docker-compose up --build`

6. Acesse a documentação da aplicação em `http://localhost:8000/doc`

## Rodando sem Docker

Para rodar a aplicação sem Docker, siga os passos abaixo:

1. Tenha o docker instalado e rodando.

2. Execute o seguinte comando no terminal para criar o banco Postgres

docker run --name my-postgres -e POSTGRES_PASSWORD=root -e POSTGRES_USER=postgres -e POSTGRES_DB=teddychallenge -p 5432:5432 -d postgres

3. Configure as variáveis de ambiente no arquivo `.env` baseado no arquivo `.env.example`

3.1 Crie um arquivo chamado `.env` na raiz do seu projeto, se ele ainda não existir.

3.2 Abra o arquivo `.env` com um editor de texto e adicione as seguintes linhas:

DATABASE_URL="postgresql://postgres:root@localhost:5432/teddychallenge?schema=public"

JWT_SECRET="sua_senha_secreta_para_gerar_tokens"

BASE_URL="<http://localhost:8000>"

4. Execute um build no projeto para subir o schema para o banco de dados, execute o seguinte comando na pasta raiz do projeto:

    `npm run build`

5. Inicie a aplicação: `npm start`

6. Acesse a aplicação em `http://localhost:8000`

## Documentação Swagger

Para visualizar a documentação Swagger, acesse `http://localhost:8000/doc`, a partir desta documentação, será possível utilizar a aplicação via swagger.

## Deploy criado da aplicação na AWS

Um deploy automatizado foi feito deste projeto no provedor AWS, o link exposto pode ser acessado em:
<http://52.73.47.139:8000/doc>
  

## Como Utilizar a aplicação

Para utilizar a aplicação, pode-se utilizar a rota `user` para criar o seu usuário, após isso, é possível fazer login na rota `auth` e obter o token de acesso para manipular links em seu usuário na rota padrão do projeto, conforme pode ser visível no swagger.

Também é possível criar links sem um usuário logado, basta acessar a rota padrão com o método `POST` e enviar no corpo da requisição a URL destino, essas informações podem ser vista na seção `Shortener` no Swagger.

## Funcionalidades extras interessantes

Foi implementado um sistema de cache nativo do [NestJS](https://docs.nestjs.com/techniques/caching#in-memory-cache) para não ser necessário realizar buscas no banco caso a URL solicitada esteja presente no cache.

## Pontos de melhoria caso seja necessário escalar horizontalmente

### Múltiplas instâncias de redirecionamento de URL utilizando um sistema de Mensageria (RabbitMQ, Kafka, etc)

  É interessante que, para escalar horizontalmente, em um cenário onde há diversas instâncias, que tenha um sistema de mensageria para gerenciar as requisições e repassar aos seus devidos workers, permitindo assim um sistema que pode escalar horizontalmente.

### Balanceador de carga

  Um balanceador de carga é bem vindo também, como AWS Elastic Load Balancing, que permite gerenciar, criar e derrubar as instâncias do serviço de forma automática.
  
### Kubernetes

O orquestrador de containeres também ajuda a gerir de forma automática a distribuição do tráfego entre as instâncias do serviço.

### Arquitetura baseada em microsserviços

A criação de uma arquitetura de microsserviços também facilita a escalar este tipo de serviço horizontalmente, pois permite que cada módulo seja replicado de forma independente, sem replicações desnecessárias que não requerem uma alta demanda.

## Versão do Node.js e npm

Este projeto foi desenvolvido e testado com o Node.js versão 20.18.0 e npm versão 10.8.1
