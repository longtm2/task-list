import { useState } from 'react'
import Button from '../../components/Button/Button'
import { useAuth } from '../../auth/useAuth'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useRouter } from '../../router/router'
import { resolveApiErrorMessage } from '../../utils/apiErrors'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const { signIn } = useAuth()
  const { navigate } = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useDocumentTitle('Sign in | Task list project')

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await signIn({ email: email.trim(), password })
      navigate('/tasks', { replace: true })
    } catch (error) {
      setErrorMessage(resolveApiErrorMessage(error, 'Unable to sign in'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel} aria-labelledby="sign-in-title">
        <p className={styles.project}>Task list project</p>
        <h1 id="sign-in-title">Sign in</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Email</span>
            <input
              autoComplete="email"
              type="email"
              value={email}
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className={styles.field}>
            <span>Password</span>
            <input
              autoComplete="current-password"
              type="password"
              value={password}
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {errorMessage && <p className={styles.error} role="alert">{errorMessage}</p>}
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            Sign in
          </Button>
        </form>
      </section>
    </main>
  )
}
