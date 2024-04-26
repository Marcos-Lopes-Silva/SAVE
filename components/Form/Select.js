import { useState } from 'react';
import styles from './Select.module.css';

export function Select({ value, selectValue, id, selectedId, ...props }) {
    console.log(id, selectedId);


    return (
        <div className={styles.ball} style={id === selectedId ? {backgroundColor: 'black', color: 'white'} : {backgroundColor: 'white'}} onClick={(e) => selectValue(e, value)} {...props} >
            {value}
        </div>
    )
}