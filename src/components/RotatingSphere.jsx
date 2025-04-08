import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Import icons
import reactsvg from '/icons/react.svg'
import nextsvg from '/icons/nextjs-original.png'
import nodejssvg from '/icons/nodejs-original.png'
import dockersvg from '/icons/docker-original.png'
import pythonsvg from '/icons/python-original.png'
import gitsvg from '/icons/git-original.png'
import expressSvg from '/icons/express-original.png'
import flasksvg from '/icons/flask-original.png'
import pytorchsvg from '/icons/pytorch-original.png'
import tensorflow from '/icons/tensorflow-original.png'
import pandasSvg from '/icons/pandas-original.png'
import scikitlearnsvg from '/icons/scikitlearn-original.png'
import bootstrapsvg from '/icons/bootstrap-original.png'
import tailwindcsssvg from '/icons/tailwindcss-original.png'
import githubsvg from '/icons/github-original.png'
import mongodbsvg from '/icons/mongodb-original.png'
import rabbitmqsvg from '/icons/rabbitmq-original.png'
import unitysvg from '/icons/unity-original.png'
import mysqlsvg from '/icons/mysql-original.png'
import sqlapng from '/icons/SQLAlchemy.png'
import bashsvg from '/icons/bash-original.png'

const iconFiles = [
  reactsvg, nextsvg, nodejssvg, dockersvg, 
  pythonsvg, gitsvg, expressSvg, flasksvg, 
  pytorchsvg, tensorflow, pandasSvg, scikitlearnsvg, 
  bootstrapsvg, tailwindcsssvg, githubsvg, mongodbsvg, 
  rabbitmqsvg, unitysvg, mysqlsvg, sqlapng, bashsvg
]

function Icon({ iconUrl, position }) {
  const texture = useTexture(iconUrl)
  return (
    <mesh position={position}>
      <planeGeometry args={[3, 3]} /> {/* Icon size */}
      <meshBasicMaterial 
        map={texture} 
        transparent
        alphaTest={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function SphereWithIcons() {
  const groupRef = useRef()
  const sphereRadius = 12// Large sphere radius

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.3
  })

  const iconCount = iconFiles.length

  const placedIcons = iconFiles.map((iconUrl, index) => {
    const phi = Math.acos(-1 + (2 * index) / iconCount)
    const theta = Math.sqrt(iconCount * Math.PI) * phi

    const x = sphereRadius * Math.cos(theta) * Math.sin(phi)
    const y = sphereRadius * Math.sin(theta) * Math.sin(phi)
    const z = sphereRadius * Math.cos(phi)

    // Create position vector and normal vector
    const pos = new THREE.Vector3(x, y, z)
    const normal = pos.clone().normalize()

    return (
      <group key={index} position={pos}>
        <Icon 
          iconUrl={iconUrl} 
          position={[0, 0, 0]}
          rotation={new THREE.Euler().setFromQuaternion(
            new THREE.Quaternion().setFromUnitVectors(
              new THREE.Vector3(0, 0, 1),
              normal
            )
          )}
        />
      </group>
    )
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[sphereRadius, 64, 64]} />
        <meshBasicMaterial 
          wireframe 
          wireframeLinewidth={2}
          color="#20C20E" 
          transparent 
          opacity={0.2}
        />
      </mesh>
      {placedIcons}
    </group>
  )
}

export default function RotatingSphereWithIcons() {
    return (
      <Canvas 
        camera={{ position: [0, 0, 60], fov: 35 }}
        style={{ width: '100%', height: '100vh', display: 'block' }} // Make canvas fill full screen
      >
        <ambientLight intensity={0.5} />
        <SphereWithIcons />
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
  