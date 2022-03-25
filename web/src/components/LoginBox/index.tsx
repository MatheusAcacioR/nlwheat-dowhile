import { useContext, useEffect } from 'react'
import { VscGithubInverted } from 'react-icons/vsc'
import { AuthContext } from '../../contexts/auth'
import { api } from '../../services/api'
import styles from './styles.module.scss'

export function LoginBox() {
    const { signInUrl } = useContext(AuthContext)
    
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