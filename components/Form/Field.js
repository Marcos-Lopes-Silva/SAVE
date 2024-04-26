import styles from './Field.module.css';

export function Field(props) {
  return (
    <div className={styles.field} {...props} />
  )
}