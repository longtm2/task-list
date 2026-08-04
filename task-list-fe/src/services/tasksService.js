import httpClient from './httpClient'

export async function getTasks({ dueByToday, signal } = {}) {
  const response = await httpClient.get('/v1/tasks', {
    params: dueByToday ? { due_by_today: true } : undefined,
    signal,
  })

  if (!Array.isArray(response.data)) {
    throw new Error('Task API returned an unexpected response')
  }

  return response.data
}
