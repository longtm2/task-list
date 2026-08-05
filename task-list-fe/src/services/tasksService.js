import httpClient from './httpClient'

function assertTaskResponse(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Task API returned an unexpected response')
  }

  return data
}

function assertTasksCollectionResponse(data) {
  if (!data || typeof data !== 'object' || !Array.isArray(data.tasks)) {
    throw new Error('Task API returned an unexpected response')
  }

  return data
}

export async function getTasks({ dueByToday, dueFrom, dueTo, page, perPage, query, signal, status } = {}) {
  const params = {
    page,
    per_page: perPage,
  }

  if (dueByToday) {
    params.due_by_today = true
  }

  if (dueFrom) params.due_from = dueFrom
  if (dueTo) params.due_to = dueTo
  if (query) params.query = query
  if (status) params.status = status

  const response = await httpClient.get('/v1/tasks', {
    params,
    signal,
  })

  return assertTasksCollectionResponse(response.data)
}

export async function getTask(taskId, { signal } = {}) {
  const response = await httpClient.get(`/v1/tasks/${taskId}`, { signal })

  return assertTaskResponse(response.data)
}

export async function createTask(taskAttributes) {
  const response = await httpClient.post('/v1/tasks', {
    task: taskAttributes,
  })

  return assertTaskResponse(response.data)
}

export async function updateTask(taskId, taskAttributes) {
  const response = await httpClient.patch(`/v1/tasks/${taskId}`, {
    task: taskAttributes,
  })

  return assertTaskResponse(response.data)
}

export async function completeTask(taskId) {
  const response = await httpClient.patch(`/v1/tasks/${taskId}/complete`)

  return assertTaskResponse(response.data)
}

export async function deleteTask(taskId) {
  await httpClient.delete(`/v1/tasks/${taskId}`)
}

export async function uploadTaskAttachment(taskId, file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await httpClient.post(`/v1/tasks/${taskId}/attachments`, formData)

  return assertTaskResponse(response.data)
}

export async function deleteTaskAttachment(taskId, attachmentId) {
  await httpClient.delete(`/v1/tasks/${taskId}/attachments/${attachmentId}`)
}
