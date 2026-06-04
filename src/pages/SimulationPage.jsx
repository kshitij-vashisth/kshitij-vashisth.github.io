import { useParams, Link } from 'react-router-dom'
import OrbitalSim from '../simulations/OrbitalSim.jsx'
import EMSim from '../simulations/EMSim.jsx'
import WaveSim from '../simulations/WaveSim.jsx'
import MechanicsSim from '../simulations/MechanicsSim.jsx'
import styles from './SimulationPage.module.css'

const META = {
  orbital: {
    title: 'Orbital Mechanics Simulator',
    desc: 'Newtonian gravity · RK4 integration · Energy conservation',
    color: '#7c6af7',
    component: OrbitalSim,
  },
  em: {
    title: 'E&M Field Visualizer',
    desc: "Coulomb's law · Field lines · Equipotentials",
    color: '#2dd4a0',
    component: EMSim,
  },
  waves: {
    title: 'Wave & Oscillation Lab',
    desc: 'SHM · Interference · Fourier synthesis',
    color: '#f5a623',
    component: WaveSim,
  },
  mechanics: {
    title: 'Mechanics Toolkit',
    desc: 'Projectile motion · Elastic collisions · Conservation laws',
    color: '#4a9ef5',
    component: MechanicsSim,
  },
}

export default function SimulationPage() {
  const { id } = useParams()
  const meta = META[id]

  if (!meta) return (
    <main className={styles.main}>
      <p>Simulation not found. <Link to="/projects">Go back</Link></p>
    </main>
  )

  const Sim = meta.component

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Link to="/projects" className={styles.back}>← All simulations</Link>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{meta.title}</h1>
          <div className={styles.desc} style={{ color: meta.color }}>{meta.desc}</div>
        </div>
      </div>
      <div className={styles.simWrapper}>
        <Sim />
      </div>
    </main>
  )
}
