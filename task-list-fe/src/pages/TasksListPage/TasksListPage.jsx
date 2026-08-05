import { useMemo } from 'react'
import SummaryBox from '../../components/SummaryBox/SummaryBox'
import TaskFilters from '../../components/TaskFilters/TaskFilters'
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
const TASK_STATUSES = new Set(['open', 'completed', 'overdue'])

function parsePositiveInt(value, fallback) {
  const parsedValue = Number(value)

  if (!Number.isInteger(parsedValue) || parsedValue < 1) return fallback

  return parsedValue
}

function parseStatus(value) {
  return TASK_STATUSES.has(value) ? value : ''
}

export default function TasksListPage() {
  const { location, navigate } = useRouter()
  const searchParams = new URLSearchParams(location.search)
  const dueByToday = searchParams.get('due_by_today') === 'true'
  const dueFrom = searchParams.get('due_from') || ''
  const dueTo = searchParams.get('due_to') || ''
  const page = parsePositiveInt(searchParams.get('page'), DEFAULT_PAGE)
  const perPage = parsePositiveInt(searchParams.get('per_page'), DEFAULT_PER_PAGE)
  const query = searchParams.get('query') || ''
  const status = parseStatus(searchParams.get('status'))
  const filters = useMemo(() => ({
    dueByToday,
    dueFrom,
    dueTo,
    query,
    status,
  }), [dueByToday, dueFrom, dueTo, query, status])
  const { errorMessage, pagination, reload, requestState, tasks } = useTasks({
    ...filters,
    page,
    perPage,
  })
  const isLoading = requestState === 'loading'
  const isFiltered = dueByToday || Boolean(dueFrom || dueTo || query || status)

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

  function handleFiltersApply(nextFilters) {
    updateTaskListParams({
      due_by_today: nextFilters.dueByToday ? 'true' : false,
      due_from: nextFilters.dueFrom,
      due_to: nextFilters.dueTo,
      page: DEFAULT_PAGE,
      query: nextFilters.query,
      status: nextFilters.status,
    })
  }

  function handleFiltersClear() {
    updateTaskListParams({
      due_by_today: false,
      due_from: false,
      due_to: false,
      page: DEFAULT_PAGE,
      query: false,
      status: false,
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
          label={isFiltered ? 'Filtered tasks' : 'Total tasks'}
        />
      </header>

      <TaskFilters
        key={location.search}
        filters={filters}
        isLoading={isLoading}
        onApply={handleFiltersApply}
        onClear={handleFiltersClear}
      />
      <TaskListToolbar
        isLoading={isLoading}
        onNewTask={() => navigate('/tasks/new')}
        onRefresh={reload}
      />

      {isLoading && <LoadingState />}
      {requestState === 'error' && <ErrorState message={errorMessage} onRetry={reload} />}
      {requestState === 'success' && tasks.length === 0 && <EmptyState isFiltered={isFiltered} />}
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
