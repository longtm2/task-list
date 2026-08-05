import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../../components/Button/Button'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import TaskAttachments from '../../components/TaskAttachments/TaskAttachments'
import TaskForm from '../../components/TaskForm/TaskForm'
import { ErrorState, LoadingState } from '../../components/TaskListState/TaskListState'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useTask } from '../../hooks/useTask'
import { useRouter } from '../../router/router'
import { formatDateTime } from '../../utils/dateTime'
import { taskStatus } from '../../utils/taskStatus'
import { taskUserName } from '../../utils/taskUser'
import styles from './TaskDetailPage.module.css'

export default function TaskDetailPage({ taskId }) {
  const { navigate } = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const {
    actionErrorMessage,
    actionState,
    completeTask,
    deleteAttachment,
    deleteTask,
    errorMessage,
    reload,
    requestState,
    task,
    updateTask,
    uploadAttachment,
  } = useTask(taskId)
  const isSaving = actionState === 'saving'
  const titlePrefix = task ? `TASK-${task.id}` : 'Task detail'

  useDocumentTitle(
    isEditing && task
      ? `Edit TASK-${task.id} | Task list project`
      : `${titlePrefix} | Task list project`,
  )

  async function handleUpdate(taskAttributes) {
    const updatedTask = await updateTask(taskAttributes)

    toast.success(`TASK-${updatedTask.id} updated`)
    setIsEditing(false)
  }

  async function handleComplete() {
    const completedTask = await completeTask()

    toast.success(`TASK-${completedTask.id} completed`)
  }

  async function handleDelete() {
    if (!task) return
    if (!window.confirm(`Delete TASK-${task.id}?`)) return

    await deleteTask()
    toast.success(`TASK-${task.id} deleted`)
    navigate('/tasks')
  }

  async function handleUploadAttachment(file) {
    const attachment = await uploadAttachment(file)

    toast.success(`${attachment.filename} uploaded`)
  }

  async function handleDeleteAttachment(attachment) {
    await deleteAttachment(attachment.id)

    toast.success(`${attachment.filename} deleted`)
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p>Projects / Task list / {task ? `TASK-${task.id}` : 'Task detail'}</p>
          <h1>{isEditing ? 'Edit task' : task?.title || 'Task detail'}</h1>
        </div>
        <Button type="button" variant="subtle" onClick={() => navigate('/tasks')}>
          Back to list
        </Button>
      </header>

      {requestState === 'loading' && <LoadingState />}
      {requestState === 'error' && <ErrorState message={errorMessage} onRetry={reload} />}
      {requestState === 'success' && task && isEditing && (
        <section className={styles.panel}>
          <TaskForm
            key={task.updated_at}
            actionErrorMessage={actionErrorMessage}
            isSaving={isSaving}
            submitLabel="Save"
            task={task}
            onCancel={() => setIsEditing(false)}
            onSubmit={handleUpdate}
          />
        </section>
      )}
      {requestState === 'success' && task && !isEditing && (
        <section className={styles.panel}>
          <div className={styles.titleRow}>
            <div>
              <p className={styles.taskKey}>TASK-{task.id}</p>
              <h2>{task.title}</h2>
            </div>
            <StatusBadge status={taskStatus(task)} />
          </div>

          <dl className={styles.metaList}>
            <div>
              <dt>Due date</dt>
              <dd>{formatDateTime(task.due_at)}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{formatDateTime(task.created_at)}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{formatDateTime(task.updated_at)}</dd>
            </div>
            <div>
              <dt>Created by</dt>
              <dd>{taskUserName(task.created_by)}</dd>
            </div>
            <div>
              <dt>Completed by</dt>
              <dd>{taskUserName(task.completed_by, 'Not completed')}</dd>
            </div>
          </dl>

          <section className={styles.description}>
            <h3>Description</h3>
            <p>{task.description}</p>
          </section>

          <TaskAttachments
            actionErrorMessage={actionErrorMessage}
            attachments={task.attachments || []}
            isSaving={isSaving}
            onDelete={handleDeleteAttachment}
            onUpload={handleUploadAttachment}
          />

          <div className={styles.actions}>
            <Button type="button" variant="primary" disabled={isSaving} onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button type="button" disabled={isSaving || task.completed} onClick={handleComplete}>
              Complete
            </Button>
            <Button type="button" variant="danger" disabled={isSaving} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </section>
      )}
    </main>
  )
}
