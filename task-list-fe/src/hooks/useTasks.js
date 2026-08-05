import { useCallback, useEffect, useState } from 'react'
import { CanceledError } from 'axios'
import { getTasks } from '../services/tasksService'
import { resolveApiErrorMessage } from '../utils/apiErrors'

const DEFAULT_PAGINATION = {
  has_next: false,
  has_previous: false,
  page: 1,
  per_page: 10,
  total_count: 0,
  total_pages: 0,
}

export function useTasks({ dueByToday, dueFrom, dueTo, page, perPage, query, status }) {
  const [tasks, setTasks] = useState([])
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION)
  const [requestState, setRequestState] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  const loadTasks = useCallback(
    async ({ signal, silent = false } = {}) => {
      if (!silent) setRequestState('loading')
      setErrorMessage('')

      try {
        const loadedTasks = await getTasks({
          dueByToday,
          dueFrom,
          dueTo,
          page,
          perPage,
          query,
          signal,
          status,
        })

        setTasks(loadedTasks.tasks)
        setPagination(loadedTasks.pagination)
        setRequestState('success')
      } catch (error) {
        if (error instanceof CanceledError || error?.name === 'AbortError') return

        setTasks([])
        setPagination(DEFAULT_PAGINATION)
        setErrorMessage(resolveApiErrorMessage(error, 'Unable to load tasks'))
        setRequestState('error')
      }
    },
    [dueByToday, dueFrom, dueTo, page, perPage, query, status],
  )

  const reload = useCallback(() => {
    setReloadToken((current) => current + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    Promise.resolve().then(() => loadTasks({ signal: controller.signal }))

    return () => controller.abort()
  }, [loadTasks, reloadToken])

  return {
    errorMessage,
    pagination,
    reload,
    requestState,
    tasks,
  }
}
