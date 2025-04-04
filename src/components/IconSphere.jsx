import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';



// Import icons
import reactsvg from '/icons/react.svg'
import nextsvg from '/icons/nextjs-original.svg'
import nodejssvg from '/icons/nodejs-original.svg'
import dockersvg from '/icons/docker-original.svg'
import pythonsvg from '/icons/python-original.svg'
import gitsvg from '/icons/git-original.svg'
import expressSvg from '/icons/express-original.svg'
import flasksvg from '/icons/flask-original.svg'
import pytorchsvg from '/icons/pytorch-original.svg'
import tensorflow from '/icons/tensorflow-original.svg'
import pandasSvg from '/icons/pandas-original.svg'
import scikitlearnsvg from '/icons/scikitlearn-original.svg'
import bootstrapsvg from '/icons/bootstrap-original.svg'
import tailwindcsssvg from '/icons/tailwindcss-original.svg'
import githubsvg from '/icons/github-original.svg'
import mongodbsvg from '/icons/mongodb-original.svg'
import rabbitmqsvg from '/icons/rabbitmq-original.svg'
import unitysvg from '/icons/unity-original.svg'
import mysqlsvg from '/icons/mysql-original.svg'
import bashsvg from '/icons/bash-original.svg'


const IconSphere = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Auto-rotation controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.enableZoom = false;
    camera.position.z = 5;

    // Wireframe sphere (optional visual guide)
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(3, 32, 32),
      new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.1 })
    );
    scene.add(sphere);

    // const iconFiles = [
    //   'react.svg', 'nextjs-original.svg', 'nodejs-original.svg', 'docker-original.svg', 
    //   'python-original.svg', 'git-original.svg', 'express-original.svg', 'flask-original.svg',
    //   'pytorch-original.svg', 'tensorflow-original.svg', 'pandas-original.svg',
    //   'scikitlearn-original.svg','bootstrap-original.svg','tailwindcss-original.svg',
    //   'github-original.svg', 'mongodb-original.svg', 'rabbitmq-original.svg', 'unity-original.svg',
    //   'mysql-original.svg', 'bash-original.svg' // REPLACE THIS WITH YOUR ACTUAL ICON FILENAMES
    // ];

    const iconFiles = [
      reactsvg, nextsvg, nodejssvg, dockersvg, 
      pythonsvg, gitsvg, expressSvg, flasksvg, 
      pytorchsvg, tensorflow, pandasSvg, scikitlearnsvg, 
      bootstrapsvg, tailwindcsssvg, githubsvg, mongodbsvg, rabbitmqsvg, unitysvg, mysqlsvg, bashsvg];


    const textureLoader = new THREE.TextureLoader();
    const iconGeometry = new THREE.PlaneGeometry(0.5, 0.5);

    iconFiles.forEach((file, index) => {
      textureLoader.load(new URL(file, import.meta.url).href, (texture) => {
        const icon = new THREE.Mesh(
          iconGeometry,
          new THREE.MeshBasicMaterial({ 
            map: texture, 
            transparent: true,
            side: THREE.DoubleSide 
          })
        );

        // Position evenly on sphere
        const phi = Math.acos(-1 + (2 * index) / iconFiles.length);
        const theta = Math.sqrt(iconFiles.length * Math.PI) * phi;
        icon.position.setFromSphericalCoords(3.2, phi, theta);
        icon.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(icon);
      });
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => mountRef.current?.removeChild(renderer.domElement);
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default IconSphere;