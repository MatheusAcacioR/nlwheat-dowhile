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