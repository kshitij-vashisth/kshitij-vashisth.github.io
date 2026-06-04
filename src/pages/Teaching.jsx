import { useEffect, useRef, useState } from 'react'
import styles from './Teaching.module.css'

// ✏️ Replace each videoUrl with your real YouTube link
const DEMOS = [
  { title: 'Laws of Motion-1', duration: '59 min', topic: 'Classical Mechanics', level: 'NEET', videoUrl: 'https://youtu.be/tYNlUXjGxuQ', desc: `Explains Newton's Laws of Motion in a simple, exam-focused way. Covers force, inertia, momentum, conservation of momentum, gravitational force, pseudo force, and their applications for Class 11 Physics, NEET, and JEE preparation.` },
  { title: 'Laws of Motion-2', duration: '118 min', topic: 'Classical Mechanics', level: 'NEET/JEE', videoUrl: 'https://youtu.be/5dHt9B7m3P4', desc: 'Builds advanced problem-solving skills using Newton\'s Laws of Motion. Covers free body diagrams, tension, pulley systems, springs, impulse, recoil, and rocket propulsion through intuitive reasoning and exam-focused applications for NEET and JEE.' },
  { title: 'Friction-1', duration: '93 min', topic: 'Classical Mechanics', level: 'NEET/JEE', videoUrl: 'https://youtu.be/Vtr3O6WgibU', desc: 'Builds a deep understanding of friction from everyday intuition to exam-level applications. Covers static, kinetic, and rolling friction, inclined planes, angle of friction, and problem-solving techniques essential for NEET and JEE mechanics.' },
  { title: 'Moment of Inertia', duration: '43 min', topic: 'Classical Mechanics', level: 'NEET', videoUrl: 'https://youtu.be/uLnWhKTcI9k', desc: 'Explores rotational inertia from first principles, showing how mass distribution affects rotational motion. Covers torque, moment of inertia, axis theorems, radius of gyration, and rolling motion with a strong focus on intuition and exam-oriented applications.' },
  { title: 'Basic Mathematics-1', duration: '100 min', topic: 'Mathematical Prerequisites', level: 'Conceptual', videoUrl: 'https://www.youtube.com/embed/kCdSfZ4oyh8?si=ulgZKaFsQWuKqw3z', desc: 'Builds the mathematical foundation required for Physics through a focused introduction to trigonometry. Covers identities, unit circle concepts, angle formulas, sign conventions, and problem-solving shortcuts essential for NEET, JEE, and CBSE Physics.' },
  { title: 'Why entropy increases (coming soon)', duration: 'NA', topic: 'Thermodynamics', level: 'A-Level / IB', videoUrl: null, desc: 'Statistical mechanics without the maths. Microstates, macrostates, and why the universe prefers disorder — illustrated with combinatorics.' },
]

const TOPICS = ['NEET', 'JEE', 'A-Level Physics', 'IB Physics', 'Classical Mechanics', 'Electromagnetism', 'Waves & Optics', 'Thermodynamics', 'Quantum Mechanics (intro)', 'Special Relativity (intro)']

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

function VideoModal({ demo, onClose }) {
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
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{demo.title}</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 2 }}>
              {demo.duration} · {demo.topic} · {demo.level}
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

        {/* Video */}
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
          <iframe
            ref={iframeRef}
            src={toEmbedUrl(demo.videoUrl)}
            title={demo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              border: 'none',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function Teaching() {
  const [activeDemo, setActiveDemo] = useState(null)

  return (
    <main className={styles.main}>
      {activeDemo && (
        <VideoModal demo={activeDemo} onClose={() => setActiveDemo(null)} />
      )}

      <div className={styles.header}>
        <div className={styles.eyebrow}>Conceptual teaching</div>
        <h1 className={styles.title}>Teaching demos</h1>
        <p className={styles.sub}>Short, polished conceptual lessons — internationally understandable, visually driven, curriculum-relevant.</p>
      </div>

      <div className={styles.philosophy}>
        <h2 className={styles.phTitle}>Teaching philosophy</h2>
        <p className={styles.phText}>
          Every lesson starts with a question a student would actually ask. I avoid
          formula-first teaching — instead, I build intuition, then show how the
          mathematics formalises what we already sense to be true. Computation and
          simulation are tools for making the abstract tangible.
        </p>
      </div>

      <div className={styles.demoGrid}>
        {DEMOS.map((d, i) => (
          <div
            key={i}
            className={styles.demoCard}
            onClick={() => d.videoUrl && setActiveDemo(d)}
            style={{ cursor: d.videoUrl ? 'pointer' : 'default' }}
          >
            <div className={styles.demoTop}>
              <div className={styles.demoNum}>{String(i + 1).padStart(2, '0')}</div>
              <div className={styles.demoBadges}>
                <span className={styles.topicBadge}>{d.topic}</span>
                <span className={styles.levelBadge}>{d.level}</span>
              </div>
            </div>
            <h3 className={styles.demoTitle}>{d.title}</h3>
            <p className={styles.demoDesc}>{d.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className={styles.demoDur}>{d.duration}</div>
              {d.videoUrl && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>▶ Watch</div>}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.curriculum}>
        <h2 className={styles.currTitle}>Curriculum familiarity</h2>
        <div className={styles.currGrid}>
          {TOPICS.map(t => (
            <div key={t} className={styles.currItem}>
              <span className={styles.checkmark}>✓</span>
              {t}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}