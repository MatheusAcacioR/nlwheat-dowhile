import { useContext } from 'react';
import { LoginBox } from './components/LoginBox';
import { MessageList } from './components/MessageList';
import { SendMessageForm } from './components/SendMessageForm';
import { AuthContext } from './contexts/auth';
import styles from './styles/App.module.scss';

export function App() {
  const { user } = useContext(AuthContext)
  
  return (
    <main className={`${styles.contentWrapper} ${!!user ? styles.contentSigned : ''}`} >
      <MessageList />
      {/*Se o usuario estiver logado, aparecera o componente de formuario da mensagem, caso nao,
      aparecera o componente de login*/}
      {!!user ? <SendMessageForm /> : <LoginBox />}
    </main>
  )
}