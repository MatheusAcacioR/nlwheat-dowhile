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
    return(
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt="DoWhile 2021" />
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
        </div>
    )
}