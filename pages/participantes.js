import { MdListAlt } from 'react-icons/md';
import styles from './Participantes.module.css';
import { IoMdInformationCircleOutline } from 'react-icons/io';


export default function Participantes() {
    return (
        <div className={styles.section}>
            <div className={styles.header}>
                <div className={styles.header1}>
                    <div className={styles.iconBg}><MdListAlt size={26} color='white'/></div>
                    <h1>Gerenciar Participantes</h1>
                    <div className={styles.helper}>
                        <IoMdInformationCircleOutline size={26} />
                    </div>
                </div>
                <div className={styles.header2}>
                    <a>Aqui, você pode organizar de forma eficaz para garantir que seu questionário alcance as pessoas certas.</a>
                </div>
            </div>
        </div>
    )
}