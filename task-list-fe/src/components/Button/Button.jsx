import styles from './Button.module.css'

export default function Button({ className = '', ...props }) {
  const buttonClassName = [styles.button, className].filter(Boolean).join(' ')

  return <button className={buttonClassName} {...props} />
}
