import httpClient from './httpClient'

function assertUser(data) {
  if (!data || typeof data !== 'object' || !data.id || !data.email) {
    throw new Error('Authentication API returned an unexpected response')
  }

  return data
}

export async function getCurrentUser({ signal } = {}) {
  const response = await httpClient.get('/v1/auth/me', { signal })

  return assertUser(response.data)
}

export async function signIn({ email, password }) {
  const response = await httpClient.post('/v1/auth/login', { email, password })

  return assertUser(response.data)
}

export async function signOut() {
  await httpClient.delete('/v1/auth/logout')
}
