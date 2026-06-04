import styles from './Teaching.module.css'

const DEMOS = [
  { title: 'Why orbital velocity works', duration: '12 min', topic: 'Classical Mechanics', level: 'A-Level / IB', desc: 'Derives orbital speed from Newton\'s law of gravitation and circular motion. No calculus required — just the insight that gravity provides centripetal force.' },
  { title: "Intuition behind Maxwell's equations", duration: '15 min', topic: 'Electromagnetism', level: 'Undergraduate', desc: 'Each of the four Maxwell equations as a physical story. Gauss\'s law = charge creates field. Faraday\'s = changing B creates E. No vector calculus assumed.' },
  { title: 'Chaos in the three-body problem', duration: '10 min', topic: 'Classical Mechanics', level: 'A-Level / IB', desc: 'Why Newtonian mechanics can still produce unpredictable motion. Uses the live orbital simulator to demonstrate sensitivity to initial conditions.' },
  { title: 'What is resonance?', duration: '11 min', topic: 'Waves & Oscillations', level: 'A-Level / IB', desc: 'From a child on a swing to the Tacoma bridge. Builds intuition for driving frequency, natural frequency, and why small forces can cause large amplitude oscillations.' },
  { title: 'Physics of black holes', duration: '14 min', topic: 'General Relativity', level: 'Conceptual', desc: 'Escape velocity → Schwarzschild radius → spacetime curvature. Conceptual only — accessible to any curious student.' },
  { title: 'Why entropy increases', duration: '13 min', topic: 'Thermodynamics', level: 'A-Level / IB', desc: 'Statistical mechanics without the maths. Microstates, macrostates, and why the universe prefers disorder — illustrated with combinatorics.' },
]

const TOPICS = ['A-Level Physics', 'IB Physics', 'Classical Mechanics', 'Electromagnetism', 'Waves & Optics', 'Thermodynamics', 'Quantum Mechanics (intro)', 'Special Relativity (intro)']

export default function Teaching() {
  return (
    <main className={styles.main}>
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
          <div key={i} className={styles.demoCard}>
            <div className={styles.demoTop}>
              <div className={styles.demoNum}>{String(i + 1).padStart(2, '0')}</div>
              <div className={styles.demoBadges}>
                <span className={styles.topicBadge}>{d.topic}</span>
                <span className={styles.levelBadge}>{d.level}</span>
              </div>
            </div>
            <h3 className={styles.demoTitle}>{d.title}</h3>
            <p className={styles.demoDesc}>{d.desc}</p>
            <div className={styles.demoDur}>{d.duration}</div>
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
