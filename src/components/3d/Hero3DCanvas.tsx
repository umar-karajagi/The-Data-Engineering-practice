'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Hero3DCanvasProps {
  className?: string;
}

/**
 * Award-Caliber Restrained 3D Hero: The Lakehouse Medallion (Bronze / Silver / Gold)
 * - Concentric 3-tier architectural medallion with chamfered low-poly facets.
 * - Under 1s smooth spring assembly on load, followed by a slow, dignified ambient orbit.
 * - Responsive mouse parallax (constrained to 3-5 degrees tilt).
 * - Automatic IntersectionObserver pausing: drops to 0 FPS when out of viewport to preserve mobile battery/CPU.
 * - Full prefers-reduced-motion and WebGL fallback support.
 */
export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  useEffect(() => {
    // Detect prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setReducedMotion(true);
        return;
      }
    }

    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 650;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 16);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup (Sculptural Three-Point System)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Key light (Emerald / Cyan tint)
    const keyLight = new THREE.DirectionalLight(0x10b981, 2.2);
    keyLight.position.set(8, 12, 10);
    scene.add(keyLight);

    // Warm Gold Rim Light
    const goldRim = new THREE.DirectionalLight(0xf59e0b, 2.8);
    goldRim.position.set(-10, 8, -6);
    scene.add(goldRim);

    // Soft Bottom Fill Light
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    fillLight.position.set(0, -10, 5);
    scene.add(fillLight);

    // Medallion Root Group
    const medallionGroup = new THREE.Group();
    medallionGroup.position.set(0, -0.2, 0);
    medallionGroup.rotation.x = 0.38; // Initial architectural tilt
    scene.add(medallionGroup);

    // 3. Materials
    // Tier 1: Bronze (Base / Ingestion)
    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0x92400e,
      roughness: 0.35,
      metalness: 0.85,
      flatShading: true
    });
    const bronzeEdgeMat = new THREE.LineBasicMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.8
    });

    // Tier 2: Silver (Middle / Curated Lakehouse)
    const silverMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.9,
      flatShading: true
    });
    const silverEdgeMat = new THREE.LineBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.85
    });

    // Tier 3: Gold (Top / Business Value & Analytics)
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.15,
      metalness: 0.95,
      flatShading: true
    });
    const goldEdgeMat = new THREE.LineBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.9
    });

    // 4. Constructing Chamfered Medallion Tiers (Hexagonal Platforms)
    const createTierMesh = (
      radiusTop: number,
      radiusBottom: number,
      heightVal: number,
      mat: THREE.Material,
      edgeMat: THREE.LineBasicMaterial
    ) => {
      const geom = new THREE.CylinderGeometry(radiusTop, radiusBottom, heightVal, 6, 1);
      const mesh = new THREE.Mesh(geom, mat);
      const edges = new THREE.EdgesGeometry(geom);
      const line = new THREE.LineSegments(edges, edgeMat);
      mesh.add(line);
      return mesh;
    };

    // Target positions for the 3 tiers
    const bronzeTargetY = -1.4;
    const silverTargetY = 0.0;
    const goldTargetY = 1.4;

    const bronzeMesh = createTierMesh(4.4, 4.9, 0.7, bronzeMat, bronzeEdgeMat);
    bronzeMesh.position.y = -6.0; // Start offset for assembly animation
    medallionGroup.add(bronzeMesh);

    const silverMesh = createTierMesh(3.2, 3.6, 0.65, silverMat, silverEdgeMat);
    silverMesh.position.y = 0.0;
    medallionGroup.add(silverMesh);

    const goldMesh = createTierMesh(2.0, 2.3, 0.6, goldMat, goldEdgeMat);
    goldMesh.position.y = 6.0; // Start offset for assembly animation
    medallionGroup.add(goldMesh);

    // Apex Crown Core: Floating Octahedral Compute Prism
    const prismGeom = new THREE.OctahedronGeometry(0.85, 0);
    const prismMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x059669,
      emissiveIntensity: 0.6
    });
    const prismMesh = new THREE.Mesh(prismGeom, prismMat);
    prismMesh.position.y = 2.6;
    medallionGroup.add(prismMesh);

    // Delicate Orbital Ring (Photon Pipeline Stream)
    const ringGeom = new THREE.TorusGeometry(5.6, 0.035, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.45
    });
    const orbitalRing = new THREE.Mesh(ringGeom, ringMat);
    orbitalRing.rotation.x = Math.PI / 2 + 0.2;
    medallionGroup.add(orbitalRing);

    // Small data pulse beads along ring
    const beadGeom = new THREE.SphereGeometry(0.12, 8, 8);
    const beadMat = new THREE.MeshBasicMaterial({ color: 0x6ee7b7 });
    const bead1 = new THREE.Mesh(beadGeom, beadMat);
    const bead2 = new THREE.Mesh(beadGeom, beadMat);
    medallionGroup.add(bead1);
    medallionGroup.add(bead2);

    // 5. Mouse Parallax Listeners
    let mouseX = 0;
    let mouseY = 0;
    let targetParallaxX = 0;
    let targetParallaxY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (e.clientX - halfW) / halfW; // -1 to 1
      mouseY = (e.clientY - halfH) / halfH; // -1 to 1
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Window Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 650;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    // 6. Viewport Visibility Tracking via IntersectionObserver
    let isVisible = true;
    let animId: number;
    const clock = new THREE.Clock();
    let assemblyProgress = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animId) {
            animLoop();
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(container);

    // 7. Choreographed 60fps Animation Loop
    const animLoop = () => {
      if (!isVisible) {
        animId = 0;
        return; // Pause rendering completely when user scrolls away
      }

      animId = requestAnimationFrame(animLoop);
      const elapsed = clock.getElapsedTime();

      // 0.8s Spring assembly interpolation
      if (assemblyProgress < 1) {
        assemblyProgress = Math.min(1, assemblyProgress + 0.025);
        // Ease-out cubic
        const ease = 1 - Math.pow(1 - assemblyProgress, 3);
        bronzeMesh.position.y = -6.0 + (bronzeTargetY - (-6.0)) * ease;
        goldMesh.position.y = 6.0 + (goldTargetY - 6.0) * ease;
      } else {
        // Subtle rhythmic breathing in stacked idle mode
        bronzeMesh.position.y = bronzeTargetY + Math.sin(elapsed * 1.2) * 0.04;
        silverMesh.position.y = silverTargetY + Math.sin(elapsed * 1.2 + 0.8) * 0.04;
        goldMesh.position.y = goldTargetY + Math.sin(elapsed * 1.2 + 1.6) * 0.04;
        prismMesh.position.y = 2.6 + Math.sin(elapsed * 2.0) * 0.08;
      }

      // Smooth idle rotation
      medallionGroup.rotation.y += 0.0035;
      prismMesh.rotation.y -= 0.015;
      prismMesh.rotation.x += 0.008;

      // Orbit beads around ring
      const orbitSpeed = elapsed * 0.8;
      bead1.position.set(
        Math.cos(orbitSpeed) * 5.6,
        Math.sin(orbitSpeed) * 0.4,
        Math.sin(orbitSpeed) * 5.6
      );
      bead2.position.set(
        Math.cos(orbitSpeed + Math.PI) * 5.6,
        Math.sin(orbitSpeed + Math.PI) * 0.4,
        Math.sin(orbitSpeed + Math.PI) * 5.6
      );

      // Subtle mouse parallax damping (constrained to ~4 degrees)
      targetParallaxX += (mouseX * 0.12 - targetParallaxX) * 0.04;
      targetParallaxY += (-mouseY * 0.08 - targetParallaxY) * 0.04;

      medallionGroup.rotation.z = targetParallaxX;
      medallionGroup.rotation.x = 0.38 + targetParallaxY;

      renderer.render(scene, camera);
    };

    // Kick off animation
    animLoop();

    // 8. Cleanup
    return () => {
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bronzeMat.dispose();
      silverMat.dispose();
      goldMat.dispose();
      prismMat.dispose();
    };
  }, [reducedMotion]);

  // Dignified 2D Fallback for prefers-reduced-motion or missing WebGL
  if (reducedMotion || !webglSupported) {
    return (
      <div 
        className={`absolute inset-0 pointer-events-none flex items-center justify-center opacity-60 overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <div className="relative w-80 h-80 rounded-full border border-emerald-500/20 bg-gradient-to-b from-amber-500/10 via-slate-400/10 to-emerald-500/10 backdrop-blur-3xl flex items-center justify-center">
          <div className="w-56 h-56 rounded-full border border-amber-400/30 bg-gradient-to-tr from-amber-500/20 to-transparent flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border border-emerald-400/40 bg-emerald-500/10 flex items-center justify-center">
              <span className="text-2xl font-mono text-emerald-400 font-bold">Δ</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};
