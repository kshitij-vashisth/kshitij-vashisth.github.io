import { useEffect, useRef, useState, useCallback } from 'react'
import styles from './Sim.module.css'

const k = 1

function fieldAt(charges, x, y) {
  let ex = 0, ey = 0
  charges.forEach(c => {
    const dx = x - c.x, dy = y - c.y
    const r2 = dx * dx + dy * dy
    if (r2 < 100) return
    const r3 = Math.pow(r2, 1.5)
    ex += k * c.q * dx / r3
    ey += k * c.q * dy / r3
  })
  return { ex, ey }
}

function potentialAt(charges, x, y) {
  return charges.reduce((v, c) => {
    const dx = x - c.x, dy = y - c.y
    const r = Math.sqrt(dx * dx + dy * dy)
    return r < 8 ? v : v + k * c.q / r
  }, 0)
}

const PRESETS = {
  dipole: [{ x: 220, y: 170, q: 1 }, { x: 440, y: 170, q: -1 }],
  quad:   [{ x: 200, y: 130, q: 1 }, { x: 460, y: 130, q: -1 }, { x: 200, y: 210, q: -1 }, { x: 460, y: 210, q: 1 }],
  twopos: [{ x: 220, y: 170, q: 1 }, { x: 440, y: 170, q: 1 }],
}

export default function EMSim() {
  const canvasRef = useRef(null)
  const chargesRef = useRef(PRESETS.dipole.map(c => ({ ...c })))
  const modeRef = useRef('+')
  const showRef = useRef({ vec: true, lines: true, equip: true })

  const [mode, setMode] = useState('+')
  const [show, setShow] = useState({ vec: true, lines: true, equip: true })
  const [count, setCount] = useState(2)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const charges = chargesRef.current
    const s = showRef.current

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#050d1a'
    ctx.fillRect(0, 0, W, H)

    if (charges.length === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
      ctx.font = '13px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('Click canvas to place charges, or choose a preset', W / 2, H / 2)
      ctx.textAlign = 'left'
      return
    }

    // Equipotentials via marching squares
    if (s.equip) {
      const step = 14
      const levels = [-3, -2, -1.5, -1, -0.6, -0.3, 0.3, 0.6, 1, 1.5, 2, 3]
      levels.forEach(level => {
        const pts = []
        for (let x = 0; x < W; x += step) {
          for (let y = 0; y < H; y += step) {
            const corners = [
              [x, y], [x + step, y], [x, y + step], [x + step, y + step]
            ].map(([cx, cy]) => potentialAt(charges, cx, cy))
            const edges = [
              [corners[0], corners[1], x, y, x + step, y],
              [corners[0], corners[2], x, y, x, y + step],
              [corners[1], corners[3], x + step, y, x + step, y + step],
              [corners[2], corners[3], x, y + step, x + step, y + step],
            ]
            edges.forEach(([a, b, x1, y1, x2, y2]) => {
              if ((a - level) * (b - level) < 0) {
                const t = (level - a) / (b - a)
                pts.push([x1 + t * (x2 - x1), y1 + t * (y2 - y1)])
              }
            })
          }
        }
        if (pts.length === 0) return
        ctx.fillStyle = level > 0 ? 'rgba(255,100,80,0.45)' : 'rgba(80,160,255,0.45)'
        pts.forEach(([px, py]) => ctx.fillRect(px - 1, py - 1, 2, 2))
      })
    }

    // Field lines by tracing
    if (s.lines) {
      charges.forEach(c => {
        for (let i = 0; i < 14; i++) {
          const angle = (2 * Math.PI * i) / 14
          let x = c.x + 16 * Math.cos(angle)
          let y = c.y + 16 * Math.sin(angle)
          const dir = c.q > 0 ? 1 : -1
          ctx.beginPath()
          ctx.moveTo(x, y)
          for (let step = 0; step < 700; step++) {
            const { ex, ey } = fieldAt(charges, x, y)
            const mag = Math.sqrt(ex * ex + ey * ey)
            if (mag < 1e-6) break
            x += dir * 3 * ex / mag
            y += dir * 3 * ey / mag
            if (x < 0 || x > W || y < 0 || y > H) break
            ctx.lineTo(x, y)
            if (charges.some(ch => { const dx = x - ch.x, dy = y - ch.y; return dx * dx + dy * dy < 120 && ch !== c })) break
          }
          ctx.strokeStyle = 'rgba(120,180,255,0.45)'
          ctx.lineWidth = 1.2
          ctx.stroke()
        }
      })
    }

    // Field vectors on grid
    if (s.vec) {
      const gs = 38
      for (let x = gs / 2; x < W; x += gs) {
        for (let y = gs / 2; y < H; y += gs) {
          const { ex, ey } = fieldAt(charges, x, y)
          const mag = Math.sqrt(ex * ex + ey * ey)
          if (mag < 1e-6) continue
          const len = Math.min(16, 5 + 7 * Math.log1p(mag * 40))
          const nx = ex / mag, ny = ey / mag
          const alpha = Math.min(1, 0.15 + 0.7 * mag / (mag + 0.15))
          const ex2 = x + nx * len, ey2 = y + ny * len
          ctx.strokeStyle = `rgba(100,180,255,${alpha.toFixed(2)})`
          ctx.lineWidth = 1
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex2, ey2); ctx.stroke()
          const a = Math.atan2(ny, nx)
          ctx.beginPath()
          ctx.moveTo(ex2, ey2)
          ctx.lineTo(ex2 - 4 * Math.cos(a - 0.5), ey2 - 4 * Math.sin(a - 0.5))
          ctx.lineTo(ex2 - 4 * Math.cos(a + 0.5), ey2 - 4 * Math.sin(a + 0.5))
          ctx.closePath()
          ctx.fillStyle = `rgba(100,180,255,${alpha.toFixed(2)})`
          ctx.fill()
        }
      }
    }

    // Draw charges
    charges.forEach(c => {
      ctx.beginPath()
      ctx.arc(c.x, c.y, 11, 0, 2 * Math.PI)
      ctx.fillStyle = c.q > 0 ? '#f54a4a' : '#4a8af5'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 14px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(c.q > 0 ? '+' : '−', c.x, c.y + 1)
      ctx.textAlign = 'left'
      ctx.textBaseline = 'alphabetic'
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio || 860
      canvas.height = 360
      draw()
    }
    resize()
    draw()
  }, [draw])

  const handleClick = useCallback(e => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    chargesRef.current = [...chargesRef.current, { x, y, q: modeRef.current === '+' ? 1 : -1 }]
    setCount(chargesRef.current.length)
    draw()
  }, [draw])

  const setPreset = (p) => {
    chargesRef.current = PRESETS[p].map(c => ({ ...c }))
    setCount(chargesRef.current.length)
    draw()
  }

  const clearCharges = () => {
    chargesRef.current = []
    setCount(0)
    draw()
  }

  const toggleShow = (key) => {
    showRef.current = { ...showRef.current, [key]: !showRef.current[key] }
    setShow({ ...showRef.current })
    draw()
  }

  const changeMode = (m) => { modeRef.current = m; setMode(m) }

  return (
    <div className={styles.sim}>
      <canvas
        ref={canvasRef}
        width={860}
        height={360}
        className={styles.canvas}
        style={{ cursor: 'crosshair' }}
        onClick={handleClick}
      />
      <div className={styles.controls}>
        <div className={styles.ctrlGroup}>
          <div className={styles.ctrlLabel}>Add charge</div>
          <div className={styles.btnRow}>
            <button className={`${styles.btn} ${mode === '+' ? styles.active : ''}`} onClick={() => changeMode('+')}>+ positive</button>
            <button className={`${styles.btn} ${mode === '-' ? styles.active : ''}`} onClick={() => changeMode('-')}>− negative</button>
            <button className={styles.btn} onClick={clearCharges}>✕ clear</button>
          </div>
          <div className={styles.ctrlLabel} style={{ marginTop: 6 }}>Presets</div>
          <div className={styles.btnRow}>
            <button className={styles.btn} onClick={() => setPreset('dipole')}>Dipole</button>
            <button className={styles.btn} onClick={() => setPreset('quad')}>Quadrupole</button>
            <button className={styles.btn} onClick={() => setPreset('twopos')}>Two +</button>
          </div>
        </div>
        <div className={styles.ctrlGroup}>
          <div className={styles.ctrlLabel}>Layers (toggle)</div>
          <div className={styles.btnRow}>
            <button className={`${styles.btn} ${show.vec ? styles.active : ''}`} onClick={() => toggleShow('vec')}>Vectors</button>
            <button className={`${styles.btn} ${show.lines ? styles.active : ''}`} onClick={() => toggleShow('lines')}>Field lines</button>
            <button className={`${styles.btn} ${show.equip ? styles.active : ''}`} onClick={() => toggleShow('equip')}>Equipotentials</button>
          </div>
          <div className={styles.energyPanel} style={{ gridTemplateColumns: '1fr 1fr', gridColumn: 'unset', marginTop: 8 }}>
            <div className={styles.energyRow}>
              <span className={styles.elabel}>Charges placed</span>
              <span className={styles.eval}>{count}</span>
            </div>
            <div className={styles.energyRow}>
              <span className={styles.elabel}>Mode</span>
              <span className={styles.eval} style={{ color: mode === '+' ? '#f54a4a' : '#4a8af5' }}>{mode === '+' ? 'positive' : 'negative'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.hint}>Click the canvas to place a charge · Red = positive · Blue = negative</div>
    </div>
  )
}
