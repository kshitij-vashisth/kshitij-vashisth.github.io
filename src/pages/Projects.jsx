import { Link } from 'react-router-dom'
import styles from './Projects.module.css'

const SIMS = [
  {
    id: 'orbital',
    icon: '⊙',
    title: 'Orbital Mechanics Simulator',
    desc: 'Full Newtonian gravity with switchable Euler, Verlet, and RK4 integrators. Watch energy conservation break down with Euler and hold steady with RK4. Three preset systems: Earth–Moon–Sun, binary stars, and the chaotic figure-8 three-body orbit.',
    physics: ['F = Gm₁m₂/r²', 'RK4 integration', 'Conservation of energy'],
    chips: ['Gravitation', 'Differential equations', 'Numerical methods'],
    color: '#7c6af7',
    status: 'Live',
  },
  {
    id: 'em',
    icon: '⚡',
    title: 'E&M Field Visualizer',
    desc: 'Click to place positive or negative charges. Field vectors computed via Coulomb\'s law at every grid point. Field lines traced by stepping along the field gradient. Equipotential contours via marching squares. Toggle each layer independently.',
    physics: ['E = kq/r²', 'Superposition principle', 'Gauss\'s law'],
    chips: ['Electrostatics', 'Field lines', 'Equipotentials'],
    color: '#2dd4a0',
    status: 'Live',
  },
  {
    id: 'waves',
    icon: '∿',
    title: 'Wave & Oscillation Lab',
    desc: 'Three modules: SHM with real-time phase-space portrait, double-slit interference with animated wave propagation, and Fourier synthesis showing how square/sawtooth/triangle waves are built from harmonics.',
    physics: ['x(t) = A cos(ωt + φ)', 'Fourier series', 'Path difference = nλ'],
    chips: ['SHM', 'Wave optics', 'Fourier analysis'],
    color: '#f5a623',
    status: 'Live',
  },
  {
    id: 'mechanics',
    icon: '◎',
    title: 'Mechanics Toolkit',
    desc: 'Projectile motion with and without drag running simultaneously — directly compare range loss. Elastic collision simulator with live momentum and kinetic energy readout before and after. Adjust masses and initial velocities.',
    physics: ['p = mv', 'KE = ½mv²', 'F_drag = ½ρCdAv²'],
    chips: ['Projectile motion', 'Conservation laws', 'Elastic collisions'],
    color: '#4a9ef5',
    status: 'Live',
  },
]

export default function Projects() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.eyebrow}>Interactive simulations</div>
        <h1 className={styles.title}>Physics simulation projects</h1>
        <p className={styles.sub}>
          Each simulation is built from first principles — no physics libraries, just
          the equations. Click into any project to run it live.
        </p>
      </div>

      <div className={styles.grid}>
        {SIMS.map(s => (
          <Link to={`/sim/${s.id}`} key={s.id} className={styles.card} style={{ '--c': s.color }}>
            <div className={styles.cardLeft}>
              <div className={styles.cardIcon} style={{ background: s.color + '18', color: s.color }}>{s.icon}</div>
              <div>
                <div className={styles.cardMeta}>
                  <span className={styles.status} style={{ background: s.color + '18', color: s.color }}>{s.status}</span>
                  {s.chips.map(c => <span key={c} className={styles.chip}>{c}</span>)}
                </div>
                <h2 className={styles.cardTitle}>{s.title}</h2>
                <p className={styles.cardDesc}>{s.desc}</p>
                <div className={styles.equations}>
                  {s.physics.map(eq => (
                    <code key={eq} className={styles.eq}>{eq}</code>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.cardArrow} style={{ color: s.color }}>Open →</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
