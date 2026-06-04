import { useEffect, useRef, useState } from 'react'
import styles from './Sim.module.css'

export default function WaveSim() {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const tRef = useRef(0)
  const tabRef = useRef('shm')
  const paramsRef = useRef({ amp: 60, freq: 2, damp: 0, force: 0, sep: 100, wl: 50, harmonics: 4, waveType: 'square' })

  const [tab, setTabState] = useState('shm')
  const [params, setParamsState] = useState({ amp: 60, freq: 2, damp: 0, force: 0, sep: 100, wl: 50, harmonics: 4 })
  const [waveType, setWaveTypeState] = useState('square')
  const [liveStats, setLiveStats] = useState({ x: 0, v: 0 })

  const setTab = (t) => { tabRef.current = t; setTabState(t) }
  const updateParam = (key, val) => {
    paramsRef.current[key] = val
    setParamsState(p => ({ ...p, [key]: val }))
  }
  const setWaveType = (w) => { paramsRef.current.waveType = w; setWaveTypeState(w) }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height

    const drawSHM = () => {
      const { amp, freq, damp, force } = paramsRef.current
      const f = freq * 0.5
      const d = damp * 0.003
      const t = tRef.current
      const mid = H / 2

      ctx.fillStyle = '#05071a'; ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(W, mid); ctx.stroke()
      // grid lines
      for (let i = 1; i < 4; i++) {
        ctx.beginPath(); ctx.moveTo(0, mid - amp * i / 4); ctx.lineTo(W, mid - amp * i / 4); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(0, mid + amp * i / 4); ctx.lineTo(W, mid + amp * i / 4); ctx.stroke()
      }

      // wave trail
      ctx.beginPath()
      for (let px = 0; px < W; px++) {
        const tt = t - (W - px) * 0.008
        const decay = Math.exp(-d * (W - px) * 0.01)
        const y = amp * decay * Math.sin(2 * Math.PI * f * tt) + (force > 0 ? force * 0.4 * Math.sin(2 * Math.PI * 1.15 * f * tt) : 0)
        px === 0 ? ctx.moveTo(px, mid - y) : ctx.lineTo(px, mid - y)
      }
      ctx.strokeStyle = '#4af5c8'; ctx.lineWidth = 2; ctx.stroke()

      // Phase space inset
      const psX = W - 140, psY = 16, psS = 120
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(psX, psY, psS, psS)
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.strokeRect(psX, psY, psS, psS)
      ctx.strokeStyle = '#7c6af7'; ctx.lineWidth = 1.5; ctx.beginPath()
      for (let i = 0; i < 250; i++) {
        const tt2 = t - i * 0.012
        const d2 = Math.exp(-d * i * 0.12)
        const x2 = amp * d2 * Math.sin(2 * Math.PI * f * tt2)
        const v2 = amp * 2 * Math.PI * f * d2 * Math.cos(2 * Math.PI * f * tt2)
        const px2 = psX + psS / 2 + x2 * (psS / 2 / 90)
        const py2 = psY + psS / 2 - v2 * (psS / 2 / (amp * f * 7 + 0.1))
        i === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2)
      }
      ctx.stroke()
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '10px monospace'
      ctx.fillText('phase space', psX + 4, psY + psS - 5)

      // current dot
      const curY = amp * Math.sin(2 * Math.PI * f * t)
      const curV = amp * 2 * Math.PI * f * Math.cos(2 * Math.PI * f * t)
      ctx.beginPath(); ctx.arc(W - 2, mid - curY, 5, 0, 2 * Math.PI)
      ctx.fillStyle = '#4af5c8'; ctx.fill()

      if (Math.floor(t * 60) % 4 === 0) setLiveStats({ x: curY.toFixed(1), v: curV.toFixed(1) })
    }

    const drawInterference = () => {
      const { sep, wl } = paramsRef.current
      const t = tRef.current
      ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, W, H)
      const s1x = W / 3, s1y = H / 2 - sep / 2
      const s2x = W / 3, s2y = H / 2 + sep / 2

      const id = ctx.createImageData(W, H)
      for (let y = 0; y < H; y++) {
        for (let x = Math.floor(W / 3); x < W; x++) {
          const r1 = Math.sqrt((x - s1x) ** 2 + (y - s1y) ** 2)
          const r2 = Math.sqrt((x - s2x) ** 2 + (y - s2y) ** 2)
          const amp = (Math.cos(2 * Math.PI * r1 / wl - t * 3) + Math.cos(2 * Math.PI * r2 / wl - t * 3)) * 0.5
          const c = Math.floor(128 + amp * 115)
          const idx = (y * W + x) * 4
          id.data[idx] = Math.floor(c * 0.35); id.data[idx + 1] = Math.floor(c * 0.75); id.data[idx + 2] = c; id.data[idx + 3] = 210
        }
      }
      ctx.putImageData(id, 0, 0)

      // draw barrier
      ctx.fillStyle = 'rgba(255,255,255,0.08)'
      ctx.fillRect(W / 3 - 3, 0, 6, H / 2 - sep / 2 - 12)
      ctx.fillRect(W / 3 - 3, H / 2 + sep / 2 + 12, 6, H - (H / 2 + sep / 2 + 12))

      ;[s1y, s2y].forEach((sy, i) => {
        ctx.beginPath(); ctx.arc(s1x, sy, 8, 0, 2 * Math.PI)
        ctx.fillStyle = '#f5c84a'; ctx.fill()
        ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '11px monospace'
        ctx.fillText(`S${i + 1}`, s1x + 12, sy + 4)
      })
    }

    const drawFourier = () => {
      const { harmonics, waveType } = paramsRef.current
      const t = tRef.current
      ctx.fillStyle = '#05071a'; ctx.fillRect(0, 0, W, H)
      const mid = H / 2, scale = 80

      ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(W, mid); ctx.stroke()

      const target = (x) => {
        const p = x % (2 * Math.PI)
        if (waveType === 'square') return p < Math.PI ? 1 : -1
        if (waveType === 'sawtooth') return p / Math.PI - 1
        return p < Math.PI ? 2 * p / Math.PI - 1 : 3 - 2 * p / Math.PI
      }

      // target (faint)
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1.5; ctx.beginPath()
      for (let px = 0; px < W; px++) {
        const x = px / W * 4 * Math.PI + t
        px === 0 ? ctx.moveTo(px, mid - target(x) * scale) : ctx.lineTo(px, mid - target(x) * scale)
      }
      ctx.stroke()

      // harmonics (colored)
      const colors = ['#7c6af7', '#f5c84a', '#4af5c8', '#f54a7a', '#4a9ef5', '#f5a623']
      for (let h = 1; h <= harmonics; h++) {
        const hk = waveType === 'square' ? 2 * h - 1 : h
        if (waveType === 'square' && h !== hk / (2 * h - 1)) { /* ok */ }
        const coeff = waveType === 'square'
          ? 4 / (Math.PI * (2 * h - 1))
          : waveType === 'sawtooth'
            ? (h % 2 === 0 ? -1 : 1) * 2 / (Math.PI * h)
            : h % 2 === 0 ? 0 : (h % 4 === 1 ? 1 : -1) * 8 / (Math.PI * Math.PI * h * h)
        ctx.strokeStyle = (colors[(h - 1) % colors.length]) + '55'
        ctx.lineWidth = 1; ctx.beginPath()
        for (let px = 0; px < W; px++) {
          const x = px / W * 4 * Math.PI + t
          const y = coeff * Math.sin(hk * x) * scale
          px === 0 ? ctx.moveTo(px, mid - y) : ctx.lineTo(px, mid - y)
        }
        ctx.stroke()
      }

      // sum (bright)
      ctx.strokeStyle = '#4af5c8'; ctx.lineWidth = 2.5; ctx.beginPath()
      for (let px = 0; px < W; px++) {
        const x = px / W * 4 * Math.PI + t
        let y = 0
        for (let h = 1; h <= harmonics; h++) {
          const hk = waveType === 'square' ? 2 * h - 1 : h
          const coeff = waveType === 'square'
            ? 4 / (Math.PI * (2 * h - 1))
            : waveType === 'sawtooth'
              ? (h % 2 === 0 ? -1 : 1) * 2 / (Math.PI * h)
              : h % 2 === 0 ? 0 : (h % 4 === 1 ? 1 : -1) * 8 / (Math.PI * Math.PI * h * h)
          y += coeff * Math.sin(hk * x) * scale
        }
        px === 0 ? ctx.moveTo(px, mid - y) : ctx.lineTo(px, mid - y)
      }
      ctx.stroke()

      ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = '11px monospace'
      ctx.fillText(`${harmonics} harmonic${harmonics > 1 ? 's' : ''} · ${waveType} wave`, 12, H - 12)
    }

    const loop = () => {
      tRef.current += 0.018
      const t = tabRef.current
      if (t === 'shm') drawSHM()
      else if (t === 'inter') drawInterference()
      else drawFourier()
      rafRef.current = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className={styles.sim}>
      <canvas ref={canvasRef} width={860} height={340} className={styles.canvas} />
      <div className={styles.controls}>
        <div className={styles.ctrlGroup}>
          <div className={styles.ctrlLabel}>Module</div>
          <div className={styles.btnRow}>
            <button className={`${styles.btn} ${tab === 'shm' ? styles.active : ''}`} onClick={() => setTab('shm')}>SHM</button>
            <button className={`${styles.btn} ${tab === 'inter' ? styles.active : ''}`} onClick={() => setTab('inter')}>Interference</button>
            <button className={`${styles.btn} ${tab === 'fourier' ? styles.active : ''}`} onClick={() => setTab('fourier')}>Fourier</button>
          </div>

          {tab === 'shm' && <>
            <div className={styles.ctrlLabel} style={{ marginTop: 8 }}>Amplitude</div>
            <div className={styles.btnRow} style={{ alignItems: 'center' }}>
              <input type="range" className={styles.slider} min="10" max="90" value={params.amp} step="1" onChange={e => updateParam('amp', +e.target.value)} />
              <span className={styles.eval}>{params.amp}</span>
            </div>
            <div className={styles.ctrlLabel}>Frequency</div>
            <div className={styles.btnRow} style={{ alignItems: 'center' }}>
              <input type="range" className={styles.slider} min="1" max="8" value={params.freq} step="1" onChange={e => updateParam('freq', +e.target.value)} />
              <span className={styles.eval}>{params.freq} Hz</span>
            </div>
            <div className={styles.ctrlLabel}>Damping</div>
            <div className={styles.btnRow} style={{ alignItems: 'center' }}>
              <input type="range" className={styles.slider} min="0" max="50" value={params.damp} step="1" onChange={e => updateParam('damp', +e.target.value)} />
              <span className={styles.eval}>{params.damp}</span>
            </div>
            <div className={styles.ctrlLabel}>Forcing</div>
            <div className={styles.btnRow} style={{ alignItems: 'center' }}>
              <input type="range" className={styles.slider} min="0" max="40" value={params.force} step="1" onChange={e => updateParam('force', +e.target.value)} />
              <span className={styles.eval}>{params.force}</span>
            </div>
          </>}

          {tab === 'inter' && <>
            <div className={styles.ctrlLabel} style={{ marginTop: 8 }}>Source separation</div>
            <div className={styles.btnRow} style={{ alignItems: 'center' }}>
              <input type="range" className={styles.slider} min="30" max="180" value={params.sep} step="1" onChange={e => updateParam('sep', +e.target.value)} />
              <span className={styles.eval}>{params.sep}</span>
            </div>
            <div className={styles.ctrlLabel}>Wavelength</div>
            <div className={styles.btnRow} style={{ alignItems: 'center' }}>
              <input type="range" className={styles.slider} min="20" max="100" value={params.wl} step="1" onChange={e => updateParam('wl', +e.target.value)} />
              <span className={styles.eval}>{params.wl}</span>
            </div>
          </>}

          {tab === 'fourier' && <>
            <div className={styles.ctrlLabel} style={{ marginTop: 8 }}>Harmonics</div>
            <div className={styles.btnRow} style={{ alignItems: 'center' }}>
              <input type="range" className={styles.slider} min="1" max="12" value={params.harmonics} step="1" onChange={e => updateParam('harmonics', +e.target.value)} />
              <span className={styles.eval}>{params.harmonics}</span>
            </div>
            <div className={styles.ctrlLabel}>Wave shape</div>
            <div className={styles.btnRow}>
              {['square', 'sawtooth', 'triangle'].map(w => (
                <button key={w} className={`${styles.btn} ${waveType === w ? styles.active : ''}`} onClick={() => setWaveType(w)}>{w}</button>
              ))}
            </div>
          </>}
        </div>

        <div className={styles.ctrlGroup}>
          {tab === 'shm' && (
            <div className={styles.energyPanel} style={{ gridTemplateColumns: '1fr 1fr', gridColumn: 'unset' }}>
              <div className={styles.energyRow}><span className={styles.elabel}>Displacement x</span><span className={styles.eval}>{liveStats.x}</span></div>
              <div className={styles.energyRow}><span className={styles.elabel}>Velocity v</span><span className={styles.eval}>{liveStats.v}</span></div>
              <div className={styles.energyRow}><span className={styles.elabel}>Equation</span><span className={styles.eval} style={{ fontSize: 11 }}>x = A cos(ωt)</span></div>
              <div className={styles.energyRow}><span className={styles.elabel}>Period T</span><span className={styles.eval}>{(1 / (params.freq * 0.5)).toFixed(2)} s</span></div>
            </div>
          )}
          {tab === 'inter' && (
            <div className={styles.energyPanel} style={{ gridTemplateColumns: '1fr', gridColumn: 'unset' }}>
              <div className={styles.energyRow}><span className={styles.elabel}>Constructive when</span><span className={styles.eval} style={{ fontSize: 11 }}>Δr = nλ</span></div>
              <div className={styles.energyRow}><span className={styles.elabel}>Destructive when</span><span className={styles.eval} style={{ fontSize: 11 }}>Δr = (n+½)λ</span></div>
              <div className={styles.energyRow}><span className={styles.elabel}>Fringe spacing ∝</span><span className={styles.eval} style={{ fontSize: 11 }}>λ / separation</span></div>
            </div>
          )}
          {tab === 'fourier' && (
            <div className={styles.energyPanel} style={{ gridTemplateColumns: '1fr', gridColumn: 'unset' }}>
              <div className={styles.energyRow}><span className={styles.elabel}>White line = sum</span><span className={styles.eval} style={{ fontSize: 11 }}>Σ aₙ sin(nωt)</span></div>
              <div className={styles.energyRow}><span className={styles.elabel}>Faint = target shape</span><span className={styles.eval} style={{ fontSize: 11 }}>{waveType} wave</span></div>
              <div className={styles.energyRow}><span className={styles.elabel}>Coloured = harmonics</span><span className={styles.eval} style={{ fontSize: 11 }}>n = 1 … {params.harmonics}</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
