
"use client";

import * as React from "react";
import * as THREE from "three";
import type { CubeCustomization } from "@/lib/types";

// Helper function to calculate luminance from a hex color
function getLuminance(hex: string) {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    // Apply the luminance formula
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function ThreeScene({ customization }: { customization: CubeCustomization }) {
  const mountRef = React.useRef<HTMLDivElement>(null);
  const sceneRef = React.useRef<THREE.Scene | null>(null);

  React.useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    camera.position.z = 5;

    // Cube setup
    const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const materials = Array(6).fill(null).map(() => new THREE.MeshStandardMaterial({ color: 0xffffff }));
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    // Textures for text
    const textCanvases = Array(6).fill(null).map(() => document.createElement('canvas'));
    textCanvases.forEach(canvas => {
      canvas.width = 256;
      canvas.height = 256;
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 2, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Particle systems
    let snow: THREE.Points, particles: THREE.Points;
    
    // Animation loop
    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      cube.rotation.x += 0.005;
      cube.rotation.y += 0.005;

      if (customization.animation === 'pulse') {
        const scale = 1 + Math.sin(elapsedTime * 2) * 0.05;
        cube.scale.set(scale, scale, scale);
      } else {
        cube.scale.set(1, 1, 1);
      }
      
      if(snow?.visible) snow.rotation.y += 0.0005;
      if(particles?.visible) particles.rotation.y -= 0.0005;

      renderer.render(scene, camera);
    };

    // Update function
    const updateScene = (customization: CubeCustomization) => {
      // Background
      if (customization.background === 'image' && customization.environmentImage) {
        const loader = new THREE.TextureLoader();
        loader.load(customization.environmentImage, (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            scene.environment = texture;
        });
      } else {
        scene.background = null;
        scene.environment = null;
      }
      
      // Particle systems
      if (snow) snow.visible = customization.background === 'snow';
      if (particles) particles.visible = customization.background === 'particles';

      if (!snow && customization.background === 'snow') {
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
        snow = new THREE.Points(snowGeo, snowMat);
        scene.add(snow);
      }

      if (!particles && customization.background === 'particles') {
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
        particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);
      }
      if (particles && customization.background === 'particles') {
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
        particles.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        (particles.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
      }


      // Cube materials and text
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
        mat.wireframe = customization.wireframe;
        mat.needsUpdate = true;

        // Update text texture
        const canvas = textCanvases[i];
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          
          context.font = 'bold 40px "Space Grotesk"';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          
          context.fillStyle = getLuminance(faceColors[i]) > 0.5 ? '#000000' : '#FFFFFF';

          context.fillText(faceTexts[i], canvas.width / 2, canvas.height / 2);
          
          if (!mat.map) {
            mat.map = new THREE.CanvasTexture(canvas);
          } else {
            // If we don't clear the map, the old background color can bleed through
            mat.map.dispose(); 
            mat.map = new THREE.CanvasTexture(canvas);
          }

          mat.map.needsUpdate = true;
        }
      });
      
      // Cube Geometry
      const roundness = customization.edgeStyle === 'round' ? customization.roundness : 0;
      const segments = customization.edgeStyle === 'bevel' ? 3 : 1;
      const newGeometry = new THREE.BoxGeometry(2.5, 2.5, 2.5, segments, segments, segments);
      if(customization.edgeStyle === 'round' && roundness > 0.01) {
          const roundedBoxGeometry = createRoundedBoxGeometry(2.5, 2.5, 2.5, roundness, 10);
          cube.geometry.dispose();
          cube.geometry = roundedBoxGeometry;
      } else {
        cube.geometry.dispose();
        cube.geometry = newGeometry;
      }
    };

    // Initial update and start animation
    updateScene(customization);
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of scene objects
      if (sceneRef.current) {
        sceneRef.current.traverse(object => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }
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
        sceneRef.current = null;
      }
      renderer.dispose();
    };
  }, [customization]); // Re-run effect when customization changes

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
