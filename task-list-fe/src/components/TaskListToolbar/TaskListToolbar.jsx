import Button from '../Button/Button'
import styles from './TaskListToolbar.module.css'

export default function TaskListToolbar({ dueByToday, isLoading, onDueByTodayChange, onRefresh }) {
  return (
    <section className={styles.toolbar} aria-label="Task list controls">
      <label className={styles.filterToggle}>
        <input
          type="checkbox"
          checked={dueByToday}
          onChange={(event) => onDueByTodayChange(event.target.checked)}
        />
        <span>Due by today</span>
      </label>
      <Button type="button" disabled={isLoading} onClick={onRefresh}>
        Refresh
      </Button>
    </section>
  )
}
