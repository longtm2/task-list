import { useState } from 'react'
import Button from '../Button/Button'
import styles from './TaskAttachments.module.css'

function formatFileSize(byteSize) {
  if (byteSize < 1024) return `${byteSize} B`
  if (byteSize < 1024 * 1024) return `${Math.round(byteSize / 1024)} KB`

  return `${(byteSize / (1024 * 1024)).toFixed(1)} MB`
}

export default function TaskAttachments({
  actionErrorMessage,
  attachments,
  isSaving,
  onDelete,
  onUpload,
}) {
  const [file, setFile] = useState(null)

  async function handleUpload(event) {
    event.preventDefault()
    if (!file) return

    const form = event.currentTarget

    try {
      await onUpload(file)
      form.reset()
      setFile(null)
    } catch {
      // The page owns the user-facing error message.
    }
  }

  async function handleDelete(attachment) {
    if (!window.confirm(`Delete ${attachment.filename}?`)) return

    try {
      await onDelete(attachment)
    } catch {
      // The page owns the user-facing error message.
    }
  }

  return (
    <section className={styles.section} aria-labelledby="attachments-title">
      <div className={styles.heading}>
        <h3 id="attachments-title">Attachments</h3>
        <span>{attachments.length}</span>
      </div>

      <form className={styles.uploadForm} onSubmit={handleUpload}>
        <input
          type="file"
          aria-label="Supporting file"
          disabled={isSaving}
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
        <Button type="submit" variant="subtle" disabled={isSaving || !file}>
          Upload
        </Button>
      </form>

      {actionErrorMessage && <p className={styles.error} role="alert">{actionErrorMessage}</p>}

      {attachments.length > 0 && (
        <ul className={styles.list}>
          {attachments.map((attachment) => (
            <li key={attachment.id}>
              <a href={attachment.download_url}>{attachment.filename}</a>
              <span>{formatFileSize(attachment.byte_size)}</span>
              <Button
                type="button"
                variant="danger"
                disabled={isSaving}
                onClick={() => handleDelete(attachment)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
      {attachments.length === 0 && <p className={styles.empty}>No files attached.</p>}
    </section>
  )
}
