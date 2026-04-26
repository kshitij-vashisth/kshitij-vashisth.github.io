import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function rnd(a, b) { return a + Math.random() * (b - a) }

function buildNeuron(position, id) {
  const dendrites = Array.from({ length: Math.floor(rnd(5, 9)) }, (_, i) => {
    const base = (i / 8) * Math.PI * 2 + rnd(-0.3, 0.3)
    const segs = Math.floor(rnd(2, 5))
    let pts = [new THREE.Vector3(0, 0, 0)]
    let cx = 0, cy = 0, cz = 0, ang = base
    for (let s = 0; s < segs; s++) {
      ang += rnd(-0.5, 0.5)
      const len = rnd(1.2, 3.2)
      const tilt = rnd(-0.4, 0.4)
      cx += Math.cos(ang) * len
      cy += Math.sin(ang) * len
      cz += Math.sin(tilt) * len * 0.4
      pts.push(new THREE.Vector3(cx, cy, cz))
    }
    return pts
  })
  return {
    id, position,
    radius: rnd(0.6, 1.0),
    potential: 0,
    firing: false,
    fireTime: 0,
    refract: 0,
    dendrites,
    hue: rnd(140, 170),
  }
}

function buildSynapses(neurons) {
  const synapses = []
  for (let i = 0; i < neurons.length; i++) {
    const sorted = [...neurons].sort((a, b) =>
      a.position.distanceTo(neurons[i].position) -
      b.position.distanceTo(neurons[i].position)
    )
    const targets = sorted.slice(1, Math.floor(rnd(2, 4)))
    for (const t of targets) {
      if (!synapses.find(s => s.from === i && s.to === t.id) && t.id !== i) {
        synapses.push({
          from: i, to: t.id,
          weight: rnd(0.3, 1.0),
          excitatory: Math.random() > 0.2,
          myelinSegs: Math.floor(rnd(3, 7)),
        })
      }
    }
  }
  return synapses
}

function DendriteLine({ points, color, opacity }) {
  const geo = React.useMemo(() =>
    new THREE.BufferGeometry().setFromPoints(points), [points])
  return (
    <line geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  )
}

function AxonCurve({ from, to, excitatory, active }) {
  const geo = React.useMemo(() => {
    const mid = new THREE.Vector3(
      (from.x + to.x) / 2 + (to.y - from.y) * 0.18,
      (from.y + to.y) / 2 - (to.x - from.x) * 0.18,
      (from.z + to.z) / 2 + rnd(-1, 1)
    )
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to)
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(30))
  }, [from, to])
  return (
    <line geometry={geo}>
      <lineBasicMaterial
        color={excitatory ? '#20ff80' : '#ff4444'}
        transparent
        opacity={active ? 0.45 : 0.12}
      />
    </line>
  )
}

function MyelinNode({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.15, 6, 6]} />
      <meshBasicMaterial color="#90ffcc" transparent opacity={0.35} />
    </mesh>
  )
}

function Pulse({ from, to, t, excitatory }) {
  const pos = React.useMemo(() => {
    const mid = new THREE.Vector3(
      (from.x + to.x) / 2 + (to.y - from.y) * 0.18,
      (from.y + to.y) / 2 - (to.x - from.x) * 0.18,
      (from.z + to.z) / 2
    )
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to)
    return curve.getPoint(Math.min(t, 1))
  }, [from, to, t])
  const alpha = Math.sin(Math.min(t, 1) * Math.PI)
  const color = excitatory ? '#20ff90' : '#ff6060'
  return (
    <group position={pos}>
      <mesh>
        <sphereGeometry args={[0.35 + 0.25 * alpha, 10, 10]} />
        <meshBasicMaterial color={color} transparent opacity={0.95 * alpha} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.7 + 0.4 * alpha, 10, 10]} />
        <meshBasicMaterial color={color} transparent opacity={0.35 * alpha} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.2 + 0.5 * alpha, 10, 10]} />
        <meshBasicMaterial color={color} transparent opacity={0.12 * alpha} />
      </mesh>
    </group>
  )
}

function NeuronMesh({ neuron, firing, potential, hovered }) {
  const coreRef = useRef()
  const glow1Ref = useRef()
  const glow2Ref = useRef()
  const glow3Ref = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = firing ? 1 : (0.4 + Math.sin(t * 2 + neuron.id) * 0.15) * potential
    const idleGlow = 0.25 + Math.sin(t * 1.5 + neuron.id * 0.7) * 0.1

    if (coreRef.current) {
      const s = firing ? 1 + Math.sin(t * 20) * 0.12 : 1
      coreRef.current.scale.setScalar(s)
      coreRef.current.material.opacity = firing ? 1.0 : 0.55 + idleGlow * 0.3
      coreRef.current.material.color.set(
        hovered ? '#ffffff' : firing ? '#e8ff60' : '#20ff80'
      )
    }
    if (glow1Ref.current) {
      glow1Ref.current.material.opacity = firing
        ? 0.55 + Math.sin(t * 20) * 0.2
        : idleGlow * 0.5 + potential * 0.3
    }
    if (glow2Ref.current) {
      glow2Ref.current.material.opacity = firing
        ? 0.3 + Math.sin(t * 20) * 0.1
        : idleGlow * 0.25 + potential * 0.15
    }
    if (glow3Ref.current) {
      glow3Ref.current.material.opacity = firing
        ? 0.15
        : idleGlow * 0.1
    }
  })

  const baseColor = hovered ? '#ffffff' : '#20ff80'
  const glowColor = hovered ? '#aaffdd' : '#20ff80'

  return (
    <group position={neuron.position}>
      <mesh ref={glow3Ref}>
        <sphereGeometry args={[neuron.radius * 4.5, 12, 12]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.08} />
      </mesh>
      <mesh ref={glow2Ref}>
        <sphereGeometry args={[neuron.radius * 2.8, 12, 12]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.18} />
      </mesh>
      <mesh ref={glow1Ref}>
        <sphereGeometry args={[neuron.radius * 1.8, 12, 12]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.35} />
      </mesh>
      <mesh ref={coreRef}>
        <sphereGeometry args={[neuron.radius, 16, 16]} />
        <meshBasicMaterial color={baseColor} transparent opacity={0.75} />
      </mesh>
      <mesh>
        <sphereGeometry args={[neuron.radius * 0.45, 10, 10]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

const NEURON_COUNT = 12
const SPREAD = 20

function Network({ hoveredId, onHover }) {
  const stateRef = useRef(null)
  const pulsesRef = useRef([])
  const [, forceUpdate] = useState(0)
  const tickRef = useRef(0)
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2(-9999, -9999))

  if (!stateRef.current) {
    const neurons = Array.from({ length: NEURON_COUNT }, (_, i) =>
      buildNeuron(
        new THREE.Vector3(
          rnd(-SPREAD, SPREAD),
          rnd(-SPREAD, SPREAD),
          rnd(-SPREAD, SPREAD)
        ), i
      )
    )
    stateRef.current = { neurons, synapses: buildSynapses(neurons) }
    setTimeout(() => {
      for (const n of stateRef.current.neurons) {
        setTimeout(() => triggerFireDirect(n, stateRef.current.synapses, pulsesRef), rnd(0, 1200))
      }
    }, 300)
  }

  const { neurons, synapses } = stateRef.current

  function triggerFireDirect(n, syns, pRef) {
    if (n.firing || n.refract > 0) return
    n.firing = true; n.fireTime = 0; n.potential = 1
    setTimeout(() => {
      for (const syn of syns.filter(s => s.from === n.id)) {
        pRef.current.push({ syn, t: 0, speed: rnd(0.4, 0.9), delivered: false })
      }
    }, 60)
  }

  function triggerFire(n) {
    triggerFireDirect(n, synapses, pulsesRef)
  }

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.05)
    const ns = stateRef.current.neurons

    for (const p of pulsesRef.current) {
      p.t += dt * p.speed * 1.2
      if (!p.delivered && p.t >= 1) {
        p.delivered = true
        const tgt = ns[p.syn.to]
        if (tgt.refract <= 0) {
          const d = p.syn.excitatory ? p.syn.weight * 0.5 : -p.syn.weight * 0.3
          tgt.potential = Math.max(0, Math.min(1, tgt.potential + d))
          if (tgt.potential >= 0.55) triggerFire(tgt)
        }
      }
    }
    pulsesRef.current = pulsesRef.current.filter(p => p.t < 1.4)

    for (const n of ns) {
      if (n.firing) {
        n.fireTime += dt
        if (n.fireTime > 0.35) { n.firing = false; n.potential = 0; n.refract = 0.7 }
      }
      if (n.refract > 0) n.refract = Math.max(0, n.refract - dt)
      if (!n.firing && n.refract <= 0) {
        n.potential = Math.max(0, n.potential - dt * 0.12)
        if (n.potential < 0.05 && Math.random() < dt * 0.4) {
          triggerFire(n)
        }
      }
    }

    tickRef.current++
    if (tickRef.current % 3 === 0) forceUpdate(c => c + 1)
  })

  const getMyelinPositions = (syn) => {
    const from = neurons[syn.from].position
    const to = neurons[syn.to].position
    const mid = new THREE.Vector3(
      (from.x + to.x) / 2 + (to.y - from.y) * 0.18,
      (from.y + to.y) / 2 - (to.x - from.x) * 0.18,
      (from.z + to.z) / 2
    )
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to)
    return Array.from({ length: syn.myelinSegs }, (_, i) =>
      curve.getPoint((i + 1) / (syn.myelinSegs + 1))
    )
  }

  const activeSynapses = hoveredId !== null
    ? synapses.filter(s => s.from === hoveredId || s.to === hoveredId)
    : synapses

  return (
    <>
      {synapses.map((syn, i) => (
        <group key={`syn-${i}`}>
          <AxonCurve
            from={neurons[syn.from].position}
            to={neurons[syn.to].position}
            excitatory={syn.excitatory}
            active={activeSynapses.includes(syn)}
          />
          {getMyelinPositions(syn).map((pos, j) => (
            <MyelinNode key={j} position={pos} />
          ))}
        </group>
      ))}

      {neurons.map(n => (
        <group key={`n-${n.id}`}>
          {n.dendrites.map((pts, di) => (
            <DendriteLine
              key={di}
              points={pts.map(p => new THREE.Vector3(
                n.position.x + p.x,
                n.position.y + p.y,
                n.position.z + p.z
              ))}
              color={n.firing ? '#e8ff60' : '#20ff80'}
              opacity={n.firing ? 0.7 : 0.2 + n.potential * 0.35}
            />
          ))}
          <NeuronMesh
            neuron={n}
            firing={n.firing}
            potential={Math.max(n.potential, 0.3)}
            hovered={hoveredId === n.id}
          />
          <mesh
            onPointerOver={() => onHover(n.id)}
            onPointerOut={() => onHover(null)}
          >
            <sphereGeometry args={[n.radius * 2.5, 8, 8]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        </group>
      ))}

      {pulsesRef.current.map((p, i) => (
        <Pulse
          key={i}
          from={neurons[p.syn.from].position}
          to={neurons[p.syn.to].position}
          t={p.t}
          excitatory={p.syn.excitatory}
        />
      ))}
    </>
  )
}

const BrainCanvas = () => {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <div style={{ width: '70%', height: '50vh' }}>
      <Canvas
        camera={{ position: [0, 0, 60], fov: 35 }}
        style={{ background: "transparent", width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 5]} intensity={1} />
        <Network hoveredId={hoveredId} onHover={setHoveredId} />
        <OrbitControls
          enableZoom={false}
          autoRotate={hoveredId === null}
          autoRotateSpeed={0.6}
        />
      </Canvas>
    </div>
  )
}

export default BrainCanvas