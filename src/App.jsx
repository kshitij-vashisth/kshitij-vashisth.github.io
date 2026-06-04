import { HashRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import SimulationPage from './pages/SimulationPage.jsx'
import Teaching from './pages/Teaching.jsx'

export default function App() {
  return (
    <HashRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/sim/:id" element={<SimulationPage />} />
        <Route path="/teaching" element={<Teaching />} />
      </Routes>
    </HashRouter>
  )
}
