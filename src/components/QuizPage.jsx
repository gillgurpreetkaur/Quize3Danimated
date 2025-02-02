import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { questions } from "./questions"; // Import your questions data here

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    // Set up the scene, camera, and renderer for the 3D background
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Make background transparent
    document.body.appendChild(renderer.domElement);

    // Create a glowing star field background
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = Math.random() * 2000 - 1000;
      positions[i * 3 + 1] = Math.random() * 2000 - 1000;
      positions[i * 3 + 2] = Math.random() * 2000 - 1000;

      // Set random colors to create a vibrant glow effect
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({ size: 1.5, vertexColors: true });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Set the camera position
    camera.position.z = 600;

    // Animation loop to rotate particles and create a dynamic background effect
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the particles and move the camera for a dynamic effect
      particles.rotation.x += 0.001;
      particles.rotation.y += 0.001;
      camera.position.z += 0.05;
      if (camera.position.z > 1000) camera.position.z = 600;

      // Twinkle effect for the stars to create a glowing, vibrant atmosphere
      particles.material.size = Math.abs(Math.sin(Date.now() * 0.001)) * 1.5 + 0.5;

      renderer.render(scene, camera);
    };

    animate();
  }, []);

  const handleAnswer = (option) => {
    setSelectedOption(option);
    if (option.is_correct) {
      setScore(score + 1);
    }
    setTimeout(() => {
      setSelectedOption(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setIsQuizFinished(true);
        const endTime = Date.now();
        setTimeTaken(Math.floor((endTime - startTime) / 1000)); // Calculate time taken in seconds
      }
    }, 1000);
  };

  if (isQuizFinished) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Full-screen 3D Starry Background */}
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <canvas id="threejs-canvas" />
        </div>

        {/* Result Page */}
        <motion.div
          className="p-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-lg text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-lg mb-4">Your Score: {score}/{questions.length}</p>
          <p className="text-lg mb-4">Time Taken: {timeTaken} seconds</p>

          <motion.button
            onClick={() => window.location.reload()} // Refresh to restart the quiz
            className="p-4 mt-4 bg-yellow-500 text-white font-bold rounded-lg transition-transform transform hover:scale-110"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Restart Quiz
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Full-screen 3D Starry Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <canvas id="threejs-canvas" />
      </div>

      {/* Quiz Content Area */}
      <motion.div
        className="p-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg shadow-lg text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4">{questions[currentQuestion].description}</h2>
        <p className="text-lg mb-4">{questions[currentQuestion].topic}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {questions[currentQuestion].options.map((option) => (
            <motion.button
              key={option.id}
              onClick={() => handleAnswer(option)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 transform ${
                selectedOption
                  ? option.is_correct
                    ? "bg-green-500"
                    : selectedOption.id === option.id
                    ? "bg-red-500"
                    : "bg-gray-700"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              whileHover={{
                scale: 1.05,
                rotate: 5,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {option.description}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default QuizPage;
