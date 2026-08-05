import { useState } from 'react'
import Button from '../Button/Button'
import styles from './TaskFilters.module.css'

const EMPTY_FILTERS = {
  dueByToday: false,
  dueFrom: '',
  dueTo: '',
  query: '',
  status: '',
}

export default function TaskFilters({ filters, isLoading, onApply, onClear }) {
  const [formValues, setFormValues] = useState(filters)

  function handleChange(event) {
    const { checked, name, type, value } = event.target
    setFormValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onApply({
      ...formValues,
      query: formValues.query.trim(),
    })
  }

  function handleClear() {
    setFormValues(EMPTY_FILTERS)
    onClear()
  }

  return (
    <form className={styles.filters} onSubmit={handleSubmit}>
      <label className={`${styles.field} ${styles.searchField}`}>
        <span>Search</span>
        <input
          name="query"
          type="search"
          value={formValues.query}
          placeholder="Search title or description"
          onChange={handleChange}
        />
      </label>
      <label className={styles.field}>
        <span>Status</span>
        <select name="status" value={formValues.status} onChange={handleChange}>
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
      </label>
      <label className={styles.field}>
        <span>Due from</span>
        <input name="dueFrom" type="date" value={formValues.dueFrom} onChange={handleChange} />
      </label>
      <label className={styles.field}>
        <span>Due to</span>
        <input name="dueTo" type="date" value={formValues.dueTo} onChange={handleChange} />
      </label>
      <label className={styles.todayToggle}>
        <input
          name="dueByToday"
          type="checkbox"
          checked={formValues.dueByToday}
          onChange={handleChange}
        />
        <span>Due by today</span>
      </label>
      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={isLoading}>
          Apply
        </Button>
        <Button type="button" variant="subtle" disabled={isLoading} onClick={handleClear}>
          Clear
        </Button>
      </div>
    </form>
  )
}
