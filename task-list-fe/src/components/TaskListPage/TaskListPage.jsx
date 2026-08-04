import { useState } from 'react'
import SummaryBox from '../SummaryBox/SummaryBox'
import TaskTable from '../TaskTable/TaskTable'
import TaskListToolbar from '../TaskListToolbar/TaskListToolbar'
import { EmptyState, ErrorState, LoadingState } from '../TaskListState/TaskListState'
import { useTasks } from '../../hooks/useTasks'
import styles from './TaskListPage.module.css'

export default function TaskListPage() {
  const [dueByToday, setDueByToday] = useState(false)
  const { errorMessage, reload, requestState, tasks } = useTasks({ dueByToday })
  const isLoading = requestState === 'loading'

  return (
    <main className={styles.taskApp}>
      <header className={styles.taskHeader}>
        <div>
          <p className={styles.breadcrumb}>Projects / Task list</p>
          <h1>Task list project</h1>
          <p className={styles.subtitle}>Work queue</p>
        </div>
        <SummaryBox count={tasks.length} label={dueByToday ? 'Due by today' : 'Total tasks'} />
      </header>

      <TaskListToolbar
        dueByToday={dueByToday}
        isLoading={isLoading}
        onDueByTodayChange={setDueByToday}
        onRefresh={reload}
      />

      {isLoading && <LoadingState />}
      {requestState === 'error' && <ErrorState message={errorMessage} onRetry={reload} />}
      {requestState === 'success' && tasks.length === 0 && <EmptyState dueByToday={dueByToday} />}
      {requestState === 'success' && tasks.length > 0 && <TaskTable tasks={tasks} />}
    </main>
  )
}
