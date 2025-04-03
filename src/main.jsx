import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MatrixRainingCode from './components/MatrixRainingCode.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{ position: 'absolute', width: '100vw', height: '100vh', zIndex: '-1'}}>
    <MatrixRainingCode/>
    </div>
    <App />
  </StrictMode>,
)
