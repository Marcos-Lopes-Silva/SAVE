import { useEffect, useState } from 'react';
import styles from './BottomButtons.module.css';
import { FaTrashCan } from 'react-icons/fa6';
import { FaCopy } from 'react-icons/fa';

export default function BottomButtons({ showAll, deleteQuestion, id, Required, isRequired }) {

    const [ toggled, setToggled ] = useState(false);

    function deleteQ(e) {
        e.preventDefault();
        deleteQuestion(id);
    }

    function setupRequired(e) {
        e.preventDefault();
        setToggled(!toggled);
        Required();
    }

    useEffect(() => {
        if (isRequired) setToggled(true);
    }, [ 0 ])

    return (
        <div className={styles.containerbutton}>
            <div className={styles.buttons}>
                <button className={styles.button}>
                    <FaCopy size={15}/>
                </button>
               
                <button onClick={(e) => deleteQ(e)} className={styles.button}>
                    <FaTrashCan size={15} />
                </button>

                <div className={styles.vb}/>

                <button className={`${styles.toggle_btn} ${toggled ? styles.toggled : ""}`} onClick={setupRequired}>
                    <div className={styles.thumb}/>
                </button>
                <label>Obrigatório</label>
            </div>
        </div>

    )
}