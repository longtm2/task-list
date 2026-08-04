import { useState } from 'react'
import Button from '../Button/Button'
import { toApiDateTimeValue, toDateTimeLocalInputValue } from '../../utils/dateTime'
import styles from './TaskForm.module.css'

const emptyFormValues = {
  description: '',
  dueAt: '',
  title: '',
}

function buildFormValues(task) {
  if (!task) return emptyFormValues

  return {
    description: task.description ?? '',
    dueAt: toDateTimeLocalInputValue(task.due_at),
    title: task.title ?? '',
  }
}

export default function TaskForm({
  actionErrorMessage,
  isSaving,
  onCancel,
  onSubmit,
  submitLabel,
  task,
}) {
  const [formValues, setFormValues] = useState(() => buildFormValues(task))

  function handleChange(event) {
    const { name, value } = event.target
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      description: formValues.description.trim(),
      due_at: toApiDateTimeValue(formValues.dueAt),
      title: formValues.title.trim(),
    }

    try {
      await onSubmit(payload)
    } catch {
      // The page owns the user-facing error message.
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>Title</span>
        <input
          name="title"
          value={formValues.title}
          required
          maxLength={255}
          onChange={handleChange}
        />
      </label>

      <label className={styles.field}>
        <span>Description</span>
        <textarea
          name="description"
          value={formValues.description}
          required
          rows={8}
          onChange={handleChange}
        />
      </label>

      <label className={styles.field}>
        <span>Due date</span>
        <input
          name="dueAt"
          type="datetime-local"
          value={formValues.dueAt}
          required
          onChange={handleChange}
        />
      </label>

      {actionErrorMessage && <p className={styles.formError}>{actionErrorMessage}</p>}

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={isSaving}>
          {submitLabel}
        </Button>
        <Button type="button" variant="subtle" disabled={isSaving} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
