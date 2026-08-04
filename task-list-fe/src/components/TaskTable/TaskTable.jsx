import StatusBadge from '../StatusBadge/StatusBadge'
import { formatDateTime } from '../../utils/dateTime'
import { taskStatus } from '../../utils/taskStatus'
import styles from './TaskTable.module.css'

export default function TaskTable({ tasks }) {
  return (
    <div className={styles.taskTableWrap}>
      <table className={styles.taskTable} aria-label="Tasks">
        <thead>
          <tr>
            <th scope="col">Key</th>
            <th scope="col">Subject</th>
            <th scope="col">Status</th>
            <th scope="col">Due date</th>
            <th scope="col">Created</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className={styles.taskId}>TASK-{task.id}</td>
              <td className={styles.taskSummary}>
                <strong>{task.title}</strong>
                {task.description && <span>{task.description}</span>}
              </td>
              <td className={styles.taskStatus}>
                <StatusBadge status={taskStatus(task)} />
              </td>
              <td className={styles.taskDate}>{formatDateTime(task.due_at)}</td>
              <td className={styles.taskDate}>{formatDateTime(task.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
