import styles from './Buscador.module.css';
import { CgSearch } from 'react-icons/cg';

export default function Buscador({ iconSize = 30, width = '100%', height = '50px', busca, setBusca, content }) {
    return (
      <div className={styles.buscador} style={{width: width, height: height}}>
        <CgSearch size={iconSize} color="#4C4D5E" />
        <input value={busca} placeholder={content}  onChange={(evento) => setBusca(evento.target.value)} />
      </div>
    );
  }