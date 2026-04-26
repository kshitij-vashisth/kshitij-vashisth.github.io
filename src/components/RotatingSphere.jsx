import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function KleinBottleMesh({ radius = 12 }) {
  const meshRef = useRef()

  const geometry = useMemo(() => {
    const uSeg = 100
    const vSeg = 100
    const positions = []
    const indices = []
    const grid = []

    for (let i = 0; i <= uSeg; i++) {
      grid[i] = []
      for (let j = 0; j <= vSeg; j++) {
        const u = (i / uSeg) * Math.PI * 2
        const v = (j / vSeg) * Math.PI * 2

        let x, y, z

        if (u < Math.PI) {
          x = 3 * Math.cos(u) * (1 + Math.sin(u)) +
              2 * (1 - Math.cos(u) / 2) * Math.cos(u) * Math.cos(v)
          z = -8 * Math.sin(u) -
              2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v)
        } else {
          x = 3 * Math.cos(u) * (1 + Math.sin(u)) +
              2 * (1 - Math.cos(u) / 2) * Math.cos(v + Math.PI)
          z = -8 * Math.sin(u)
        }

        y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v)

        const scale = radius / 10
        positions.push(x * scale, y * scale, z * scale)
        grid[i][j] = i * (vSeg + 1) + j
      }
    }

    for (let i = 0; i < uSeg; i++) {
      for (let j = 0; j < vSeg; j++) {
        const a = grid[i][j]
        const b = grid[i + 1][j]
        const c = grid[i + 1][j + 1]
        const d = grid[i][j + 1]
        indices.push(a, b, d)
        indices.push(b, c, d)
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setIndex(indices)
    geo.computeVertexNormals()
    return geo
  }, [radius])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    meshRef.current.rotation.y = t * 0.3
  })

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[Math.PI / 2, 0, 0]}>
      <meshBasicMaterial
        wireframe
        color="#20C20E"
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function KleinBottleSameFeel() {
  return (
    <Canvas
      camera={{ position: [0, 0, 60], fov: 35 }}
      style={{ width: '100%', height: '100vh', display: 'block' }}
    >
      <ambientLight intensity={0.5} />
      <KleinBottleMesh radius={12} />
      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.5}
        minDistance={40}
        maxDistance={100}
      />
    </Canvas>
  )
}