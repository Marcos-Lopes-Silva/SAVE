import { FaGithub, FaFacebook, FaGoogle } from 'react-icons/fa'
import { signIn, getSession } from 'next-auth/react'
import styles from './Login.module.css'
import LoginImage from './images/login/Login.svg'
import Image from 'next/image'
import { useState } from 'react';


export default function Login() {

  const [switchType, setSwitchType] = useState(false)

  return (
    <div className={styles.section}>
      <div className={styles.container}>
        <div className={styles.esquerda}>
          <h1>SAVE</h1>
          <a>Comece a fazer a diferença agora mesmo.</a>
          <a>Dificuldade para fazer login? Clique em "Saiba Mais" para obter assistência e orientações.</a>
          <button>Saiba mais</button>
          <div>
            <Image src={LoginImage} width={531} height={558} alt='Login'/>
          </div>
        </div>
        <div className={styles.divisor} />
        <div className={styles.direita}>
          <h1>Bem-vindo!</h1>
          <a>Faça login de forma rápida e segura com suas credenciais do Facebook, GitHub ou Google para começar a explorar todas as possibilidades que o Save oferece.</a>
          <div className={styles.loginarea}>
            <ul className={styles.switchtype}>
              <li 
              className={switchType ? styles.itemswitch : styles.itemswitched} 
              onClick={() => {

                if(switchType)
                  setSwitchType(!switchType)
              
              }}>
                <label>Egresso</label>
              </li>
              <li 
              className={switchType ? styles.itemswitched : styles.itemswitch} 
              onClick={() => {

                if(!switchType)
                  setSwitchType(!switchType)
              
              }}>
                <label>Gestor</label>
              </li>
            </ul>
            <div className={styles.loginbuttons}>
              <button onClick={() => signIn('google')}><FaGoogle /> Continue com o Google</button>
              <button onClick={() => signIn('github')}><FaGithub /> Continue com o Github</button>
              <button onClick={() => signIn('facebook')}><FaFacebook /> Continue com o Facebook</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
