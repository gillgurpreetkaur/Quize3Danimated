// src/HomePage.jsx
import React, { useEffect } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

const HomePage = () => {
  const navigate = useNavigate();  // Hook to navigate to the quiz page

  useEffect(() => {
    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create a glowing star field background
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3); // Color attribute for glow effect

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = Math.random() * 2000 - 1000;
      positions[i * 3 + 1] = Math.random() * 2000 - 1000;
      positions[i * 3 + 2] = Math.random() * 2000 - 1000;

      // Set random colors for the stars to make them glow
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({ size: 1, vertexColors: true });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Set the camera position
    camera.position.z = 600;

    // Animation loop with glowing effect and smooth movement
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate particles and make them move
      particles.rotation.x += 0.001;
      particles.rotation.y += 0.001;

      // Camera movement effect for smooth scrolling
      camera.position.z += 0.05;
      if (camera.position.z > 1000) camera.position.z = 600;

      // Make the stars twinkle slightly by changing their brightness
      particles.material.size = Math.abs(Math.sin(Date.now() * 0.001)) * 1.5 + 0.5;

      renderer.render(scene, camera);
    };

    animate();
  }, []);

  // Handle start button click to navigate to quiz page
  const handleStartQuiz = () => {
    navigate('/quiz'); // Redirect to the quiz page
  };

  return (
    <div style={homePageStyles}>
      <h1 style={titleStyle}>Welcome to the Quiz App</h1>
      <button style={buttonStyle} onClick={handleStartQuiz}>
        Start Quiz
      </button>
    </div>
  );
};

// Styles
const homePageStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  zIndex: 10,
};

const titleStyle = {
  color: 'white',
  fontSize: '60px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  marginBottom: '20px',
  textShadow: '0 0 15px rgba(255, 255, 255, 0.7)',
};

const buttonStyle = {
  padding: '20px 30px',
  fontSize: '20px',
  backgroundColor: '#ff6347',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
  fontWeight: 'bold',
  marginTop: '20px',
};

// Hover effect
buttonStyle[':hover'] = {
  backgroundColor: '#ff4500',
};

export default HomePage;
