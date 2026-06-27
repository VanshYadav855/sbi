import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 150;
const CONNECT_DISTANCE = 12;
const MOUSE_RADIUS = 8;
const DRIFT_SPEED = 0.0015;
const WORLD_SCALE = 20;

export default function MirrorMindBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const halfW = width / 200;
    const halfH = height / 200;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const canvas = renderer.domElement;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    container.appendChild(canvas);

    const tealColor = new THREE.Color('#0EA5E9');
    const saffronColor = new THREE.Color('#F97316');

    const positions = [];
    const velocities = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions.push(
        (Math.random() - 0.5) * WORLD_SCALE,
        (Math.random() - 0.5) * WORLD_SCALE,
        0
      );
      const angle = Math.random() * Math.PI * 2;
      velocities.push(Math.cos(angle) * DRIFT_SPEED, Math.sin(angle) * DRIFT_SPEED);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const colors = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const mix = Math.random() < 0.6 ? tealColor : saffronColor;
      colors[i * 3] = mix.r;
      colors[i * 3 + 1] = mix.g;
      colors[i * 3 + 2] = mix.b;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.15,
    });

    const maxConnections = (PARTICLE_COUNT * (PARTICLE_COUNT - 1)) / 2;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage)
    );
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    const mouse = { x: 0, y: 0, active: false };
    let time = 0;

    const onMouseMove = (e) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mouse.x = (e.clientX / w - 0.5) * WORLD_SCALE;
      mouse.y = -(e.clientY / h - 0.5) * WORLD_SCALE;
      mouse.active = true;
    };

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.left = -w / 200;
      camera.right = w / 200;
      camera.top = h / 200;
      camera.bottom = -h / 200;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    let animId;
    const posArray = geometry.attributes.position.array;
    const bounds = WORLD_SCALE / 2;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 1;

      camera.position.x = Math.sin(time * 0.0008) * 1.2;
      camera.position.y = Math.cos(time * 0.0006) * 0.9;
      camera.lookAt(0, 0, 0);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;
        posArray[idx] += velocities[i * 2];
        posArray[idx + 1] += velocities[i * 2 + 1];

        if (posArray[idx] > bounds || posArray[idx] < -bounds) velocities[i * 2] *= -1;
        if (posArray[idx + 1] > bounds || posArray[idx + 1] < -bounds) velocities[i * 2 + 1] *= -1;

        if (mouse.active) {
          const dx = posArray[idx] - mouse.x;
          const dy = posArray[idx + 1] - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS && dist > 0.01) {
            const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * 0.015;
            posArray[idx] += (dx / dist) * force;
            posArray[idx + 1] += (dy / dist) * force;
          }
        }
      }
      geometry.attributes.position.needsUpdate = true;

      let lineIdx = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DISTANCE) {
            linePositions[lineIdx++] = posArray[i * 3];
            linePositions[lineIdx++] = posArray[i * 3 + 1];
            linePositions[lineIdx++] = 0;
            linePositions[lineIdx++] = posArray[j * 3];
            linePositions[lineIdx++] = posArray[j * 3 + 1];
            linePositions[lineIdx++] = 0;
          }
        }
      }
      lineGeometry.setDrawRange(0, lineIdx / 3);
      lineGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-screen h-screen z-0 pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
      aria-hidden="true"
    />
  );
}
