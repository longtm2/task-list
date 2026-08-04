import { useEffect } from 'react'
import CreateTaskPage from './pages/CreateTaskPage/CreateTaskPage'
import TaskDetailPage from './pages/TaskDetailPage/TaskDetailPage'
import TasksListPage from './pages/TasksListPage/TasksListPage'
import { useRouter } from './router/router'
import './App.css'

function matchTaskDetail(pathname) {
  const match = pathname.match(/^\/tasks\/(\d+)$/)

  return match?.[1]
}

export default function App() {
  const { location, navigate } = useRouter()
  const taskId = matchTaskDetail(location.pathname)
  const isKnownRoute = location.pathname === '/tasks' || location.pathname === '/tasks/new' || taskId
  const shouldRedirectToTasks = location.pathname === '/' || !isKnownRoute

  useEffect(() => {
    if (shouldRedirectToTasks) {
      navigate('/tasks', { replace: true })
    }
  }, [navigate, shouldRedirectToTasks])

  if (shouldRedirectToTasks) {
    return null
  }

  let page = <TasksListPage />

  if (location.pathname === '/tasks/new') {
    page = <CreateTaskPage />
  } else if (taskId) {
    page = <TaskDetailPage taskId={taskId} />
  }

  return <div className="app-root">{page}</div>
}
