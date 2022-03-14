# Criando o backend

## Criando o servidor

- No terminal dentro do diretorio backend executar:

```bash
yarn init -y
````
- Instalar as dependencias: 

```bash
yarn add express
yarn add -D @types/express typescript ts-node-dev
```
- Inciar o arquivo de configuração do typescript, no terminal: 

```bash
yarn tsc --init
```

No arquivo tsconfig, remover todos os comentarios e alterar a linha `strict: true` para `false`, ficando assim: 

```json
{
  "compilerOptions": {

    "target": "es2016",                                  
    "module": "commonjs",                               
    "esModuleInterop": true,                           
    "forceConsistentCasingInFileNames": true,           
    "strict": false,
    "skipLibCheck": true                           
  }
}
```
- Criar o diretorio src e dentro dele criar o arquivo `app.ts`. No arquivo iniciar o express a porta onde sera lida.

```ts
import express from 'express'

const app = express()

app.listen(4000, () => console.log("Hello"))
```
- No arquivo package.json criar o scrip para rodar o ts-node-dev:

```json
    "scrits": {
        "dev": "ts-node-dev src/server.ts"
    },
```

Agora sempre que precisar iniciar o servidor do backend, rodar no terminal `yarn dev` .

## Instalando o ORM Prisma

No terminal: 

```bash
yarn add prisma -D
yarn prisma init
```
## Adicionando o github OAuth no projeto

### Configurando o github OAuth

- Criar um novo app dentro do OAuth e inserir as informaçãoes necessarias como url da aplicação e a url de callback

- Após criar o app salvar as duas credencias no arquivo `.env` das váriaveis .

```
GITHUB_CLIENT_SECRET=sua_senha_secret
GITHUB_CLIENT_ID=sua_senha_id
```
### Autenticação

### Criando a rota de autenticação 

- No arquivo app.ts inserir o script de criação de rota com o request e response 

```ts
import "dotenv/config"
import express from 'express'

const app = express()

app.get("/github", (request, response) => {
    response.redirect(`http://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`)
})


app.listen(4000, () => console.log("Hello"))
```

- Para poder utilizar variaveis do arquivo .env, instalar a biblioteca dotenv

```bash
yarn add dotenv
```

### Rota de callback

- Criar a rota de callback que é onde o usuario sera redirecionado apos a autrização do aplicativo .

- Logo após a rota get d autenticação do github, inserir a rota de callback

```ts
app.get("/signin/callback", (request, response) => {
    const { code } = request.query;

```
### Criando o service de autenticação

- No diretório `src` criar o diretorio `services` e dentro dele criar o arquivo `AuthenticateUserService.ts`

Insrir o script de criação do service 

```ts
import axios from "axios"

interface IAccessTokenResponse {
    access_token: string;
}

interface IUserResponse {
    avatar_url: string,
    login: string,
    id: number,
    name: string
}

class AuthenticateUserService {
    async execute(code: string) {
        const url = "https://github.com/login/oauth/access_token"

        const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers: {
                Accept: "application/json",
            },

        })

        const response = await axios.get<IUserResponse>("https://api.github.com/user", {
            headers: {
                authorization: `bearer ${accessTokenResponse.access_token}`,
            },
        })

        return response.data 

    }
}

export { AuthenticateUserService }
```

### Criando o controller de autenticação

- No diretório `src` criar o diretorio `controllers` e dentro dele criar o arquivo `AuthenticateUserController.ts`

```ts
import { Request, Response } from "express"
import { AuthenticateUserService } from "../services/AuthenticateUserService"

class AuthenticateUserController {
    async handle(request: Request, response: Response) {
        const { code } = request.body
        
        const service = new AuthenticateUserService()

        const result = await service.execute(code)

        return response.json(result)
    }

}

export { AuthenticateUserController }
```

### Arquivo proprio das rotas 

- No diretorio `src` criar o arquivo `routes.ts` e colocar as rotas dos controllers dentro dele .

```ts
import { Router } from "express"
import { AuthenticateUserController } from "./controllers/AuthenticateUserController"


const router = Router()

router.post("/authenticate", new AuthenticateUserController().handle)

export { router }
```

- Importar esse arquivo de rotas dentro do `app.ts` .

### Criando o token de autenticação

- No terminal instalar a biblioteca de criação de token em json

```bash
yarn add jsonwebtoken
yarn add @types/jsonwebtoken -D
```

## Usuário no banco de dados

- No arquivo schema.prisma dentro do diretorio prisma, inseir o codigo de criação da primeira tabela

```prisma
model User {
  id           String @id @default(uuid())
  name         String
  github_id    Int
  avatar_url   String
  login        String

  @@map("users")
}
```

- No terminal rodar o comando para criação da migration dessa tabela, dando o nome de `create-user`

```bash
yarn prisma migrate dev
```
### Configurando o prisma client

- Dentro do diretorio src criar o diretorio `prisma` e dentro dele o arquivo index.ts

```ts
import { PrismaClient } from "@prisma/client"

const pcl = new PrismaClient()

export default pcl
```
### Modificando o service de usuario 

- Importar o prisma client no arquivo AuthenticateUserService

- Fazer a verificação de usuario no banco de dados

- Criar o token de autenticação na aplicação

```ts
import axios from "axios"
import pcl from "../prisma"
import { sign } from "jsonwebtoken"

interface IAccessTokenResponse {
    access_token: string;
}

interface IUserResponse {
    avatar_url: string,
    login: string,
    id: number,
    name: string
}

class AuthenticateUserService {
    async execute(code: string) {
        const url = "https://github.com/login/oauth/access_token"

        const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers: {
                Accept: "application/json",
            },

        })

        const response = await axios.get<IUserResponse>("https://api.github.com/user", {
            headers: {
                authorization: `bearer ${accessTokenResponse.access_token}`,
            },
        })

        // desestruturando de dentro do response.date apenas as informaçoes de login, id, avatar e name
        const { login, id, avatar_url, name } = response.data

        // verificando se existe esse github_id dentro do banco de dados(id) e salvando isso em uma variavel
        let user = await pcl.user.findFirst({ 
            where: { 
                github_id: id
            }
        })

        // Caso nao exista esse user, cria esse usee no banco de dados junto com todas as outras infos
        if (!user) {
            user = await pcl.user.create({
                data: {
                    github_id: id,
                    login,
                    avatar_url,
                    name
                }

            })
        }

        // criando o token de autenticação na aplicação
        const token = sign({
            user: {
                name: user.name,
                avatar_url: user.avatar_url,
                id: user.id,
            },
        },
        process.env.JWT_SECRET,
        {
            subject: user.id,
            expiresIn: "1d"
        })

        return { token, user }

    }
}

export { AuthenticateUserService }
```

### Modificação no controller do usuario 

- Fazer a tratativa da excessão com o try catch

```ts
import { Request, Response } from "express"
import { AuthenticateUserService } from "../services/AuthenticateUserService"

class AuthenticateUserController {
    async handle(request: Request, response: Response) {
        const { code } = request.body
        
        const service = new AuthenticateUserService()

        try{
            const result = await service.execute(code)
    
            return response.json(result)

        } catch(err) {
            return response.json({error: err.message})
            
        }
    }

}

export { AuthenticateUserController }
```
## Migration de criação de mensagens

- Alterar o arquivo schema.prisma adicionando a criação da migration de criação de mensagens
adicinando a relação de tabelas

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String @id @default(uuid())
  name         String
  github_id    Int
  avatar_url   String
  login        String

  messages Message[]
  @@map("users")
}

model Message {
  id          String @id @default(uuid())
  text        String
  created_at  DateTime @default(now())

  user User @relation(fields: [user_id], references: [id])

  user_id String
  @@map("messages")
}
```

- No terminal rodar o comando de criação da migration passando o nome `create-messages`

## Service de criação de mensagens

- No diretorio services criar o arquivo `CreateMessageService.ts`

```ts
import pcl from '../prisma'

class CreateMessageService {
    async execute(text: string, user_id: string) {
        const message = await pcl.message.create({
            data: {
                text,
                user_id
            },
            include: {
                user: true
            }
        })

        return message
    }

}

export { CreateMessageService }
```
## Controller de criação de mensagens

- No diretorio controllers criar o arquivo `CreateMessageController.ts`

```ts
import { Request, Response } from 'express';
import { CreateMessageService } from '../services/CreateMessageService';

class CreateMessageController {
    async handle(request: Request, response: Response) {
        const { message } = request.body
        const { user_id } = request

        const service = new CreateMessageService()

        const result = await service.execute(message, user_id)

        return response.json(result)
    }
}

export { CreateMessageController }
```

## Middleware de verificação de autenticação

- No diretorio src criar o diretorio middleware e dentro dele o arquivo `ensureAuthenticated.ts`

- Inserir nele a creiação do middleware que ira verificar se o usuario esta autenticado antes de 
enviar a mensagem

```ts
import { Request, Response, NextFunction } from 'express';

import { verify } from 'jsonwebtoken'

interface IPayLoad {
    sub: string;
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization

    if (!authToken) {
        return response.status(401).json({ 
            errorCode: "token.invalid",
        })
    }

    // bearer 3h2149qw2jh2232k12swajj
    // [0] bearer
    // [1] token

    const [, token] = authToken.split(" ")

    try {
        const { sub } = verify(token, process.env.JWT_SECRET) as IPayLoad

        request.user_id = sub

        return next()
        
    }catch(err) {
        return response.status(401).json({ errorCode: "token.expired" })
    }
}
```
- O express por padrao nao entende a tipagem da variavel user_id, para isso é necessario inserir
essa tipagem

- Dentro do diretorio src criar o diretorio `@types`, dentro dele o diretorio `express` e dentro dele o arquivo `index.d.ts` e inserir a tipagem. 

```ts
declare namespace Express {
    export interface Request {
        user_id: string;
    }
}
```
- No arquivo de rotas, inserir uma nova rota com o controller de criação de mensagens e no meio dessa
rota, passar o middleware que foi criado.

```ts
import { Router } from "express"
import { AuthenticateUserController } from "./controllers/AuthenticateUserController"
import { CreateMessageController } from "./controllers/CreateMessageController"
import { ensureAuthenticated } from "./middleware/ensureAuthenticate"


const router = Router()

router.post("/authenticate", new AuthenticateUserController().handle)

router.post("/messages", ensureAuthenticated ,new CreateMessageController().handle)

export { router }
```
- No arquivo tsconfig adicionar como root todas as tipagens 

```json
    "typeRoots": ["./src/@types", "node_modules/@types"]  
```

## Inserindo socket na aplicaçao

- No terminal instalar o socket.io

```bash
yarn add socket.io
yarn add @types/socket.io -D

yarn add cors
yarn add @types/cors -D
```

- Arquivo app.ts fazer as importações e as invocações necessarias 

```ts
import "dotenv/config"
import express from 'express'

import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'

import { router } from "./routes"

const app = express()
app.use(cors())

const serverHttp = http.createServer(app)

const io = new Server(serverHttp, {
    cors: {
        origin: "*"
    }
})

io.on("conection", socket => {
    console.log(`Usuario conectado no socket ${socket.id}`)
})

app.use(express.json())

app.use(router)

app.get("/github", (request, response) => {
    response.redirect(`http://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`)
})

app.get("/signin/callback", (request, response) => {
    const { code } = request.query;

    return response.json(code)
})



app.listen(4000, () => console.log("Hello"))

```

- Para testar visualmente se esta acontecendo a ligação com socket, criar um html basico para poder visualizar

- criar um diretorio public na pasta raiz do projeto e dentro dele o arquivo `index.html` adicionar o script abaixo

```html
<script
    src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.min.js"
    integrity="sha512-eVL5Lb9al9FzgR63gDs1MxcDS2wFu3loYAgjIH0+Hg38tCS8Ag62dwKyH+wzDb+QauDpEZjXbMn11blw8cbTJQ=="
    crossorigin="anonymous"
></script>

<script>
    const socket = io("http://localhost:4000")

    socket.on("new_message", (data) => console.log(data))
</script>
```

- No diretorio src criar o arquivo server.ts e passar o comando de `listen` que esta dentro de app.ts para ele

- No arquivo app.ts exportar o `serverHttp` e o `io`

- No server.ts importar o serverHttp

- Fazer as alterações no server do `CreateMessage`

```ts
import { io } from '../app'
import pcl from '../prisma'

class CreateMessageService {
    async execute(text: string, user_id: string) {
        const message = await pcl.message.create({
            data: {
                text,
                user_id
            },
            include: {
                user: true
            }
        })

        const infoWS = {
            text: message.text,
            user_id: message.user_id,
            created_at: message.created_at,
            user: {
                name: message.user.name,
                avatar_url: message.user.avatar_url
            }
        }

        io.emit("new_message", infoWS)

        return message
    }

}

export { CreateMessageService }
```

- No package.json alterar o script que sera ouvido de app para server

## Listagem das 3 ultimas mensagens

- Criar o service `GetLast3Messages.ts`

```ts
import pcl from '../prisma'

class GetLast3MessagesService {
    async execute() {
        const messages = await pcl.message.findMany({
            take: 3,
            orderBy: {
                created_at: "desc"
            },
            include: {
                user: true,
            },
        })

        return messages
    }

}

export { GetLast3MessagesService }
```

- Criar o controller `GetLast3Messages.ts`

```ts
import { Request, Response } from 'express';
import { GetLast3MessagesService } from '../services/GetLast3Messages';


class GetLast3MessagesController {
    async handle(request: Request, response: Response) {
        const service = new GetLast3MessagesService();

        const result = await service.execute()

        return response.json(result)
    }
}

export { GetLast3MessagesController }
```

## Retornar o profile do usuario

- Criar o service `ProfileUserService.ts`

```ts
import pcl from '../prisma'

class ProfileUserService {
    async execute(user_id: string) {
        const user = await pcl.user.findFirst({
            where: {
                id: user_id,
            },
        })

        return user
    }

}

export { ProfileUserService }
```

- Criar o controller `ProfileUserController.ts`

```ts
import { Request, Response } from 'express';
import { ProfileUserService } from '../services/ProfileUserService';


class ProfileUserController {
    async handle(request: Request, response: Response) {
        const { user_id } = request
        
        const service = new ProfileUserService();

        const result = await service.execute(user_id)

        return response.json(result)
    }
}

export { ProfileUserController }
```

- Passar o controller nas rotas