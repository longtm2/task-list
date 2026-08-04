import { taskStatusLabel } from '../../utils/taskStatus'
import styles from './StatusBadge.module.css'

export default function StatusBadge({ status }) {
  return <span className={`${styles.statusBadge} ${styles[status]}`}>{taskStatusLabel(status)}</span>
}
