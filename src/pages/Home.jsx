import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.module.css'

const PROJECTS = [
  {
    id: 'orbital',
    icon: '⊙',
    tag: 'Priority',
    tagColor: '#7c6af7',
    title: 'Orbital Mechanics Simulator',
    desc: 'Newtonian gravity with RK4 integration. Earth–Moon, binary stars, three-body chaos.',
    chips: ['RK4', 'Verlet', 'Euler', 'Energy plots'],
    color: '#7c6af7',
  },
  {
    id: 'em',
    icon: '⚡',
    tag: 'Building',
    tagColor: '#2dd4a0',
    title: 'E&M Field Visualizer',
    desc: 'Place charges, see field lines and equipotentials in real time via Coulomb\'s law.',
    chips: ['Field lines', 'Equipotentials', 'Lorentz force'],
    color: '#2dd4a0',
  },
  {
    id: 'waves',
    icon: '∿',
    tag: 'Planned',
    tagColor: '#f5a623',
    title: 'Wave & Oscillation Lab',
    desc: 'SHM, damping, resonance, double-slit interference, and Fourier synthesis.',
    chips: ['SHM', 'Fourier', 'Interference', 'Phase space'],
    color: '#f5a623',
  },
  {
    id: 'mechanics',
    icon: '◎',
    tag: 'Planned',
    tagColor: '#4a9ef5',
    title: 'Mechanics Toolkit',
    desc: 'Projectile with/without drag, elastic collisions with momentum readout.',
    chips: ['Projectile', 'Collisions', 'Drag', 'Conservation'],
    color: '#4a9ef5',
  },
]

const TEACHING_TOPICS = [
  { title: 'Why orbital velocity works', duration: '12 min', topic: 'Mechanics' },
  { title: "Intuition behind Maxwell's equations", duration: '15 min', topic: 'E&M' },
  { title: 'Chaos in the three-body problem', duration: '10 min', topic: 'Dynamics' },
  { title: 'What is resonance?', duration: '11 min', topic: 'Waves' },
  { title: 'Physics of black holes', duration: '14 min', topic: 'GR' },
]

function StarField({ canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.003 + 0.001,
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.a += s.speed
        const alpha = 0.2 + 0.5 * Math.abs(Math.sin(s.a))
        ctx.beginPath()
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, 2 * Math.PI)
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [canvasRef])
  return null
}

export default function Home() {
  const canvasRef = useRef(null)

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <canvas ref={canvasRef} className={styles.stars} />
        <StarField canvasRef={canvasRef} />

        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.dot} />
            Physics Educator · Computational STEM
          </div>

          <h1 className={styles.heroTitle}>
            Building tools that make<br />
            <em className={styles.heroAccent}>physics intuitive</em>
          </h1>

          <p className={styles.heroSub}>
            I design interactive simulations and conceptual teaching materials
            for A-Level, IB, and introductory undergraduate physics.
            Computation is how I make the invisible visible.
          </p>

          <div className={styles.heroBtns}>
            <Link to="/projects" className={styles.btnPrimary}>View simulations →</Link>
            <Link to="/teaching" className={styles.btnSecondary}>Teaching demos</Link>
          </div>

          <div className={styles.stack}>
            {['Python', 'NumPy', 'SciPy', 'React', 'p5.js', 'Streamlit'].map(t => (
              <span key={t} className={styles.stackTag}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        {[
          { n: '4', label: 'Physics simulators' },
          { n: '10+', label: 'Teaching demos' },
          { n: 'A-Level · IB', label: 'Curriculum coverage' },
          { n: 'RK4', label: 'Integration method' },
        ].map(s => (
          <div key={s.n} className={styles.statCell}>
            <div className={styles.statNum}>{s.n}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionEyebrow}>Interactive</div>
            <h2 className={styles.sectionTitle}>Simulation projects</h2>
          </div>
          <Link to="/projects" className={styles.seeAll}>See all →</Link>
        </div>

        <div className={styles.projectGrid}>
          {PROJECTS.map(p => (
            <Link to={`/sim/${p.id}`} key={p.id} className={styles.projectCard} style={{ '--card-accent': p.color }}>
              <div className={styles.cardTop}>
                <div className={styles.cardIcon} style={{ background: p.color + '18', color: p.color }}>{p.icon}</div>
                <span className={styles.cardTag} style={{ background: p.color + '18', color: p.color }}>{p.tag}</span>
              </div>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardDesc}>{p.desc}</p>
              <div className={styles.cardChips}>
                {p.chips.map(c => <span key={c} className={styles.chip}>{c}</span>)}
              </div>
              <div className={styles.cardArrow}>Open simulation →</div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionEyebrow}>Conceptual</div>
            <h2 className={styles.sectionTitle}>Teaching demos</h2>
          </div>
          <Link to="/teaching" className={styles.seeAll}>View all →</Link>
        </div>

        <div className={styles.teachingList}>
          {TEACHING_TOPICS.map((t, i) => (
            <Link to="/teaching" key={i} className={styles.teachingItem}>
              <div className={styles.teachingNum} style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)', fontSize: 13 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className={styles.teachingInfo}>
                <div className={styles.teachingTitle}>{t.title}</div>
                <div className={styles.teachingMeta}>{t.duration} · {t.topic}</div>
              </div>
              <div className={styles.teachingPlay}>▶</div>
            </Link>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>∇ PhysicsEd</div>
        <div className={styles.footerLinks}>
          <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          <a href="mailto:you@email.com">Email</a>
        </div>
        <div className={styles.footerNote}>Built with React · Deployed via GitHub Actions</div>
      </footer>
    </main>
  )
}
