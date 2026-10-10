import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import { JoinPage } from './pages/JoinPage'

const router = createBrowserRouter([
  { path: '/join/:slug', element: <JoinPage /> },
  {
    path: '*',
    element: (
      <main className="page">
        <header className="hero">
          <h1>Fidelify</h1>
          <p>Tarjetas de fidelidad que viven en el celular de tus clientes.</p>
        </header>
      </main>
    ),
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
