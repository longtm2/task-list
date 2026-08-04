import styles from './Button.module.css'

export default function Button({ className = '', variant = 'default', ...props }) {
  const buttonClassName = [styles.button, styles[variant], className].filter(Boolean).join(' ')

  return <button className={buttonClassName} {...props} />
}
