import styles from './Footer.module.css'
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';


const Footer = () => {


    return (
        <footer className={styles.footer}>
            <div className={styles.copyright}>
                <a>Copyright @ 2023 SAVE itd.</a>
                <a>Todos os direitos reservados.</a>
            </div>
            <div className={styles.links}>
                <h3>SAVE</h3>
                <a>Sobre</a>
                <a>Contate-nos</a>
            </div>
            <div className={styles.socialicons}>
                <div className={styles.circle}><FaFacebook color='#FFF' fontSize={20}/></div>
                <div className={styles.circle}><FaInstagram color='#FFF' fontSize={20}/></div>
                <div className={styles.circle}><FaTwitter color='#FFF' fontSize={20}/></div>
            </div>
        </footer>
    )
}


export default Footer;