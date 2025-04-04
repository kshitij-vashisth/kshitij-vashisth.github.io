import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from "three";
import brainModel from "/brain/brain.glb"

const Brain = () => {
  const brainRef = useRef();
  const { scene } = useLoader(GLTFLoader, (new URL(brainModel, import.meta.url).href));

  const [mouseX, setMouseX] = useState(0);

  // Track the mouse movement to update the x position
  useEffect(() => {
    const handleMouseMove = (event) => {
      // Get mouse position relative to window width
      const mousePos = (event.clientX / window.innerWidth) * 2 - 1; // Normalize to [-1, 1]
      setMouseX(mousePos); // Store the normalized mouse position
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Set the scale of the brain
  useEffect(() => {
    if (scene) {
      scene.scale.set(4, 4, 4); // Adjust scale to make the brain larger
    }
  }, [scene]);

  // Rotate the brain based on mouse position with clamped boundaries
  useFrame(() => {
    if (brainRef.current) {
      // Define rotation limits (in radians)
      const rotationLimit = Math.PI / 4; // 45 degrees in radians

      // Mapping the mouseX from [-1, 1] to [-rotationLimit, rotationLimit] and clamp it
      const rotationValue = THREE.MathUtils.lerp(
        brainRef.current.rotation.y,
        THREE.MathUtils.clamp(mouseX * rotationLimit, -rotationLimit, rotationLimit), // Clamp between -45° to 45°
        0.05 // Slow down the speed of rotation for smoother effect
      );

      brainRef.current.rotation.y = rotationValue; // Apply the clamped rotation
    }
  });

  return (
    <group ref={brainRef}>
      <primitive object={scene} />
    </group>
  );
};

const BrainCanvas = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 5]} intensity={1} />
      <Brain />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};

export default BrainCanvas;
