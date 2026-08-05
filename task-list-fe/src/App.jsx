import { useEffect } from 'react'
import { useAuth } from './auth/useAuth'
import AppHeader from './components/AppHeader/AppHeader'
import CreateTaskPage from './pages/CreateTaskPage/CreateTaskPage'
import LoginPage from './pages/LoginPage/LoginPage'
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
  const { status } = useAuth()
  const taskId = matchTaskDetail(location.pathname)
  const isLoginPage = location.pathname === '/login'
  const isKnownPrivateRoute = location.pathname === '/tasks' || location.pathname === '/tasks/new' || taskId
  const isAuthenticated = status === 'authenticated'
  const shouldRedirect = status !== 'loading' && (
    (!isAuthenticated && !isLoginPage) ||
    (isAuthenticated && (isLoginPage || !isKnownPrivateRoute))
  )

  useEffect(() => {
    if (shouldRedirect) {
      navigate(isAuthenticated ? '/tasks' : '/login', { replace: true })
    }
  }, [isAuthenticated, navigate, shouldRedirect])

  if (status === 'loading') {
    return <div className="session-state">Checking session</div>
  }

  if (shouldRedirect) return null
  if (!isAuthenticated) return <LoginPage />

  let page = <TasksListPage />

  if (location.pathname === '/tasks/new') {
    page = <CreateTaskPage />
  } else if (taskId) {
    page = <TaskDetailPage taskId={taskId} />
  }

  return (
    <div className="app-root">
      <AppHeader />
      {page}
    </div>
  )
}
