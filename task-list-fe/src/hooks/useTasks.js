import { useCallback, useEffect, useState } from 'react'
import { AxiosError, CanceledError } from 'axios'
import { getTasks } from '../services/tasksService'

function resolveErrorMessage(error) {
  if (error instanceof AxiosError && error.response) {
    return `Task API returned ${error.response.status}`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Unable to load tasks'
}

export function useTasks({ dueByToday }) {
  const [tasks, setTasks] = useState([])
  const [requestState, setRequestState] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  const reload = useCallback(() => {
    setReloadToken((current) => current + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadTasks() {
      setRequestState('loading')
      setErrorMessage('')

      try {
        const loadedTasks = await getTasks({
          dueByToday,
          signal: controller.signal,
        })

        setTasks(loadedTasks)
        setRequestState('success')
      } catch (error) {
        if (error instanceof CanceledError || error?.name === 'AbortError') return

        setTasks([])
        setErrorMessage(resolveErrorMessage(error))
        setRequestState('error')
      }
    }

    loadTasks()

    return () => controller.abort()
  }, [dueByToday, reloadToken])

  return {
    errorMessage,
    reload,
    requestState,
    tasks,
  }
}
