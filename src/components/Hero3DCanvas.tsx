import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { isWebGLAvailable } from '../utils/webglSupport';

interface Scene3DProps {
  interactive?: boolean;
}

// 2D Canvas Fallback: High-Performance Holographic Neural Core
const Interactive2DCanvas: React.FC<{ interactive?: boolean }> = ({ interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 1.5;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 1.5;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mathematical 3D Icosahedron Vertices
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVertices: [number, number, number][] = [
      [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
      [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
      [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1]
    ].map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return [x / len * 110, y / len * 110, z / len * 110];
    });

    // Edges connecting vertices of icosahedron
    const edges: [number, number][] = [];
    for (let i = 0; i < rawVertices.length; i++) {
      for (let j = i + 1; j < rawVertices.length; j++) {
        const [x1, y1, z1] = rawVertices[i];
        const [x2, y2, z2] = rawVertices[j];
        const dist = Math.hypot(x1 - x2, y1 - y2, z1 - z2);
        if (dist < 130) {
          edges.push([i, j]);
        }
      }
    }

    // Ambient floating particles
    const particleCount = 50;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.2,
      y: (Math.random() - 0.5) * height * 1.2,
      z: Math.random() * 400 - 200,
      radius: Math.random() * 1.8 + 0.5,
      color: Math.random() > 0.5 ? '#6366f1' : Math.random() > 0.5 ? '#38bdf8' : '#10b981',
      speed: Math.random() * 0.4 + 0.1,
    }));

    // Data nodes orbiting around the core
    const nodeCount = 14;
    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
      orbitRadius: 160 + (i % 3) * 40,
      angle: (i / nodeCount) * Math.PI * 2,
      speed: 0.008 + (i % 4) * 0.003,
      elevation: ((i % 5) - 2) * 35,
      color: ['#6366f1', '#38bdf8', '#10b981', '#a855f7'][i % 4],
      size: 4 + (i % 3),
    }));

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse damping
      targetRotY = mouseX * 0.8;
      targetRotX = mouseY * 0.6;
      currentRotY += (targetRotY - currentRotY) * 0.05;
      currentRotX += (targetRotX - currentRotX) * 0.05;

      const cx = width / 2;
      const cy = height / 2;

      // 1. Draw Starfield Particles
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < -height / 2) p.y = height / 2;
        const screenX = cx + p.x + currentRotY * 40;
        const screenY = cy + p.y + currentRotX * 30;
        ctx.beginPath();
        ctx.arc(screenX, screenY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.45;
        ctx.fill();
      });

      // 2. Draw Concentric Holographic Orbital Rings
      const drawRing = (rx: number, ry: number, rotZ: number, color: string, dash: number[]) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotZ);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.setLineDash(dash);
        ctx.globalAlpha = 0.35;
        ctx.stroke();
        ctx.restore();
      };

      drawRing(190, 75, time * 0.2 + currentRotY * 0.3, '#6366f1', [6, 8]);
      drawRing(230, 85, -time * 0.15 - currentRotY * 0.2, '#06b6d4', [4, 12]);
      drawRing(270, 100, time * 0.08 + Math.PI / 4, '#10b981', [2, 6]);

      // 3. Project & Draw 3D Core Crystal
      const angleY = time * 0.4 + currentRotY;
      const angleX = time * 0.2 + currentRotX;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      const projected = rawVertices.map(([vx, vy, vz]) => {
        // Pulse
        const pulse = 1 + Math.sin(time * 2) * 0.04;
        const px = vx * pulse;
        const py = vy * pulse;
        const pz = vz * pulse;

        // Rotate Y
        const x1 = px * cosY - pz * sinY;
        const z1 = px * sinY + pz * cosY;

        // Rotate X
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        // Perspective projection
        const fov = 420;
        const scale = fov / (fov + z2);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2,
          scale,
        };
      });

      // Draw Wireframe Edges
      ctx.lineWidth = 1.5;
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        const depthAlpha = Math.max(0.15, Math.min(0.85, (p1.z + p2.z) / 200 + 0.5));
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = '#38bdf8';
        ctx.globalAlpha = depthAlpha * 0.7;
        ctx.stroke();
      });

      // Draw Core Vertices
      projected.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = '#6366f1';
        ctx.globalAlpha = 0.9;
        ctx.fill();
      });

      // 4. Orbiting Data Nodes & Neural Beams
      nodes.forEach((node, i) => {
        node.angle += node.speed;
        const nx = Math.cos(node.angle) * node.orbitRadius;
        const nz = Math.sin(node.angle) * node.orbitRadius;
        const ny = node.elevation + Math.sin(time * 2 + i) * 12;

        // Rotate along with scene
        const rotNodeX = nx * cosY - nz * sinY;
        const rotNodeZ = nx * sinY + nz * cosY;
        const rotNodeY = ny * cosX - rotNodeZ * sinX;

        const fov = 420;
        const scale = fov / (fov + rotNodeZ);
        const scrX = cx + rotNodeX * scale;
        const scrY = cy + rotNodeY * scale;

        // Neural beam to center
        if (i % 2 === 0) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(scrX, scrY);
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.2;
          ctx.stroke();
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(scrX, scrY, node.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = Math.max(0.3, Math.min(1, scale));
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [interactive]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full cursor-grab active:cursor-grabbing block"
    />
  );
};

export const Hero3DCanvas: React.FC<Scene3DProps> = ({ interactive = true }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState<boolean>(false);

  useEffect(() => {
    // 1. Initial WebGL support detection
    if (!isWebGLAvailable()) {
      setUseFallback(true);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId = 0;

    try {
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x030712, 0.035);

      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.set(0, 1.2, 7.5);

      // Create WebGLRenderer with fallback guards
      renderer = new THREE.WebGLRenderer({ 
        antialias: false, 
        alpha: true, 
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false
      });
      renderer.debug.checkShaderErrors = false;
      renderer.setSize(width, height);
      renderer.setPixelRatio(1);

      // Handle context lost gracefully
      renderer.domElement.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        setUseFallback(true);
      });

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const mainGroup = new THREE.Group();
      scene.add(mainGroup);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(ambientLight);

      // Core: Resilient Basic/Lambert materials to prevent shader compiler failures on ANGLE D3D11
      const coreGeometry = new THREE.IcosahedronGeometry(1.4, 1);
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x4f46e5,
        wireframe: false,
        transparent: true,
        opacity: 0.85,
      });
      const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
      mainGroup.add(coreMesh);

      // Wireframe overlay
      const wireframeGeo = new THREE.WireframeGeometry(coreGeometry);
      const wireframeMat = new THREE.LineBasicMaterial({ 
        color: 0x38bdf8, 
        transparent: true, 
        opacity: 0.8 
      });
      const coreWireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
      mainGroup.add(coreWireframe);

      // Orbital Rings
      const createRing = (radius: number, tube: number, color: number, rotX: number, rotY: number) => {
        const ringGeo = new THREE.TorusGeometry(radius, tube, 8, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.7,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = rotX;
        ring.rotation.y = rotY;
        return ring;
      };

      const ring1 = createRing(2.5, 0.03, 0x6366f1, Math.PI / 3, 0);
      const ring2 = createRing(3.2, 0.025, 0x06b6d4, -Math.PI / 4, Math.PI / 6);
      const ring3 = createRing(3.9, 0.02, 0x10b981, Math.PI / 2.2, -Math.PI / 4);
      mainGroup.add(ring1);
      mainGroup.add(ring2);
      mainGroup.add(ring3);

      // Floating Nodes
      const nodeCount = 24;
      const nodeGroup = new THREE.Group();
      const nodeGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const nodeColors = [0x6366f1, 0x38bdf8, 0x10b981, 0xa855f7];
      const nodes: Array<{ mesh: THREE.Mesh; radius: number; angle: number; elevation: number; orbitSpeed: number }> = [];

      for (let i = 0; i < nodeCount; i++) {
        const col = nodeColors[i % nodeColors.length];
        const mat = new THREE.MeshBasicMaterial({ color: col });
        const mesh = new THREE.Mesh(nodeGeo, mat);
        const radius = 2.2 + Math.random() * 2.2;
        const angle = Math.random() * Math.PI * 2;
        const elevation = (Math.random() - 0.5) * 2.4;

        mesh.position.set(Math.cos(angle) * radius, elevation, Math.sin(angle) * radius);
        nodeGroup.add(mesh);
        nodes.push({ mesh, radius, angle, elevation, orbitSpeed: 0.008 + Math.random() * 0.008 });
      }
      mainGroup.add(nodeGroup);

      let mouseX = 0;
      let mouseY = 0;
      let targetRotationX = 0;
      let targetRotationY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseX = (((e.clientX - rect.left) / rect.width) * 2 - 1) * 0.8;
        mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1) * 0.5;
      };

      if (interactive) {
        window.addEventListener('mousemove', handleMouseMove);
      }

      const handleResize = () => {
        if (!container || !renderer) return;
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };
      window.addEventListener('resize', handleResize);

      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        targetRotationY += (mouseX - targetRotationY) * 0.05;
        targetRotationX += (mouseY - targetRotationX) * 0.05;

        camera.position.x = Math.sin(targetRotationY * 0.5) * 2;
        camera.position.y = 1.2 + targetRotationX * 1.2;
        camera.lookAt(0, 0, 0);

        coreMesh.rotation.x += 0.005;
        coreMesh.rotation.y += 0.008;
        coreWireframe.rotation.x = coreMesh.rotation.x;
        coreWireframe.rotation.y = coreMesh.rotation.y;

        const scalePulse = 1 + Math.sin(elapsedTime * 2.5) * 0.04;
        coreMesh.scale.set(scalePulse, scalePulse, scalePulse);
        coreWireframe.scale.set(scalePulse * 1.02, scalePulse * 1.02, scalePulse * 1.02);

        ring1.rotation.z += 0.008;
        ring2.rotation.z -= 0.006;
        ring3.rotation.z += 0.004;

        nodes.forEach((item, idx) => {
          item.angle += item.orbitSpeed;
          const curRadius = item.radius + Math.sin(elapsedTime * 1.5 + idx) * 0.2;
          item.mesh.position.set(
            Math.cos(item.angle) * curRadius,
            item.elevation + Math.sin(elapsedTime * 2 + idx) * 0.3,
            Math.sin(item.angle) * curRadius
          );
        });

        mainGroup.rotation.y = elapsedTime * 0.08;

        if (renderer) {
          renderer.render(scene, camera);
        }
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        if (interactive) {
          window.removeEventListener('mousemove', handleMouseMove);
        }
        if (renderer) {
          renderer.dispose();
          if (container && renderer.domElement && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
        coreGeometry.dispose();
        coreMaterial.dispose();
        wireframeGeo.dispose();
        wireframeMat.dispose();
      };
    } catch {
      // If WebGL throws during initialization, switch smoothly to 2D canvas fallback
      setUseFallback(true);
      if (renderer) {
        try {
          renderer.dispose();
        } catch {
          // ignore
        }
      }
    }
  }, [interactive]);

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] lg:h-[540px] flex items-center justify-center overflow-hidden select-none bg-slate-950/60">
      {/* Either 3D WebGL Canvas or High-Performance 2D Canvas Fallback */}
      {useFallback ? (
        <Interactive2DCanvas interactive={interactive} />
      ) : (
        <div 
          ref={mountRef} 
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />
      )}

      {/* Floating HUD Indicators */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/85 border border-slate-800/80 backdrop-blur-md text-[11px] text-slate-300 pointer-events-none shadow-lg">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="font-mono tracking-wider font-semibold text-white">3D NEURAL SYNC</span>
        <span className="text-slate-500">|</span>
        <span className="text-emerald-400 font-mono">
          {useFallback ? '60 FPS OPTIMIZED' : '60 FPS WebGL'}
        </span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/85 border border-slate-800/80 backdrop-blur-md text-[11px] text-slate-400 pointer-events-none shadow-lg">
        <span>✨ Move mouse to interact with neural pipeline nodes</span>
      </div>

      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-medium shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span>CRM Stream</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-medium shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>Intent Engine</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-medium shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>2-Way Sheets</span>
        </div>
      </div>
    </div>
  );
};
