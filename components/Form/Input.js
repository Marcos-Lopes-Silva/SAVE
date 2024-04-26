import { useFormContext } from 'react-hook-form'
import styles from './Input.module.css'

export function Input(props) {
  const { register } = useFormContext()

  return (
    <input 
      id={props.name}
      className={styles.input}
      {...register(props.name)} 
      {...props}
    />
  )
}