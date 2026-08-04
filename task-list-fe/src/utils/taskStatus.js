export function taskStatus(task) {
  if (task.completed) return 'completed'
  if (task.overdue) return 'overdue'
  return 'open'
}

export function taskStatusLabel(status) {
  return {
    completed: 'Completed',
    overdue: 'Overdue',
    open: 'Open',
  }[status]
}
