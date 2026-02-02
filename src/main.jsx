/* main.jsx */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import LandingPage from './landing.jsx'
import ContentPage from './content.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/content',
    element: <ContentPage />
  }
]);

  createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
