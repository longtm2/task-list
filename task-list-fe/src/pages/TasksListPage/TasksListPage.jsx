import SummaryBox from '../../components/SummaryBox/SummaryBox'
import TaskPagination from '../../components/TaskPagination/TaskPagination'
import TaskTable from '../../components/TaskTable/TaskTable'
import TaskListToolbar from '../../components/TaskListToolbar/TaskListToolbar'
import { EmptyState, ErrorState, LoadingState } from '../../components/TaskListState/TaskListState'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useTasks } from '../../hooks/useTasks'
import { useRouter } from '../../router/router'
import styles from './TasksListPage.module.css'

const DEFAULT_PAGE = 1
const DEFAULT_PER_PAGE = 10

function parsePositiveInt(value, fallback) {
  const parsedValue = Number(value)

  if (!Number.isInteger(parsedValue) || parsedValue < 1) return fallback

  return parsedValue
}

export default function TasksListPage() {
  const { location, navigate } = useRouter()
  const searchParams = new URLSearchParams(location.search)
  const dueByToday = searchParams.get('due_by_today') === 'true'
  const page = parsePositiveInt(searchParams.get('page'), DEFAULT_PAGE)
  const perPage = parsePositiveInt(searchParams.get('per_page'), DEFAULT_PER_PAGE)
  const { errorMessage, pagination, reload, requestState, tasks } = useTasks({
    dueByToday,
    page,
    perPage,
  })
  const isLoading = requestState === 'loading'

  useDocumentTitle('Tasks | Task list project')

  function updateTaskListParams(nextValues) {
    const nextParams = new URLSearchParams(searchParams)

    Object.entries(nextValues).forEach(([key, value]) => {
      if (value === false || value === null || value === undefined || value === '') {
        nextParams.delete(key)
      } else {
        nextParams.set(key, String(value))
      }
    })

    const queryString = nextParams.toString()

    navigate(queryString ? `/tasks?${queryString}` : '/tasks')
  }

  function handleDueByTodayChange(checked) {
    updateTaskListParams({
      due_by_today: checked ? 'true' : false,
      page: DEFAULT_PAGE,
    })
  }

  function handlePageChange(nextPage) {
    updateTaskListParams({ page: nextPage })
  }

  function handlePerPageChange(nextPerPage) {
    updateTaskListParams({
      page: DEFAULT_PAGE,
      per_page: nextPerPage,
    })
  }

  return (
    <main className={styles.taskApp}>
      <header className={styles.taskHeader}>
        <div>
          <p className={styles.breadcrumb}>Projects / Task list</p>
          <h1>Task list project</h1>
          <p className={styles.subtitle}>Work queue</p>
        </div>
        <SummaryBox
          count={pagination.total_count}
          label={dueByToday ? 'Due by today' : 'Total tasks'}
        />
      </header>

      <TaskListToolbar
        dueByToday={dueByToday}
        isLoading={isLoading}
        onDueByTodayChange={handleDueByTodayChange}
        onNewTask={() => navigate('/tasks/new')}
        onRefresh={reload}
      />

      {isLoading && <LoadingState />}
      {requestState === 'error' && <ErrorState message={errorMessage} onRetry={reload} />}
      {requestState === 'success' && tasks.length === 0 && <EmptyState dueByToday={dueByToday} />}
      {requestState === 'success' && tasks.length > 0 && (
        <TaskTable onOpenTask={(taskId) => navigate(`/tasks/${taskId}`)} tasks={tasks} />
      )}
      {requestState === 'success' && (
        <TaskPagination
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      )}
    </main>
  )
}
