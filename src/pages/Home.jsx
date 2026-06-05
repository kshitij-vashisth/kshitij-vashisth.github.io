import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.module.css'
import OrbitalSim from '../simulations/OrbitalSim.jsx'
import EMSim from '../simulations/EMSim.jsx'
import WaveSim from '../simulations/WaveSim.jsx'
import MechanicsSim from '../simulations/MechanicsSim.jsx'
import KleinBottle from '../components/KleinBottle.jsx'

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
    desc: "Place charges, see field lines and equipotentials in real time via Coulomb's law.",
    chips: ['Field lines', 'Equipotentials', 'Lorentz force'],
    color: '#2dd4a0',
  },
  {
    id: 'waves',
    icon: '∿',
    tag: 'Live',
    tagColor: '#f5a623',
    title: 'Wave & Oscillation Lab',
    desc: 'SHM, damping, resonance, double-slit interference, and Fourier synthesis.',
    chips: ['SHM', 'Fourier', 'Interference', 'Phase space'],
    color: '#f5a623',
  },
  {
    id: 'mechanics',
    icon: '◎',
    tag: 'Live',
    tagColor: '#4a9ef5',
    title: 'Mechanics Toolkit',
    desc: 'Projectile with/without drag, elastic collisions with momentum readout.',
    chips: ['Projectile', 'Collisions', 'Drag', 'Conservation'],
    color: '#4a9ef5',
  },
]

const SIM_COMPONENTS = {
  orbital: OrbitalSim,
  em: EMSim,
  waves: WaveSim,
  mechanics: MechanicsSim,
}

const TEACHING_TOPICS = [
  { title: 'Laws of Motion-1', duration: '59 min', topic: 'Dynamics', videoUrl: 'https://youtu.be/tYNlUXjGxuQ' },
  { title: 'Laws of Motion-2', duration: '118 min', topic: 'Dynamics', videoUrl: 'https://youtu.be/5dHt9B7m3P4' },
  { title: 'Friction-1', duration: '93 min', topic: 'Dynamics', videoUrl: 'https://youtu.be/Vtr3O6WgibU' },
  { title: 'Moment of Inertia', duration: '43 min', topic: 'Dynamics', videoUrl: 'https://youtu.be/uLnWhKTcI9k' },
  { title: 'Basic Mathematics-1', duration: '100 min', topic: 'Mathematical Prerequisites', videoUrl: 'https://www.youtube.com/embed/kCdSfZ4oyh8?si=ulgZKaFsQWuKqw3z' },
]

function toEmbedUrl(url) {
  try {
    const u = new URL(url)
    let videoId = u.searchParams.get('v')
    if (!videoId && u.hostname === 'youtu.be') videoId = u.pathname.slice(1)
    if (!videoId) return url
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`
  } catch {
    return url
  }
}

function StarField({ canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(), speed: Math.random() * 0.003 + 0.001,
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

function VideoModal({ topic, onClose }) {
  const iframeRef = useRef(null)
  const [closeHovered, setCloseHovered] = useState(false)

  const handleClose = () => {
    if (iframeRef.current) iframeRef.current.src = ''
    onClose()
  }

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.82)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          position: 'relative',
          width: 'min(860px, 92vw)',
          background: '#0f0f13',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{topic.title}</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 2 }}>
              {topic.duration} · {topic.topic}
            </div>
          </div>
          <button
            onClick={handleClose}
            onMouseEnter={() => setCloseHovered(true)}
            onMouseLeave={() => setCloseHovered(false)}
            style={{
              background: closeHovered ? '#e53e3e' : 'rgba(255,255,255,0.08)',
              border: 'none', cursor: 'pointer',
              color: '#fff', borderRadius: 6, width: 32, height: 32,
              fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s ease',
            }}
          >✕</button>
        </div>
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
          <iframe
            ref={iframeRef}
            src={toEmbedUrl(topic.videoUrl)}
            title={topic.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </div>
  )
}

function SimModal({ project, onClose }) {
  const [closeHovered, setCloseHovered] = useState(false)
  // Look up the actual React component for this simulation
  const SimComponent = SIM_COMPONENTS[project.id]

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: 'min(1100px, 95vw)',
          maxHeight: '90vh',
          background: '#0f0f13',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              background: project.color + '18', color: project.color,
              width: 30, height: 30, borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
            }}>
              {project.icon}
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{project.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 1 }}>
                {project.chips.join(' · ')}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link
              to={`/sim/${project.id}`}
              onClick={onClose}
              style={{
                color: project.color, fontSize: 12, textDecoration: 'none',
                background: project.color + '18', padding: '4px 10px',
                borderRadius: 5, fontWeight: 500,
              }}
            >
              Open full page ↗
            </Link>
            <button
              onClick={onClose}
              onMouseEnter={() => setCloseHovered(true)}
              onMouseLeave={() => setCloseHovered(false)}
              style={{
                background: closeHovered ? '#e53e3e' : 'rgba(255,255,255,0.08)',
                border: 'none', cursor: 'pointer',
                color: '#fff', borderRadius: 6, width: 32, height: 32,
                fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s ease',
              }}
            >✕</button>
          </div>
        </div>

        {/* Simulation rendered directly as a React component */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {SimComponent
            ? <SimComponent />
            : <div style={{ padding: 40, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                Simulation not found.
              </div>
          }
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const canvasRef = useRef(null)
  const [activeVideo, setActiveVideo] = useState(null)
  const [activeSim, setActiveSim] = useState(null)

  return (
    <main className={styles.main}>
      {activeVideo && (
        <VideoModal topic={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
      {activeSim && (
        <SimModal project={activeSim} onClose={() => setActiveSim(null)} />
      )}

      <section className={styles.hero}>
        <canvas ref={canvasRef} className={styles.stars} />
        <StarField canvasRef={canvasRef} />

        <div className={styles.heroInner}>
          {/* Klein bottle — desktop only, hidden on mobile via CSS */}
          <div className={styles.heroVisual}>
            <KleinBottle />
          </div>

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
              for NEET, JEE, A-Level, IB, and introductory undergraduate physics.
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
        </div>
      </section>

      <section className={styles.stats}>
        {[
          { n: '4', label: 'Physics simulators' },
          { n: '4+', label: 'Teaching demos' },
          { n: 'NEET/JEE · A-Level/IB (soon)', label: 'Curriculum coverage' },
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
            <div
              key={p.id}
              className={styles.projectCard}
              style={{ '--card-accent': p.color, cursor: 'pointer' }}
              onClick={() => setActiveSim(p)}
            >
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
            </div>
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
            <div
              key={i}
              className={styles.teachingItem}
              onClick={() => setActiveVideo(t)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.teachingNum} style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)', fontSize: 13 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className={styles.teachingInfo}>
                <div className={styles.teachingTitle}>{t.title}</div>
                <div className={styles.teachingMeta}>{t.duration} · {t.topic}</div>
              </div>
              <div className={styles.teachingPlay}>▶</div>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>∇ Ksshitij Vasshisth</div>
        <div className={styles.footerLinks}>
          <a href="https://github.com/kshitij-vashisth" target="_blank" rel="noreferrer">GitHub</a>
          <a href="mailto:kkshitijvasshisth@email.com">Email</a>
        </div>
        <div className={styles.footerNote}>Built with React · Deployed via GitHub Actions</div>
      </footer>
    </main>
  )
}