import { AxiosError } from 'axios'

function formatValidationErrors(errors) {
  return Object.entries(errors)
    .map(([field, messages]) => {
      const messageList = Array.isArray(messages) ? messages.join(', ') : String(messages)
      return `${field} ${messageList}`
    })
    .join('; ')
}

export function resolveApiErrorMessage(error, fallbackMessage = 'Unable to complete request') {
  if (error instanceof AxiosError && error.response) {
    const errors = error.response.data?.errors

    if (errors && typeof errors === 'object') {
      return formatValidationErrors(errors)
    }

    return `Task API returned ${error.response.status}`
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}
