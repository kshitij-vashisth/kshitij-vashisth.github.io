import { useEffect, useRef, useState } from 'react'
import styles from './Sim.module.css'

export default function MechanicsSim() {
  const canvasRef = useRef(null)
  const tabRef = useRef('proj')
  const rafRef = useRef(null)
  const projRef = useRef(null) // stores active projectile simulation state
  const collRef = useRef(null) // stores active collision state

  const [tab, setTabState] = useState('proj')
  const [projParams, setProjParams] = useState({ angle: 45, speed: 60, drag: 0, gravity: 9.8 })
  const [collParams, setCollParams] = useState({ m1: 2, m2: 1, v1: 5 })
  const [projStats, setProjStats] = useState({ range: '—', height: '—', time: '—' })
  const [collStats, setCollStats] = useState({ momBefore: '—', momAfter: '—', keBefore: '—', keAfter: '—' })

  const setTab = (t) => {
    tabRef.current = t
    setTabState(t)
    projRef.current = null
    collRef.current = null
    cancelAnimationFrame(rafRef.current)
    drawBase()
  }

  const drawBase = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    ctx.fillStyle = '#0a0e1a'; ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(0, H - 44); ctx.lineTo(W, H - 44); ctx.stroke()
    // ground texture dots
    ctx.fillStyle = 'rgba(255,255,255,0.03)'
    for (let x = 0; x < W; x += 20) ctx.fillRect(x, H - 44, 1, H)
  }

  const launchProjectile = () => {
    cancelAnimationFrame(rafRef.current)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const GND = H - 44
    const { angle, speed, drag, gravity } = projRef.current?.params || projParams

    const rad = angle * Math.PI / 180
    const spd = speed * 0.55
    const g = gravity * 0.28
    const dc = drag * 0.0003

    // simulate both trajectories ahead of time
    const simulate = (withDrag) => {
      let x = 40, y = GND
      let vx = spd * Math.cos(rad), vy = -spd * Math.sin(rad)
      const pts = [{ x, y }]
      let maxH = 0, t = 0
      while (y <= GND + 2 || pts.length < 3) {
        const spd2 = Math.sqrt(vx * vx + vy * vy)
        const ax = withDrag ? -dc * spd2 * vx : 0
        const ay = g + (withDrag ? -dc * spd2 * vy : 0) * 0 + (withDrag ? dc * spd2 * Math.abs(vy) * (vy > 0 ? 1 : -1) : 0)
        const trueAy = g + (withDrag ? dc * spd2 * vy : 0) // drag opposes vy
        vx += ax * 0.15
        vy += (g + (withDrag ? dc * spd2 * (vy > 0 ? -1 : 1) * Math.abs(vy) / (spd2 + 1e-6) * (-1) : 0)) * 0.15
        // simpler: for drag, decelerate in direction of motion
        if (withDrag) {
          const s = Math.sqrt(vx * vx + vy * vy)
          vx -= dc * s * vx * 0.15
          vy = vy + g * 0.15 - dc * s * vy * 0.15
        } else {
          vy += g * 0.15
        }
        x += vx * 0.15; y += vy * 0.15
        pts.push({ x, y })
        if (y < GND && (GND - y) > maxH) maxH = GND - y
        t += 0.15
        if (x > W + 100 || pts.length > 4000) break
        if (y > GND && pts.length > 5) break
      }
      return { pts, maxH, landX: x, t }
    }

    const nd = simulate(false)
    const d = simulate(true)

    let frame = 0
    const maxFrames = Math.max(nd.pts.length, d.pts.length)

    const animate = () => {
      drawBase()

      // no-drag trail
      ctx.beginPath()
      for (let i = 0; i <= Math.min(frame, nd.pts.length - 1); i++) {
        const p = nd.pts[i]
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
      }
      ctx.strokeStyle = '#4af5c8'; ctx.lineWidth = 2; ctx.stroke()

      // drag trail
      ctx.beginPath()
      for (let i = 0; i <= Math.min(frame, d.pts.length - 1); i++) {
        const p = d.pts[i]
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
      }
      ctx.strokeStyle = '#f5a623'; ctx.lineWidth = 2; ctx.stroke()

      // balls
      if (frame < nd.pts.length) {
        const p = nd.pts[frame]
        ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI); ctx.fillStyle = '#4af5c8'; ctx.fill()
      }
      if (frame < d.pts.length) {
        const p = d.pts[frame]
        ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI); ctx.fillStyle = '#f5a623'; ctx.fill()
      }

      // legend
      ctx.font = '11px monospace'
      ctx.fillStyle = '#4af5c8'; ctx.fillRect(12, 12, 14, 3); ctx.fillText('No drag', 30, 20)
      ctx.fillStyle = '#f5a623'; ctx.fillRect(12, 24, 14, 3); ctx.fillText('With drag', 30, 32)

      // angle indicator
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(40, GND)
      ctx.lineTo(40 + 40 * Math.cos(rad), GND - 40 * Math.sin(rad)); ctx.stroke()
      ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '10px monospace'
      ctx.fillText(angle + '°', 48 + 40 * Math.cos(rad), GND - 40 * Math.sin(rad) - 4)

      frame += 4
      if (frame < maxFrames) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setProjStats({
          range: (nd.landX / 0.55).toFixed(0) + ' m',
          height: (nd.maxH / 0.28).toFixed(0) + ' m',
          time: (nd.pts.length * 0.15 * 0.028).toFixed(2) + ' s',
        })
      }
    }
    animate()
  }

  const startCollision = () => {
    cancelAnimationFrame(rafRef.current)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const { m1, m2, v1 } = collParams
    const v1i = v1 * 4.5

    let b1 = { x: 60, vx: v1i, m: m1, r: 10 + m1 * 6, color: '#f5c84a' }
    let b2 = { x: W - 100, vx: 0, m: m2, r: 10 + m2 * 6, color: '#f54a7a' }
    let collided = false

    setCollStats({
      momBefore: ((m1 * v1i) / 100).toFixed(2),
      momAfter: '—',
      keBefore: ((0.5 * m1 * v1i * v1i) / 1000).toFixed(2),
      keAfter: '—',
    })

    const animate = () => {
      const GND = H - 44
      ctx.fillStyle = '#0a0e1a'; ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, GND); ctx.lineTo(W, GND); ctx.stroke()

      b1.x += b1.vx * 0.14
      b2.x += b2.vx * 0.14

      // elastic collision
      if (!collided && b1.x + b1.r >= b2.x - b2.r && b1.vx > b2.vx) {
        const v1f = ((m1 - m2) / (m1 + m2)) * b1.vx + (2 * m2 / (m1 + m2)) * b2.vx
        const v2f = (2 * m1 / (m1 + m2)) * b1.vx + ((m2 - m1) / (m1 + m2)) * b2.vx
        b1.vx = v1f; b2.vx = v2f
        collided = true
        setCollStats(prev => ({
          ...prev,
          momAfter: ((m1 * v1f + m2 * v2f) / 100).toFixed(2),
          keAfter: ((0.5 * m1 * v1f * v1f + 0.5 * m2 * v2f * v2f) / 1000).toFixed(2),
        }))
        // flash
        ctx.fillStyle = 'rgba(255,255,200,0.15)'; ctx.fillRect(0, 0, W, H)
      }

      // wall bounces
      if (b1.x - b1.r < 0) { b1.x = b1.r; b1.vx *= -1 }
      if (b2.x + b2.r > W) { b2.x = W - b2.r; b2.vx *= -1 }

      const CY = GND - 40
      ;[b1, b2].forEach(b => {
        // shadow
        ctx.beginPath(); ctx.ellipse(b.x, GND - 2, b.r * 0.8, 4, 0, 0, 2 * Math.PI)
        ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fill()

        ctx.beginPath(); ctx.arc(b.x, CY, b.r, 0, 2 * Math.PI)
        const grd = ctx.createRadialGradient(b.x - b.r * 0.3, CY - b.r * 0.3, 2, b.x, CY, b.r)
        grd.addColorStop(0, b.color + 'cc')
        grd.addColorStop(1, b.color)
        ctx.fillStyle = grd; ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5; ctx.stroke()

        // mass label
        ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.font = `${Math.max(11, b.r - 3)}px monospace`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(`m=${b.m}`, b.x, CY)

        // velocity arrow
        if (Math.abs(b.vx) > 0.5) {
          const aLen = Math.sign(b.vx) * Math.min(50, Math.abs(b.vx) * 0.6)
          const ay = CY - b.r - 14
          ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2
          ctx.beginPath(); ctx.moveTo(b.x, ay); ctx.lineTo(b.x + aLen, ay); ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(b.x + aLen, ay)
          ctx.lineTo(b.x + aLen - Math.sign(aLen) * 7, ay - 4)
          ctx.lineTo(b.x + aLen - Math.sign(aLen) * 7, ay + 4)
          ctx.closePath(); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill()
        }
      })

      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'
      ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = '10px monospace'
      ctx.fillText('elastic collision — momentum conserved', 12, H - 10)

      rafRef.current = requestAnimationFrame(animate)
    }
    animate()
  }

  useEffect(() => {
    drawBase()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className={styles.sim}>
      <canvas ref={canvasRef} width={860} height={300} className={styles.canvas} />
      <div className={styles.controls}>
        <div className={styles.ctrlGroup}>
          <div className={styles.ctrlLabel}>Tool</div>
          <div className={styles.btnRow} style={{ marginBottom: 10 }}>
            <button className={`${styles.btn} ${tab === 'proj' ? styles.active : ''}`} onClick={() => setTab('proj')}>Projectile</button>
            <button className={`${styles.btn} ${tab === 'coll' ? styles.active : ''}`} onClick={() => setTab('coll')}>Collisions</button>
          </div>

          {tab === 'proj' && <>
            {[
              { label: 'Angle', key: 'angle', min: 5, max: 85, unit: '°' },
              { label: 'Speed', key: 'speed', min: 20, max: 100, unit: '' },
              { label: 'Drag coeff', key: 'drag', min: 0, max: 60, unit: '' },
              { label: 'Gravity', key: 'gravity', min: 1, max: 25, unit: ' m/s²', step: 0.1 },
            ].map(({ label, key, min, max, unit, step = 1 }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span className={styles.ctrlLabel} style={{ minWidth: 72 }}>{label}</span>
                <input type="range" className={styles.slider} min={min} max={max} step={step}
                  value={projParams[key]}
                  onChange={e => setProjParams(p => ({ ...p, [key]: +e.target.value }))} />
                <span className={styles.eval} style={{ fontSize: 11, minWidth: 38 }}>{projParams[key]}{unit}</span>
              </div>
            ))}
            <button className={`${styles.btn} ${styles.active}`} style={{ marginTop: 4 }}
              onClick={() => { projRef.current = { params: projParams }; launchProjectile() }}>
              ↗ Launch
            </button>
          </>}

          {tab === 'coll' && <>
            {[
              { label: 'Mass 1', key: 'm1', min: 1, max: 5, unit: ' kg' },
              { label: 'Mass 2', key: 'm2', min: 1, max: 5, unit: ' kg' },
              { label: 'Velocity 1', key: 'v1', min: 1, max: 10, unit: ' m/s' },
            ].map(({ label, key, min, max, unit }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span className={styles.ctrlLabel} style={{ minWidth: 72 }}>{label}</span>
                <input type="range" className={styles.slider} min={min} max={max}
                  value={collParams[key]}
                  onChange={e => setCollParams(p => ({ ...p, [key]: +e.target.value }))} />
                <span className={styles.eval} style={{ fontSize: 11, minWidth: 44 }}>{collParams[key]}{unit}</span>
              </div>
            ))}
            <button className={`${styles.btn} ${styles.active}`} style={{ marginTop: 4 }} onClick={startCollision}>
              ▶ Run
            </button>
          </>}
        </div>

        <div className={styles.ctrlGroup}>
          {tab === 'proj' && (
            <div className={styles.energyPanel} style={{ gridTemplateColumns: '1fr 1fr', gridColumn: 'unset' }}>
              <div className={styles.energyRow}><span className={styles.elabel}>Range (no drag)</span><span className={styles.eval}>{projStats.range}</span></div>
              <div className={styles.energyRow}><span className={styles.elabel}>Max height</span><span className={styles.eval}>{projStats.height}</span></div>
              <div className={styles.energyRow}><span className={styles.elabel}>Time of flight</span><span className={styles.eval}>{projStats.time}</span></div>
              <div className={styles.energyRow}><span className={styles.elabel}>Optimal angle</span><span className={styles.eval}>45°</span></div>
            </div>
          )}
          {tab === 'coll' && (
            <div className={styles.energyPanel} style={{ gridTemplateColumns: '1fr 1fr', gridColumn: 'unset' }}>
              <div className={styles.energyRow}><span className={styles.elabel}>Momentum before</span><span className={styles.eval}>{collStats.momBefore}</span></div>
              <div className={styles.energyRow}><span className={styles.elabel}>Momentum after</span><span className={styles.eval}>{collStats.momAfter}</span></div>
              <div className={styles.energyRow}><span className={styles.elabel}>KE before</span><span className={styles.eval}>{collStats.keBefore}</span></div>
              <div className={styles.energyRow}><span className={styles.elabel}>KE after</span><span className={styles.eval}>{collStats.keAfter}</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
