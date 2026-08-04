import styles from './SummaryBox.module.css'

export default function SummaryBox({ count, label }) {
  return (
    <div className={styles.summaryBox} aria-label="Task count">
      <span>{count}</span>
      <small>{label}</small>
    </div>
  )
}
