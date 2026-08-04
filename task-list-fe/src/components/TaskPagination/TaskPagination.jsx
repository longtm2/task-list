import Button from '../Button/Button'
import styles from './TaskPagination.module.css'

const PER_PAGE_OPTIONS = [5, 10, 20, 50]

export default function TaskPagination({ isLoading, onPageChange, onPerPageChange, pagination }) {
  const totalPages = Math.max(pagination.total_pages, 1)
  const page = Math.min(pagination.page, totalPages)
  const startItem = pagination.total_count === 0 ? 0 : (page - 1) * pagination.per_page + 1
  const endItem = Math.min(page * pagination.per_page, pagination.total_count)

  return (
    <nav className={styles.pagination} aria-label="Task pagination">
      <p>
        {startItem}-{endItem} of {pagination.total_count}
      </p>

      <label className={styles.perPage}>
        <span>Rows</span>
        <select
          value={pagination.per_page}
          disabled={isLoading}
          onChange={(event) => onPerPageChange(Number(event.target.value))}
        >
          {PER_PAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="subtle"
          disabled={isLoading || !pagination.has_previous}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <span className={styles.pageLabel}>
          Page {page} of {totalPages}
        </span>
        <Button
          type="button"
          variant="subtle"
          disabled={isLoading || !pagination.has_next}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </nav>
  )
}
