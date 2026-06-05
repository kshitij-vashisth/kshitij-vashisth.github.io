import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function KleinBottle() {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(el.clientWidth, el.clientHeight)
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, el.clientWidth / el.clientHeight, 0.1, 1000)
    camera.position.set(0, 0, 60)

    // Build geometry
    const uSeg = 80, vSeg = 80
    const positions = [], indices = [], grid = []
    const scale = 16 / 10

    for (let i = 0; i <= uSeg; i++) {
      grid[i] = []
      for (let j = 0; j <= vSeg; j++) {
        const u = (i / uSeg) * Math.PI * 2
        const v = (j / vSeg) * Math.PI * 2
        let x, y, z
        if (u < Math.PI) {
          x = 3 * Math.cos(u) * (1 + Math.sin(u)) + 2 * (1 - Math.cos(u) / 2) * Math.cos(u) * Math.cos(v)
          z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v)
        } else {
          x = 3 * Math.cos(u) * (1 + Math.sin(u)) + 2 * (1 - Math.cos(u) / 2) * Math.cos(v + Math.PI)
          z = -8 * Math.sin(u)
        }
        y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v)
        positions.push(x * scale, y * scale, z * scale)
        grid[i][j] = i * (vSeg + 1) + j
      }
    }
    for (let i = 0; i < uSeg; i++) {
      for (let j = 0; j < vSeg; j++) {
        const a = grid[i][j], b = grid[i+1][j], c = grid[i+1][j+1], d = grid[i][j+1]
        indices.push(a, b, d, b, c, d)
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setIndex(indices)
    geo.computeVertexNormals()

    const mat = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0x7c6af7,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    })

    const mesh = new THREE.Mesh(geo, mat)
    mesh.rotation.x = Math.PI / 2
    scene.add(mesh)

    // Mouse drag state
    let isDragging = false
    let prevMouse = { x: 0, y: 0 }
    // Current rotation driven by drag
    let rotX = 0, rotY = 0
    // Auto-rotate accumulator (pauses when dragging)
    let autoY = 0
    // Velocity for momentum after release
    let velX = 0, velY = 0

    const onMouseDown = (e) => {
      isDragging = true
      prevMouse = { x: e.clientX, y: e.clientY }
      velX = 0; velY = 0
    }

    const onMouseMove = (e) => {
      if (!isDragging) return
      const dx = e.clientX - prevMouse.x
      const dy = e.clientY - prevMouse.y
      velY = dx * 0.008
      velX = dy * 0.008
      rotY += velY
      rotX += velX
      prevMouse = { x: e.clientX, y: e.clientY }
    }

    const onMouseUp = () => { isDragging = false }

    // Touch support
    const onTouchStart = (e) => {
      isDragging = true
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      velX = 0; velY = 0
    }
    const onTouchMove = (e) => {
      if (!isDragging) return
      const dx = e.touches[0].clientX - prevMouse.x
      const dy = e.touches[0].clientY - prevMouse.y
      velY = dx * 0.008
      velX = dy * 0.008
      rotY += velY
      rotX += velX
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    const onTouchEnd = () => { isDragging = false }

    renderer.domElement.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    renderer.domElement.style.cursor = 'grab'

    let raf
    const animate = () => {
      raf = requestAnimationFrame(animate)

      if (!isDragging) {
        // coast with momentum then decay
        velX *= 0.92
        velY *= 0.92
        rotX += velX
        rotY += velY
        // gentle auto-rotate when velocity is tiny
        if (Math.abs(velY) < 0.001) autoY += 0.004
      }

      mesh.rotation.x = Math.PI / 2 + rotX
      mesh.rotation.y = rotY + autoY

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight)
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      geo.dispose()
      mat.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
}