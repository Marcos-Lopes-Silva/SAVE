import styles from './Label.module.css';

export function Label(props) {
  return (
    <label 
      className={styles.label}
      {...props}
    />
  )
}