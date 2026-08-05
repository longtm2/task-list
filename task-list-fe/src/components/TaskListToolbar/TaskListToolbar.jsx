import Button from '../Button/Button'
import styles from './TaskListToolbar.module.css'

export default function TaskListToolbar({
  isLoading,
  onNewTask,
  onRefresh,
}) {
  return (
    <section className={styles.toolbar} aria-label="Task list controls">
      <div className={styles.actions}>
        <Button type="button" variant="primary" onClick={onNewTask}>
          New task
        </Button>
        <Button type="button" disabled={isLoading} onClick={onRefresh}>
          Refresh
        </Button>
      </div>
    </section>
  )
}
