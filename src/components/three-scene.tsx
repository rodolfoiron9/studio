
"use client";

import * as React from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { CubeCustomization } from "@/lib/types";

// Helper function to calculate luminance from a hex color
function getLuminance(hex: string) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Standard luminance formula
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}


export function ThreeScene({ customization, audioElement }: { customization: CubeCustomization, audioElement: HTMLAudioElement | null }) {
  const mountRef = React.useRef<HTMLDivElement>(null);
  
  // Refs for Three.js objects that need to persist across renders
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = React.useRef<THREE.Scene | null>(null);
  const cameraRef = React.useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = React.useRef<OrbitControls | null>(null);
  const cubeRef = React.useRef<THREE.Mesh | null>(null);
  const textCanvasesRef = React.useRef<HTMLCanvasElement[]>([]);
  const audioAnalyserRef = React.useRef<THREE.AudioAnalyser | null>(null);
  const snowRef = React.useRef<THREE.Points | null>(null);
  const particlesRef = React.useRef<THREE.Points | null>(null);


  // Effect for initialization and cleanup
  React.useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // --- One-time setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;
    
    camera.position.z = 5;

    const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const materials = Array(6).fill(null).map(() => new THREE.MeshStandardMaterial({ color: 0xffffff }));
    const cube = new THREE.Mesh(geometry, materials);
    cubeRef.current = cube;
    scene.add(cube);
    
    textCanvasesRef.current = Array(6).fill(null).map(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      return canvas;
    });
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 2, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const clock = new THREE.Clock();
    let animationId: number;
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      controls.update();

      if(cubeRef.current) {
        // The animation logic is now also part of the animate loop
        if (customization.animation === 'pulse') {
            const scale = 1 + Math.sin(elapsedTime * 2) * 0.05;
            cubeRef.current.scale.set(scale, scale, scale);
        } else if (customization.animation === 'audio-reactive' && audioAnalyserRef.current) {
            const freq = audioAnalyserRef.current.getAverageFrequency();
            const scale = 1 + (freq / 255) * 0.2;
            cubeRef.current.scale.set(scale, scale, scale);
        } else {
            cubeRef.current.scale.set(1, 1, 1);
        }
      }
      
      if(snowRef.current?.visible) snowRef.current.rotation.y += 0.0005;
      if(particlesRef.current?.visible) particlesRef.current.rotation.y -= 0.0005;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => {
              if (material.map) material.map.dispose();
              material.dispose();
            });
          } else if (object.material) {
            if (object.material.map) object.material.map.dispose();
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
      sceneRef.current = null;
    };
  }, []); // Only re-initialize if the audio element itself changes.

  // Effect to set up audio - runs only when audioElement changes
  React.useEffect(() => {
    if (audioElement && cameraRef.current) {
        const listener = new THREE.AudioListener();
        cameraRef.current.add(listener);
        const audio = new THREE.Audio(listener);
        try {
            // FIX: Check if the source is already connected before setting it.
            // This prevents errors during React Strict Mode hot reloads in development.
            if (!audio.source && !(audioElement as any)._connected) {
                (audioElement as any)._connected = true; // Mark as connected
                audio.setMediaElementSource(audioElement);
                audioAnalyserRef.current = new THREE.AudioAnalyser(audio, 32);
            }
        } catch (e) {
             console.error("Error setting up audio source:", e);
            // Error is expected on hot reloads, we can ignore it.
            // A more robust solution might check if the context is already connected.
        }
    }
  }, [audioElement]);


  // Effect for updating the scene based on customization changes
  React.useEffect(() => {
    const scene = sceneRef.current;
    const cube = cubeRef.current;
    if (!scene || !cube) return;

    // --- Update logic ---
    
    // Background
    if (customization.background === 'image' && customization.environmentImage) {
      const loader = new THREE.TextureLoader();
      loader.load(customization.environmentImage, (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.background = texture;
          scene.environment = texture;
      });
    } else if (customization.background !== 'video') {
      scene.background = null;
      scene.environment = null;
    }
    
    // Particle systems
    if (snowRef.current) snowRef.current.visible = customization.background === 'snow';
    if (particlesRef.current) particlesRef.current.visible = customization.background === 'particles';

    if (!snowRef.current && customization.background === 'snow') {
      const snowGeo = new THREE.BufferGeometry();
      const vertices = [];
      for (let i = 0; i < 10000; i++) {
        vertices.push(
          THREE.MathUtils.randFloatSpread(100),
          THREE.MathUtils.randFloatSpread(100),
          THREE.MathUtils.randFloatSpread(100)
        );
      }
      snowGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      const snowMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true });
      const snow = new THREE.Points(snowGeo, snowMat);
      snowRef.current = snow;
      scene.add(snow);
    }

    if (!particlesRef.current && customization.background === 'particles') {
      const particleGeo = new THREE.BufferGeometry();
      const vertices = [];
      const colors = [];
      const particleColors = [
          new THREE.Color(customization.particleColor1),
          new THREE.Color(customization.particleColor2),
          new THREE.Color(customization.particleColor3),
      ];
      for (let i = 0; i < 5000; i++) {
        vertices.push(
          THREE.MathUtils.randFloatSpread(50),
          THREE.MathUtils.randFloatSpread(50),
          THREE.MathUtils.randFloatSpread(50)
        );
        const color = particleColors[Math.floor(Math.random() * particleColors.length)];
        colors.push(color.r, color.g, color.b);
      }
      particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      particleGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      const particleMat = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.8 });
      const particles = new THREE.Points(particleGeo, particleMat);
      particlesRef.current = particles;
      scene.add(particles);
    }

    if (particlesRef.current && customization.background === 'particles') {
      const particleColors = [
          new THREE.Color(customization.particleColor1),
          new THREE.Color(customization.particleColor2),
          new THREE.Color(customization.particleColor3),
      ];
      const colors = [];
      for (let i = 0; i < 5000; i++) {
         const color = particleColors[Math.floor(Math.random() * particleColors.length)];
         colors.push(color.r, color.g, color.b);
      }
      particlesRef.current.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      (particlesRef.current.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }

    const faceColors = [
      customization.faceColor1, customization.faceColor2, customization.faceColor3,
      customization.faceColor4, customization.faceColor5, customization.faceColor6,
    ];
    const faceTexts = [
      customization.text1, customization.text2, customization.text3,
      customization.text4, customization.text5, customization.text6,
    ];

    (cube.material as THREE.MeshStandardMaterial[]).forEach((mat, i) => {
      mat.color.set(faceColors[i]);
      
      // Default properties
      mat.transparent = false;
      mat.opacity = 1.0;
      mat.metalness = 0.1;
      mat.roughness = 0.5;
      mat.wireframe = false;
      mat.flatShading = false;
      
      switch (customization.materialStyle) {
          case 'cartoon':
              mat.flatShading = true;
              break;
          case 'wireframe':
              mat.wireframe = true;
              break;
          case 'glass':
              mat.transparent = true;
              mat.opacity = 0.3;
              mat.metalness = 0.2;
              mat.roughness = 0.1;
              break;
          case 'metallic':
              mat.metalness = 0.9;
              mat.roughness = 0.2;
              break;
      }

      const canvas = textCanvasesRef.current[i];
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Don't draw text if the material is glass, as it causes rendering issues.
        if (customization.materialStyle !== 'glass' && faceTexts[i]) {
            context.font = 'bold 40px "Space Grotesk"';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillStyle = getLuminance(faceColors[i]) > 0.5 ? '#000000' : '#FFFFFF';
            context.fillText(faceTexts[i], canvas.width / 2, canvas.height / 2);
        }
        
        if (!mat.map) {
          mat.map = new THREE.CanvasTexture(canvas);
        } else {
          // If a map exists, we need to tell Three.js that its content has changed.
          mat.map.needsUpdate = true;
        }
      }
       mat.needsUpdate = true;
    });
    
    const roundness = customization.edgeStyle === 'round' ? customization.roundness : 0;
    // We only want to recreate geometry if it actually changes.
    // This is a simplified check. A more robust solution might serialize geometry parameters.
    const needsNewGeometry = 
        (customization.edgeStyle === 'round' && !(cube.geometry instanceof THREE.ExtrudeGeometry)) ||
        (customization.edgeStyle !== 'round' && (cube.geometry instanceof THREE.ExtrudeGeometry)) ||
        (customization.edgeStyle === 'bevel' && cube.geometry.parameters.widthSegments !== 3) ||
        (customization.edgeStyle === 'sharp' && cube.geometry.parameters.widthSegments !== 1);

    if (needsNewGeometry) {
      if(customization.edgeStyle === 'round' && roundness > 0.01) {
          const roundedBoxGeometry = createRoundedBoxGeometry(2.5, 2.5, 2.5, roundness, 10);
          cube.geometry.dispose();
          cube.geometry = roundedBoxGeometry;
      } else {
        const segments = customization.edgeStyle === 'bevel' ? 3 : 1;
        const newGeometry = new THREE.BoxGeometry(2.5, 2.5, 2.5, segments, segments, segments);
        cube.geometry.dispose();
        cube.geometry = newGeometry;
      }
    }

  }, [customization, audioElement]);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}

// Helper to create rounded box geometry
function createRoundedBoxGeometry(width: number, height: number, depth: number, radius: number, smoothness: number) {
    const shape = new THREE.Shape();
    const eps = 0.00001;
    const radius0 = radius - eps;

    shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
    shape.absarc(eps, height - radius0, eps, Math.PI, Math.PI / 2, true);
    shape.absarc(width - radius0, height - radius0, eps, Math.PI / 2, 0, true);
    shape.absarc(width - radius0, eps, eps, 0, -Math.PI / 2, true);

    const extrudeSettings = {
        depth: depth - radius * 2,
        bevelEnabled: true,
        bevelSegments: smoothness,
        steps: 1,
        bevelSize: radius,
        bevelThickness: radius,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    return geometry;
}
