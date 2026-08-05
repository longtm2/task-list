import { toast } from 'react-toastify'
import { useAuth } from '../../auth/useAuth'
import { useRouter } from '../../router/router'
import Button from '../Button/Button'
import styles from './AppHeader.module.css'

export default function AppHeader() {
  const { signOut, user } = useAuth()
  const { navigate } = useRouter()

  async function handleSignOut() {
    try {
      await signOut()
    } catch {
      toast.error('Unable to sign out. Your local session was cleared.')
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <header className={styles.header}>
      <button type="button" className={styles.brand} onClick={() => navigate('/tasks')}>
        Task list project
      </button>
      <div className={styles.account}>
        <div>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>
        <Button type="button" variant="subtle" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </header>
  )
}
