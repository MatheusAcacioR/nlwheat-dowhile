# Criando o frontend web 

## Iniciando o projeto 

- No terminal dentro do direotorio raiz, criar um projeto utilizando auxilio do Vite .

```bash
yarn create vite web --template react-ts
cd web
yarn
```

- Dentro do diretorio src, no arquivo `App.tsx` deixar apenas `export function App` e sua exportação .

```tsx
export function App() {
  return (
    <h1>Hello World</h1>
  )
}
```
- Deletar todos os arquivos do diretorio src, deixando apenas o App.tsx, main.tsx e o vite-env.d.ts .

- No arquivo main.tsx, apagar a importação do css e colocar a importação do App entre `{} ` .

```tsx
import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
```

## Visual da Pagina 

- Criar diretorio styles dentro do direotrio src, e dentro dele o arquivo global.css 

- Inserir os estilos no global.css 

```css
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: Roboto, sans-serif;
}

body {
    color: #e1e1e6;
    background: #121214;
}
```
- Colocar o link do de api de fontes do google no arquivo index.html

- Fazer o import do glolbal.css no arquivo main.tsx 

```tsx
import './styles/global.css'
```

### Usando css.modules

- Criar um arquivo css, porem com o nome `.module.css`, exemplo: App.module.css 

```css
.contentWhrapper {
    max-width: 1200px;
    height: 100vh;
    margin: 0 auto;

    display: grid; /*componente um ao lado do outro*/
    grid-template-columns: 1fr 453px;
    column-gap: 120px;
    position: relative;
}
```

- Importar esse arquivo como se fosse uma função JS

- Onde tiver que colocar os atributos css que foram
definidos, passar os atributos pelo className da tag, como se fosse uma função

```tsx
import styles from './styles/App.module.css';

export function App() {
  return (
    <main className={styles.contentWhrapper} >
      <h1>Hello World</h1>
    </main>
  )
}
```
### Utilizando Sass

- No terminal instalar o sass 

```bash
yarn add sass
```
- O arquivos css mudar a extensao para `scss`

## Criando componentes 

- No diretorio src criar o direotorio components e dentro dele criar os diretorios de cada componente que sera utilizado na aplicação: LoginBox, MessageList, SendMessageForm

- Dentro de cada um deles criar o arquivo index.tsx e inserir o codigo base de criação do html em forma de função

```tsx
export function SendMessageForm() {
    return(
        <h1>SendMessageForm</h1>
    )
}
```
No arquivo App.tsx, importar os componentes MessageList e LoginBox

```tsx
import { LoginBox } from './components/LoginBox';
import { MessageList } from './components/MessageList';
import styles from './styles/App.module.scss';

export function App() {
  return (
    <main className={styles.contentWhrapper} >
      <MessageList />
      <LoginBox />
    </main>
  )
}
```
## Componente LoginBox

- Modificar o componente LoginBox 

```tsx
import styles from './styles.module.scss'

export function LoginBox() {
    return(
        <div className={styles.LoginBoxWrapper}>
            <strong>Entre e compartilhe sau mensagem</strong>
            <a href="#" className={styles.signWithGithub}>
                Entrar com o Github
            </a>
        </div>
    )
}
```

- No direotorio LoginBox criar o arquivo styles.module.css 

```scss
.loginBoxWrapper {
    height: 100vh;
    width: 100%;
    background: #17171a url(../../assets/banner-girl.png) no-repeat center top;

    padding: 440px 80px 0;
    text-align: center;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    strong {
        font-size: 32px;
        line-height: 36px;
    }

    a {
        padding-top: 10px;
    }

    .signWithGithub {
        background: #ffcd1e;
        margin-top: 32px;
        padding: 0 40px;
        height: 56px;
        color: #09090a;
        font-size: 14px;
        font-weight: bold;
        text-transform: uppercase;
        text-decoration: none;

        display: flex;
        align-items: center;
        justify-content: center;

        svg {
            margin-right: 10px;
        }

        &:hover {
            filter: brightness(0.9)
        }
    }
}
```

### Inserindo icones no React 

- No terminal instalar o pacote de icons `yarn add react-icons`

- Importar o pacote no arquivo onde precisar colocar os icones 

> index.tsx

```tsx
import { VscGithubInverted } from 'react-icons/vsc'
import styles from './styles.module.scss'

export function LoginBox() {
    return(
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sau mensagem</strong>
            <a href="#" className={styles.signWithGithub}>
                <VscGithubInverted size="24"/>
                Entrar com o Github
            </a>
        </div>
    )
}
```

## Componente MessageList

- Modificar o componente MessageList 

```tsx
import styles from './styles.module.scss'
import logoImg from '../../assets/logo.svg'

export function MessageList() {
    return(
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt="DoWhile 2021" />
            <ul className={styles.messagelist}>
                <li className={styles.message}>
                    <p className={styles.messageContent}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo aut, consequatur provident temporibus quod reprehenderit quibusdam delectus ea ad sapiente, aliquam placeat obcaecati inventore earum dolorem. Praesentium beatae iusto quisquam.</p>
                    <div className={styles.messageUser}>
                        <div className={styles.userImage}>
                            <img src="https://github.com/MatheusAcacioR.png" alt="Matheus Acacio Rodrigues" />
                        </div>
                    </div>
                </li>

                <li className={styles.message}>
                    <p className={styles.messageContent}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo aut, consequatur provident temporibus quod reprehenderit quibusdam delectus ea ad sapiente, aliquam placeat obcaecati inventore earum dolorem. Praesentium beatae iusto quisquam.</p>
                    <div className={styles.messageUser}>
                        <div className={styles.userImage}>
                            <img src="https://github.com/MatheusAcacioR.png" alt="Matheus Acacio Rodrigues" />
                        </div>
                    </div>
                </li>

                <li className={styles.message}>
                    <p className={styles.messageContent}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo aut, consequatur provident temporibus quod reprehenderit quibusdam delectus ea ad sapiente, aliquam placeat obcaecati inventore earum dolorem. Praesentium beatae iusto quisquam.</p>
                    <div className={styles.messageUser}>
                        <div className={styles.userImage}>
                            <img src="https://github.com/MatheusAcacioR.png" alt="Matheus Acacio Rodrigues" />
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    )
}
```

- No direotorio MessageList criar o arquivo styles.module.css 

```scss
.messageListWrapper {
    display: flex;
    flex-direction: column;

    justify-content: space-between;
    align-items: flex-start;

    > img {
        height: 28px;
        margin: 32px 0;
    }
}

.messageList {
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 40px;
    flex: 1;

    .message {
        max-width: 440px;

        &:nth-child(2) {
            margin-left: 80px;
        }

        .messageContent {
            font-size: 20px;
            line-height: 20px;
        }

        .messageUser {
            margin-top: 16px;
            display: flex;
            align-items: center;

            .userImage {
                padding: 2px;
                background: linear-gradient(100deg, #ff008e 0%, #ffcd1e 100%);
                border-radius: 50%;
                line-height: 0;

                img {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    border: 4px solid #121214;
                }
            }

            span {
                font-size: 16px;
                margin-left: 12px;
            }
        }
    }
}
```
## Integrando o frontend React com o backend API Node

- No terminal instalar o axios `yarn add axios`

- No diretorio src criar o diretorio services e dentro dele o arquivo api.ts

```ts
import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:4000',
})
```

### Importando da api a Lista de mensagens

- No index.tsx do componente Messagelist importar o arquivo da api, e o UseEffect do React

- Dentro da function do componente utilizar o useEffect

- Importar o useState para atualizar o estado da lista de mensagens

```tsx
import { useEffect, useState } from 'react'
import { api } from '../../services/api'

import styles from './styles.module.scss'
import logoImg from '../../assets/logo.svg'

type Message = {
    id: string;
    text: string;
    user: {
        name: string;
        avatar_url: string
    }
}

export function MessageList() {
    // atualização do estado das listas de mensagens
    const [messages, setMessages] = useState<Message[]>([])
    // chamando a api com o useEffect
    useEffect(() => {
        api.get('messages/last3').then(response => {
            setMessages(response.data)
        })
    }, [])
```

- Retornando para cada mensagem no banco, uma li com as infos das mensagens

```tsx
<ul className={styles.messageList}>
                {messages.map(message => {
                    return(
                        <li  key={message.id} className={styles.message}>
                            <p className={styles.messageContent}>{message.text}</p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img src={message.user.avatar_url} alt={message.user.name} />
                                </div>
                                <span>{message.user.name}</span> 
                            </div>
                        </li>
                    )
                })}
</ul>
```
### Pagina de Login com o github

- No painel de controle do app nop github, alterar a url de callback para a url da pagina frontend

- Editar o componente LoginBox

- Criar uam variavel com a URL de autenticação do app com o github, passando o client_id da aplicação

- Passar essa variavel no href do link da pagina do frontend

```tsx
import { VscGithubInverted } from 'react-icons/vsc'
import styles from './styles.module.scss'

export function LoginBox() {
    const singInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=182fd1cc97a6c96b4188`

    return(
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sau mensagem</strong>
            <a href={singInUrl} className={styles.signWithGithub}>
                <VscGithubInverted size="24"/>
                Entrar com o Github
            </a>
        </div>
    )
}
```

### Passar o codigo de autenticação do usuario para o backend 

- Usar o useEffect para capturar a URL da pagina e fazer um split removendo o codigo 

- Função para pegar o codigo e mandar para o backend

```tsx
import { useEffect } from 'react'
import { VscGithubInverted } from 'react-icons/vsc'
import { api } from '../../services/api'
import styles from './styles.module.scss'

type AuthResponse = {
    token: string;
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
}

export function LoginBox() {
    const singInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=182fd1cc97a6c96b4188`

    async function sigIn(githubCode: string) {
        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode,
        })

        const { token, user } = response.data

        // salvando o codigo de autenticação no local storage do navegador
        localStorage.setItem('@dowhile:token', token)

        console.log(user)
    }

    useEffect(() => {
        // capturando a url completa apos a autenticação do usuario
        const url = window.location.href;
        const hasGithubCode = url.includes('?code=')

        // verificando se a url contem o codigo de autenticação
        if (hasGithubCode) {
            // removendo o codigo da url
            const [urlWithoutCode, githubCode] = url.split('?code=')

            // devolvendo a url sem o codigo
            window.history.pushState({}, '', urlWithoutCode)

            sigIn(githubCode)
        }
    }, [])

    return(
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sau mensagem</strong>
            <a href={singInUrl} className={styles.signWithGithub}>
                <VscGithubInverted size="24"/>
                Entrar com o Github
            </a>
        </div>
    )
}
```
### Contenxt api para compartilhar a autenticação entre as paginas

- No diretorio src cvriar o diretorio contexts e dentro dele o arquivo auth.tsx

```tsx
import { createContext, ReactNode } from "react";

const AuthContext = createContext(null)

type AuthProvider = {
    children: ReactNode;
}

export function AuthProvider(props: AuthProvider) {
    return (
        <AuthContext.Provider value={null}>
            {props.children}
        </AuthContext.Provider>
    )
}
```
- No main.tsx passar o `<AuthProvider>` por volta do componente App 

```tsx
ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
```

- No arquivo loginBox, passar toda a logica de autenticação para o arquivo auth.tsx

> Ao utilizar o Vite no projeto e estiver utilizando variaveis de ambiente, nao é necessario instalar o dotenv. No arquivo de variaveis coloque como prefixo de cada variavel VITE_NOME_DA_VARIAVEL. Onde for que for utilizar qualquer variavel, use a sintaxe import.meta.env.VITE_NOME_DA_VARIAVEL.

```tsx
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

type AuthContextData = {
    user: User | null;
    signInUrl: string;
}

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
    children: ReactNode;
}

type AuthResponse = {
    token: string;  
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
}

export function AuthProvider(props: AuthProvider) {
    const [user, setUser] = useState<User | null>(null)

    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}`

    async function sigIn(githubCode: string) {
        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode,
        })

        const { token, user } = response.data

        // salvando o codigo de autenticação no local storage do navegador
        localStorage.setItem('@dowhile:token', token)

        setUser(user)
    }

    useEffect(() => {
        // capturando a url completa apos a autenticação do usuario
        const url = window.location.href;
        const hasGithubCode = url.includes('?code=')

        // verificando se a url contem o codigo de autenticação
        if (hasGithubCode) {
            // removendo o codigo da url
            const [urlWithoutCode, githubCode] = url.split('?code=')

            // devolvendo a url sem o codigo
            window.history.pushState({}, '', urlWithoutCode)

            sigIn(githubCode)
        }
    }, [])

    return (
        <AuthContext.Provider value={{ signInUrl, user }}>
            {props.children}
        </AuthContext.Provider>
    )
}
```

- Importar o context no loginBox 

```tsx
export function LoginBox() {
    const { signInUrl, user } = useContext(AuthContext)

    console.log(user)
    return(
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sau mensagem</strong>
            <a href={signInUrl} className={styles.signWithGithub}>
                <VscGithubInverted size="24"/>
                Entrar com o Github
            </a>
        </div>
    )
}
```
### Manter as infos do usuario depois do refresh da pagina

