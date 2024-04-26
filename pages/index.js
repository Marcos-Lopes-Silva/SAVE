import { getSession } from 'next-auth/react'
import Image from 'next/image';
import Egressos from './images/landingpage/Egressos.svg'
import Gestores from './images/landingpage/Gestores.svg'
import GreySVG from './images/landingpage/GreySVG.svg'
import ExplorePesquisas from './images/landingpage/ExplorePesquisas.svg'
import Shape1 from './images/landingpage/Shape1.svg'
import Questionario from './images/landingpage/questionario.png'
import styles from './Index.module.css'

export default function LandingPage() {

  const login = () => {
    window.location.href = '/login'
  }

  return (
    <section className={styles.section}>
      <div className={styles.frame1}>
        <div className={styles.side1}>
          <div className={styles.img}><Image src={Shape1} width={111.999} height={19.5} alt='Frame' className={styles.img}/></div>
          <h1>Facilite a Gestão de Dados Acadêmicos.</h1>
          <a>Coleta, análise e apresentação de dados de egressos nunca foram tão simples. Descubra como simplificar e agilizar essa tarefa agora.</a>
          <button className={styles.buttoniniciar} onClick={login}>Iniciar</button>
        </div>
        <div className={styles.img100}>
          <Image src={Questionario} width={520} height={589} alt='logo' />
        </div>
      </div>
      <div className={styles.conectandosuper}>
        <div className={styles.conectando}>
          <h1>Conectando Egressos e Gestores</h1>
          <a>Enriqueça a experiência acadêmica e promova o crescimento educacional</a>
        </div>
        <div className={styles.conectandocards}>
          <div className={styles.cardegressos}>
            <div className={styles.subcardegressos}>
              <div className={styles.subceimg}>
                <Image src={Egressos} width={103} height={101} alt='Egressos' />
              </div>
              <h1>Egressos Universitários</h1>
              <a>Oportunidade de compartilhar suas experiências acadêmicas e profissionais por meio de questionários.</a>
            </div>
          </div>
          <div className={styles.cardgestores}>
            <div className={styles.subcardgestores}>
              <div className={styles.subcgimg}>
                <Image src={Gestores} width={103} height={101} alt='Gestores' />
              </div>
              <h1>Gestores de instituições de ensino</h1>
              <a>Os gestores das instituições de ensino podem utilizar os resultados e insights obtidos pelo SAVE para tomar decisões relacionadas à melhoria dos cursos.</a>
            </div>
          </div>
        </div>
        <div className={styles.svgexplore}>
          <Image src={GreySVG} width={1071} height={415} />
        </div>
        <div className={styles.explorepesquisas}>
          <div className={styles.explorepesquisassub}>
            <div className={styles.svgexplore2}>
              <Image src={ExplorePesquisas} width={500.999} height={544}  alt='Explore Pesquisas' />
            </div>
            <div className={styles.exploretext}>
              <h1>Explore as pesquisas</h1>
              <a>Ao clicar no botão "Ver", você será conduzido aos gráficos gerados pelos questionários.</a>
              <button className={styles.explorebutton}>Ver</button>
            </div>
          </div>
        </div>
      </div>

    </section>
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

