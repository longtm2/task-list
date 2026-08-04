import StatusBadge from '../StatusBadge/StatusBadge'
import { formatDateTime } from '../../utils/dateTime'
import { taskStatus } from '../../utils/taskStatus'
import styles from './TaskTable.module.css'

export default function TaskTable({ onOpenTask, selectedTaskId, tasks }) {
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
          {tasks.map((task) => {
            const isSelected = selectedTaskId === task.id

            return (
              <tr key={task.id} className={isSelected ? styles.selectedRow : undefined}>
                <td className={styles.taskId}>
                  <button
                    type="button"
                    className={styles.taskLink}
                    aria-current={isSelected ? 'true' : undefined}
                    onClick={() => onOpenTask(task.id)}
                  >
                    TASK-{task.id}
                  </button>
                </td>
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
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
