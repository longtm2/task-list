import { useState } from 'react'
import { toast } from 'react-toastify'
import TaskForm from '../../components/TaskForm/TaskForm'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useRouter } from '../../router/router'
import { createTask } from '../../services/tasksService'
import { resolveApiErrorMessage } from '../../utils/apiErrors'
import styles from './CreateTaskPage.module.css'

export default function CreateTaskPage() {
  const { navigate } = useRouter()
  const [actionState, setActionState] = useState('idle')
  const [actionErrorMessage, setActionErrorMessage] = useState('')
  const isSaving = actionState === 'saving'

  useDocumentTitle('Create task | Task list project')

  async function handleSubmit(taskAttributes) {
    setActionState('saving')
    setActionErrorMessage('')

    try {
      const createdTask = await createTask(taskAttributes)

      toast.success(`TASK-${createdTask.id} created`)
      navigate(`/tasks/${createdTask.id}`)
    } catch (error) {
      setActionErrorMessage(resolveApiErrorMessage(error))
      throw error
    } finally {
      setActionState('idle')
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>Projects / Task list / New task</p>
        <h1>Create task</h1>
      </header>

      <section className={styles.panel}>
        <TaskForm
          actionErrorMessage={actionErrorMessage}
          isSaving={isSaving}
          submitLabel="Create"
          onCancel={() => navigate('/tasks')}
          onSubmit={handleSubmit}
        />
      </section>
    </main>
  )
}
