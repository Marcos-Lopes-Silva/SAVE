import styles from './Dropdown.module.css'
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useState } from 'react';



export function Dropdown({ arrFields, span, style, selected, setSelected }) {

    const [ open, setOpen ] = useState(false);

    const name = selected && arrFields.find(option => option === selected);

    function selectField(field) {
        setSelected(field);
        setOpen(false);
    }

    function openMenu(e) {
        e.preventDefault();
        setOpen(!open);
    }

    return (
        <div style={style.menu} className={styles.select_menu}>
            <button style={style.button} onClick={(e) => openMenu(e)} >
                <span style={style.span}>{name || span}</span>
                { open ? <IoMdArrowDropup cursor={'pointer'} size={'20px'}/> : <IoMdArrowDropdown cursor={'pointer'} size={'20px'}/> }
            </button>
            {open &&
                <ul className={styles.options} style={style.options}>
                    {arrFields.map((field) => (
                        <li className={styles.option} style={style.option} key={field} onClick={() => selectField(field)}>
                            <span className={styles.option_text}>{field}</span>
                        </li>
                    ))}
                </ul>
            } 
        </div>
    )
}
