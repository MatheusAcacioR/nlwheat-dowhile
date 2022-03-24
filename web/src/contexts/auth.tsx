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