import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { isWebGLAvailable } from '../utils/webglSupport';

interface Score3DGlobeProps {
  score: number;
  icpFit: number;
}

export const Score3DGlobe: React.FC<Score3DGlobeProps> = ({ score, icpFit }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState<boolean>(false);

  // Color based on lead score
  const isHigh = score >= 80;
  const isMedium = score >= 50 && score < 80;
  const hexColor = isHigh ? 0x10b981 : isMedium ? 0xeab308 : 0xf43f5e;
  const tailwindColor = isHigh ? 'text-emerald-400' : isMedium ? 'text-yellow-400' : 'text-rose-400';
  const borderColor = isHigh ? 'border-emerald-500/40' : isMedium ? 'border-yellow-500/40' : 'border-rose-500/40';
  const glowColor = isHigh ? 'rgba(16, 185, 129, 0.25)' : isMedium ? 'rgba(234, 179, 8, 0.25)' : 'rgba(244, 63, 94, 0.25)';

  useEffect(() => {
    // If WebGL is not available or disabled, immediately switch to SVG/Canvas fallback
    if (!isWebGLAvailable()) {
      setUseFallback(true);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 220;
    const height = container.clientHeight || 180;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationId: number = 0;
    let sphereGeo: THREE.IcosahedronGeometry | null = null;
    let sphereMat: THREE.MeshBasicMaterial | null = null;
    let innerGeo: THREE.SphereGeometry | null = null;
    let innerMat: THREE.MeshBasicMaterial | null = null;
    let ringGeo: THREE.TorusGeometry | null = null;
    let ringMat: THREE.MeshBasicMaterial | null = null;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 4.2;

      renderer = new THREE.WebGLRenderer({ 
        antialias: false, 
        alpha: true,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false
      });
      renderer.debug.checkShaderErrors = false;
      renderer.setSize(width, height);
      renderer.setPixelRatio(1);

      // Handle context lost
      renderer.domElement.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        setUseFallback(true);
      });

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);

      // Central wireframe sphere
      sphereGeo = new THREE.IcosahedronGeometry(1.2, 1);
      sphereMat = new THREE.MeshBasicMaterial({
        color: hexColor,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);

      // Inner glowing core (using MeshBasicMaterial for maximum driver compatibility)
      innerGeo = new THREE.SphereGeometry(0.75, 12, 12);
      innerMat = new THREE.MeshBasicMaterial({
        color: hexColor,
        transparent: true,
        opacity: 0.85,
        wireframe: false,
      });
      const innerCore = new THREE.Mesh(innerGeo, innerMat);
      group.add(innerCore);

      // Orbital ring
      ringGeo = new THREE.TorusGeometry(1.6, 0.025, 8, 36);
      ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.8,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      group.add(ring);

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        group.rotation.y += 0.015;
        group.rotation.x += 0.005;
        ring.rotation.z += 0.01;
        
        const pulse = 1 + Math.sin(Date.now() * 0.004) * 0.05;
        innerCore.scale.set(pulse, pulse, pulse);

        if (renderer) {
          renderer.render(scene, camera);
        }
      };

      animate();

      const handleResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        if (renderer) {
          renderer.dispose();
          if (container && renderer.domElement && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
        sphereGeo?.dispose();
        sphereMat?.dispose();
        innerGeo?.dispose();
        innerMat?.dispose();
        ringGeo?.dispose();
        ringMat?.dispose();
      };
    } catch {
      // Safe fallback if WebGL throws context creation or shader error
      setUseFallback(true);
      if (renderer) {
        try {
          renderer.dispose();
        } catch {
          // ignore
        }
      }
    }
  }, [score, icpFit, hexColor]);

  return (
    <div className="relative w-full h-[140px] flex items-center justify-center overflow-hidden">
      {useFallback ? (
        // High-fidelity SVG / CSS Holographic Radar Core (Universal Fallback)
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Animated concentric rings */}
          <div 
            className="absolute w-28 h-28 rounded-full border border-dashed animate-spin-slow opacity-60"
            style={{ borderColor: hexColor ? `#${hexColor.toString(16).padStart(6, '0')}` : '#10b981', animationDuration: '18s' }}
          />
          <div 
            className="absolute w-24 h-24 rounded-full border border-cyan-500/40 animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          <div 
            className={`absolute w-16 h-16 rounded-full border ${borderColor} flex items-center justify-center backdrop-blur-sm`}
            style={{ boxShadow: `0 0 24px ${glowColor}` }}
          >
            <div 
              className="w-10 h-10 rounded-full animate-ping opacity-20"
              style={{ backgroundColor: hexColor ? `#${hexColor.toString(16).padStart(6, '0')}` : '#10b981' }}
            />
          </div>

          {/* Radar scan indicator */}
          <div className="absolute w-28 h-28 rounded-full pointer-events-none overflow-hidden">
            <div 
              className="w-full h-full rounded-full animate-spin"
              style={{ 
                background: `conic-gradient(from 0deg, transparent 0deg, transparent 270deg, ${glowColor} 360deg)`,
                animationDuration: '4s'
              }}
            />
          </div>
        </div>
      ) : (
        <div ref={mountRef} className="w-full h-full" />
      )}

      {/* Central Score Badge Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className={`text-2xl font-black font-display tracking-tight drop-shadow-md ${tailwindColor}`}>
          {score}
        </span>
        <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider bg-slate-950/70 px-1.5 py-0.5 rounded border border-slate-800/80 mt-0.5">
          ICP {icpFit}%
        </span>
      </div>
    </div>
  );
};
