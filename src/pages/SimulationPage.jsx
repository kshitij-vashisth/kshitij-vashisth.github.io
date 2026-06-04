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
    icon: '⊙',
    component: OrbitalSim,
  },
  em: {
    title: 'E&M Field Visualizer',
    desc: "Coulomb's law · Field lines · Equipotentials",
    color: '#2dd4a0',
    icon: '⚡',
    component: EMSim,
  },
  waves: {
    title: 'Wave & Oscillation Lab',
    desc: 'SHM · Interference · Fourier synthesis',
    color: '#f5a623',
    icon: '∿',
    component: WaveSim,
  },
  mechanics: {
    title: 'Mechanics Toolkit',
    desc: 'Projectile motion · Elastic collisions · Conservation laws',
    color: '#4a9ef5',
    icon: '◎',
    component: MechanicsSim,
  },
}

const ORDER = ['orbital', 'em', 'waves', 'mechanics']

export default function SimulationPage() {
  const { id } = useParams()
  const meta = META[id]

  if (!meta) return (
    <main className={styles.main}>
      <p style={{ color: 'var(--text-2)', padding: '40px 0' }}>
        Simulation not found. <Link to="/projects" style={{ color: 'var(--accent)' }}>Go back</Link>
      </p>
    </main>
  )

  const Sim = meta.component
  const currentIndex = ORDER.indexOf(id)
  const prevId = ORDER[currentIndex - 1]
  const nextId = ORDER[currentIndex + 1]

  return (
    <main className={styles.main}>
      {/* Accent top bar */}
      <div style={{ height: 3, background: meta.color, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }} />

      <div className={styles.header}>
        <Link to="/projects" className={styles.back}>← All simulations</Link>

        <div className={styles.titleRow}>
          <div style={{
            width: 40, height: 40, borderRadius: 9,
            background: meta.color + '18', color: meta.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0,
          }}>
            {meta.icon}
          </div>
          <div>
            <h1 className={styles.title}>{meta.title}</h1>
            <div className={styles.desc} style={{ color: meta.color }}>{meta.desc}</div>
          </div>
        </div>
      </div>

      <div className={styles.simWrapper}>
        <Sim />
      </div>

      {/* Prev / Next nav */}
      {(prevId || nextId) && (
        <div className={styles.simNav}>
          {prevId ? (
            <Link to={`/sim/${prevId}`} className={styles.simNavBtn}>
              <span style={{ color: 'var(--text-3)' }}>←</span>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 2 }}>Previous</div>
                <div style={{ fontSize: 13 }}>{META[prevId].title}</div>
              </div>
            </Link>
          ) : <div />}

          {nextId ? (
            <Link to={`/sim/${nextId}`} className={`${styles.simNavBtn} ${styles.simNavRight}`}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 2 }}>Next</div>
                <div style={{ fontSize: 13 }}>{META[nextId].title}</div>
              </div>
              <span style={{ color: 'var(--text-3)' }}>→</span>
            </Link>
          ) : <div />}
        </div>
      )}
    </main>
  )
}