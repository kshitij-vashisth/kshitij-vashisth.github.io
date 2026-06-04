import { useEffect, useRef, useState } from 'react'
import styles from './Sim.module.css'

const G = 39.478

function makeBodies(scenario) {
  if (scenario === 'earth') return [
    { x: 0, y: 0, vx: 0, vy: 0, m: 1.0, r: 14, color: '#f5c84a', name: 'Sun' },
    { x: 1.0, y: 0, vx: 0, vy: 6.283, m: 3e-6, r: 5, color: '#4af5c8', name: 'Earth' },
    { x: 1.0027, y: 0, vx: 0, vy: 6.283 + 0.84, m: 3.7e-8, r: 3, color: '#c8c8c8', name: 'Moon' },
  ]
  if (scenario === 'binary') return [
    { x: -0.5, y: 0, vx: 0, vy: -3.14, m: 1.0, r: 12, color: '#f5c84a', name: 'Star A' },
    { x: 0.5, y: 0, vx: 0, vy: 3.14, m: 1.0, r: 12, color: '#f54a7a', name: 'Star B' },
    { x: 0, y: 1.8, vx: 5.5, vy: 0, m: 1e-4, r: 4, color: '#4af5c8', name: 'Planet' },
  ]
  return [
    { x: 0.97, y: -0.243, vx: -0.931, vy: -0.865, m: 1.0, r: 10, color: '#f5c84a', name: 'A' },
    { x: -0.97, y: 0.243, vx: -0.931, vy: -0.865, m: 1.0, r: 10, color: '#f54a7a', name: 'B' },
    { x: 0, y: 0, vx: 1.862, vy: 1.73, m: 1.0, r: 10, color: '#4af5c8', name: 'C' },
  ]
}

function accel(bs) {
  return bs.map((b, i) => {
    let ax = 0, ay = 0
    bs.forEach((o, j) => {
      if (i === j) return
      const dx = o.x - b.x, dy = o.y - b.y
      const r2 = dx * dx + dy * dy + 1e-6
      const r = Math.sqrt(r2)
      const f = G * o.m / r2
      ax += f * dx / r; ay += f * dy / r
    })
    return { ax, ay }
  })
}

function stepRK4(bodies, dt) {
  const snap = bodies.map(b => ({ ...b }))
  const deriv = (state) => state.map((b, i) => {
    let ax = 0, ay = 0
    state.forEach((o, j) => {
      if (i === j) return
      const dx = o.x - b.x, dy = o.y - b.y
      const r2 = dx * dx + dy * dy + 1e-6, r = Math.sqrt(r2)
      ax += G * o.m / r2 * dx / r; ay += G * o.m / r2 * dy / r
    })
    return { dx: b.vx, dy: b.vy, dvx: ax, dvy: ay }
  })
  const add = (s, d, h) => s.map((b, i) => ({ ...b, x: b.x + d[i].dx * h, y: b.y + d[i].dy * h, vx: b.vx + d[i].dvx * h, vy: b.vy + d[i].dvy * h }))
  const k1 = deriv(snap)
  const k2 = deriv(add(snap, k1, dt / 2))
  const k3 = deriv(add(snap, k2, dt / 2))
  const k4 = deriv(add(snap, k3, dt))
  return bodies.map((b, i) => ({
    ...b,
    x: snap[i].x + dt / 6 * (k1[i].dx + 2 * k2[i].dx + 2 * k3[i].dx + k4[i].dx),
    y: snap[i].y + dt / 6 * (k1[i].dy + 2 * k2[i].dy + 2 * k3[i].dy + k4[i].dy),
    vx: snap[i].vx + dt / 6 * (k1[i].dvx + 2 * k2[i].dvx + 2 * k3[i].dvx + k4[i].dvx),
    vy: snap[i].vy + dt / 6 * (k1[i].dvy + 2 * k2[i].dvy + 2 * k3[i].dvy + k4[i].dvy),
  }))
}

function stepEuler(bodies, dt) {
  const a = accel(bodies)
  return bodies.map((b, i) => ({
    ...b,
    vx: b.vx + a[i].ax * dt, vy: b.vy + a[i].ay * dt,
    x: b.x + (b.vx + a[i].ax * dt) * dt, y: b.y + (b.vy + a[i].ay * dt) * dt,
  }))
}

function stepVerlet(bodies, dt) {
  const a0 = accel(bodies)
  const mid = bodies.map((b, i) => ({ ...b, x: b.x + b.vx * dt + 0.5 * a0[i].ax * dt * dt, y: b.y + b.vy * dt + 0.5 * a0[i].ay * dt * dt }))
  const a1 = accel(mid)
  return mid.map((b, i) => ({ ...b, vx: bodies[i].vx + 0.5 * (a0[i].ax + a1[i].ax) * dt, vy: bodies[i].vy + 0.5 * (a0[i].ay + a1[i].ay) * dt }))
}

export default function OrbitalSim() {
  const canvasRef = useRef(null)
  const stateRef = useRef({ bodies: makeBodies('earth'), trails: [[], [], []], running: true, showTrail: true, method: 'rk4', scenario: 'earth', scale: 160, speedMult: 5 })
  const [, forceRender] = useState(0)
  const [energy, setEnergy] = useState({ ke: 0, pe: 0 })
  const [scenario, setScenarioState] = useState('earth')
  const [method, setMethodState] = useState('rk4')
  const [running, setRunning] = useState(true)
  const [trail, setTrail] = useState(true)
  const [speed, setSpeed] = useState(5)

  const setScenario = (s) => {
    const scales = { earth: 160, binary: 100, chaos: 90 }
    stateRef.current.bodies = makeBodies(s)
    stateRef.current.trails = stateRef.current.bodies.map(() => [])
    stateRef.current.scenario = s
    stateRef.current.scale = scales[s]
    setScenarioState(s)
  }

  const setMethod = (m) => { stateRef.current.method = m; setMethodState(m) }
  const togglePlay = () => { stateRef.current.running = !stateRef.current.running; setRunning(r => !r) }
  const toggleTrail = () => { stateRef.current.showTrail = !stateRef.current.showTrail; if (!stateRef.current.showTrail) stateRef.current.trails = stateRef.current.bodies.map(() => []); setTrail(t => !t) }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let fc = 0

    const frame = () => {
      const s = stateRef.current
      const W = canvas.width, H = canvas.height
      const CX = W / 2, CY = H / 2
      const dt = 0.0002

      if (s.running) {
        for (let i = 0; i < s.speedMult * 3; i++) {
          if (s.method === 'euler') s.bodies = stepEuler(s.bodies, dt)
          else if (s.method === 'verlet') s.bodies = stepVerlet(s.bodies, dt)
          else s.bodies = stepRK4(s.bodies, dt)
          if (s.showTrail && i === 0) {
            s.bodies.forEach((b, idx) => {
              s.trails[idx].push({ x: b.x, y: b.y })
              if (s.trails[idx].length > 500) s.trails[idx].shift()
            })
          }
        }
        fc++
        if (fc % 8 === 0) {
          let ke = 0, pe = 0
          s.bodies.forEach(b => { ke += 0.5 * b.m * (b.vx * b.vx + b.vy * b.vy) })
          for (let i = 0; i < s.bodies.length; i++) for (let j = i + 1; j < s.bodies.length; j++) {
            const dx = s.bodies[j].x - s.bodies[i].x, dy = s.bodies[j].y - s.bodies[i].y
            pe -= G * s.bodies[i].m * s.bodies[j].m / (Math.sqrt(dx * dx + dy * dy) + 1e-6)
          }
          setEnergy({ ke: ke.toFixed(3), pe: pe.toFixed(3), te: (ke + pe).toFixed(3) })
        }
      }

      ctx.fillStyle = '#05071a'; ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      for (let i = 0; i < 80; i++) {
        ctx.fillRect(((i * 137 + 11) * 1.618 % 1) * W, ((i * 97 + 7) * 2.718 % 1) * H, 1, 1)
      }

      const totalM = s.bodies.reduce((acc, b) => acc + b.m, 0)
      const comX = s.bodies.reduce((acc, b) => acc + b.m * b.x, 0) / totalM
      const comY = s.bodies.reduce((acc, b) => acc + b.m * b.y, 0) / totalM
      const toScreen = (x, y) => ({ sx: CX + (x - comX) * s.scale, sy: CY + (y - comY) * s.scale })

      if (s.showTrail) {
        s.bodies.forEach((b, idx) => {
          const tr = s.trails[idx]
          if (tr.length < 2) return
          ctx.beginPath()
          tr.forEach((p, i) => { const { sx, sy } = toScreen(p.x, p.y); i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy) })
          ctx.strokeStyle = b.color + '44'; ctx.lineWidth = 1; ctx.stroke()
        })
      }

      s.bodies.forEach(b => {
        const { sx, sy } = toScreen(b.x, b.y)
        ctx.beginPath(); ctx.arc(sx, sy, b.r, 0, 2 * Math.PI)
        ctx.fillStyle = b.color; ctx.fill()
        ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '10px monospace'
        ctx.fillText(b.name, sx + b.r + 3, sy + 4)
      })

      raf = requestAnimationFrame(frame)
    }

    frame()
    return () => cancelAnimationFrame(raf)
  }, [])

  const st = stateRef.current

  return (
    <div className={styles.sim}>
      <canvas ref={canvasRef} className={styles.canvas} width={860} height={400} />
      <div className={styles.controls}>
        <div className={styles.ctrlGroup}>
          <div className={styles.ctrlLabel}>Scenario</div>
          <div className={styles.btnRow}>
            {['earth', 'binary', 'chaos'].map(s => (
              <button key={s} className={`${styles.btn} ${scenario === s ? styles.active : ''}`} onClick={() => setScenario(s)}>
                {{ earth: 'Earth–Moon', binary: 'Binary stars', chaos: '3-body chaos' }[s]}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.ctrlGroup}>
          <div className={styles.ctrlLabel}>Integration</div>
          <div className={styles.btnRow}>
            {['euler', 'verlet', 'rk4'].map(m => (
              <button key={m} className={`${styles.btn} ${method === m ? styles.active : ''}`} onClick={() => setMethod(m)}>
                {{ euler: 'Euler', verlet: 'Verlet', rk4: 'RK4' }[m]}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.ctrlGroup}>
          <div className={styles.ctrlLabel}>Speed: {speed}×</div>
          <input type="range" min="1" max="20" value={speed} step="1" className={styles.slider}
            onChange={e => { const v = +e.target.value; setSpeed(v); stateRef.current.speedMult = v }} />
        </div>
        <div className={styles.ctrlGroup}>
          <div className={styles.btnRow}>
            <button className={styles.btn} onClick={togglePlay}>{running ? '⏸ Pause' : '▶ Play'}</button>
            <button className={styles.btn} onClick={toggleTrail}>{trail ? 'Trails: on' : 'Trails: off'}</button>
            <button className={styles.btn} onClick={() => setScenario(scenario)}>↺ Reset</button>
          </div>
        </div>
        <div className={styles.energyPanel}>
          <div className={styles.energyRow}><span className={styles.elabel}>KE</span><span className={styles.eval}>{energy.ke}</span></div>
          <div className={styles.energyRow}><span className={styles.elabel}>PE</span><span className={styles.eval}>{energy.pe}</span></div>
          <div className={styles.energyRow}><span className={styles.elabel}>Total E</span><span className={styles.eval}>{energy.te}</span></div>
        </div>
      </div>
    </div>
  )
}
