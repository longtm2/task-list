import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './auth/AuthContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer
        autoClose={3500}
        closeOnClick
        draggable={false}
        hideProgressBar
        newestOnTop
        position="top-right"
        theme="light"
      />
    </AuthProvider>
  </StrictMode>,
)
