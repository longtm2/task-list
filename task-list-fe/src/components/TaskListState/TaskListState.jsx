import Button from '../Button/Button'
import styles from './TaskListState.module.css'

export function LoadingState() {
  return (
    <section className={styles.statePanel} aria-live="polite">
      Loading tasks
    </section>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <section className={`${styles.statePanel} ${styles.statePanelError}`} role="alert">
      <div>
        <h2>Unable to load tasks</h2>
        <p>{message}</p>
      </div>
      <Button type="button" onClick={onRetry}>
        Retry
      </Button>
    </section>
  )
}

export function EmptyState({ isFiltered }) {
  return (
    <section className={styles.statePanel}>
      {isFiltered ? 'No tasks match the current filters.' : 'No tasks have been created yet.'}
    </section>
  )
}
