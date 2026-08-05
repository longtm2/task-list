import { useCallback, useEffect, useState } from 'react'
import { AuthContext } from './authContext'
import { getCurrentUser, signIn as signInRequest, signOut as signOutRequest } from '../services/authService'

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({ status: 'loading', user: null })

  const becomeUnauthenticated = useCallback(() => {
    setAuthState({ status: 'unauthenticated', user: null })
  }, [])

  useEffect(() => {
    let isMounted = true

    async function restoreSession() {
      try {
        const user = await getCurrentUser()

        if (isMounted) setAuthState({ status: 'authenticated', user })
      } catch {
        if (isMounted) becomeUnauthenticated()
      }
    }

    function handleUnauthenticated() {
      if (isMounted) becomeUnauthenticated()
    }

    window.addEventListener('task-list:unauthenticated', handleUnauthenticated)
    restoreSession()

    return () => {
      isMounted = false
      window.removeEventListener('task-list:unauthenticated', handleUnauthenticated)
    }
  }, [becomeUnauthenticated])

  const signIn = useCallback(async (credentials) => {
    const user = await signInRequest(credentials)

    setAuthState({ status: 'authenticated', user })
    return user
  }, [])

  const signOut = useCallback(async () => {
    try {
      await signOutRequest()
    } finally {
      becomeUnauthenticated()
    }
  }, [becomeUnauthenticated])

  return (
    <AuthContext.Provider value={{ ...authState, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
