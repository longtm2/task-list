import { useCallback, useEffect, useState } from 'react'
import { CanceledError } from 'axios'
import {
  completeTask as completeTaskRequest,
  deleteTask as deleteTaskRequest,
  getTask,
  updateTask as updateTaskRequest,
} from '../services/tasksService'
import { resolveApiErrorMessage } from '../utils/apiErrors'

export function useTask(taskId) {
  const [task, setTask] = useState(null)
  const [requestState, setRequestState] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [actionState, setActionState] = useState('idle')
  const [actionErrorMessage, setActionErrorMessage] = useState('')

  const loadTask = useCallback(
    async ({ signal } = {}) => {
      setRequestState('loading')
      setErrorMessage('')

      try {
        const loadedTask = await getTask(taskId, { signal })

        setTask(loadedTask)
        setRequestState('success')
      } catch (error) {
        if (error instanceof CanceledError || error?.name === 'AbortError') return

        setTask(null)
        setErrorMessage(resolveApiErrorMessage(error, 'Unable to open task'))
        setRequestState('error')
      }
    },
    [taskId],
  )

  useEffect(() => {
    const controller = new AbortController()
    Promise.resolve().then(() => loadTask({ signal: controller.signal }))

    return () => controller.abort()
  }, [loadTask])

  const updateTask = useCallback(
    async (taskAttributes) => {
      setActionState('saving')
      setActionErrorMessage('')

      try {
        const updatedTask = await updateTaskRequest(taskId, taskAttributes)

        setTask(updatedTask)
        return updatedTask
      } catch (error) {
        setActionErrorMessage(resolveApiErrorMessage(error))
        throw error
      } finally {
        setActionState('idle')
      }
    },
    [taskId],
  )

  const completeTask = useCallback(async () => {
    setActionState('saving')
    setActionErrorMessage('')

    try {
      const completedTask = await completeTaskRequest(taskId)

      setTask(completedTask)
      return completedTask
    } catch (error) {
      setActionErrorMessage(resolveApiErrorMessage(error))
      throw error
    } finally {
      setActionState('idle')
    }
  }, [taskId])

  const deleteTask = useCallback(async () => {
    setActionState('saving')
    setActionErrorMessage('')

    try {
      await deleteTaskRequest(taskId)
    } catch (error) {
      setActionErrorMessage(resolveApiErrorMessage(error))
      throw error
    } finally {
      setActionState('idle')
    }
  }, [taskId])

  return {
    actionErrorMessage,
    actionState,
    completeTask,
    deleteTask,
    errorMessage,
    reload: loadTask,
    requestState,
    task,
    updateTask,
  }
}
