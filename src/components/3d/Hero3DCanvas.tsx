'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Hero3DCanvasProps {
  className?: string;
}

/**
 * Award-Caliber Restrained 3D Hero: The Sovereign Cyber Falcon & Lakehouse Medallion
 * - Sculptural, low-poly Cyber Falcon with articulated flapping wings & responsive banking flight.
 * - Concentric 3-tier architectural Lakehouse Medallion (Bronze / Silver / Gold).
 * - Responsive mouse telemetry: falcon swoops and banks dynamically toward cursor.
 * - Automatic IntersectionObserver pausing: drops to 0 FPS when out of viewport to preserve mobile battery/CPU.
 * - Dignified 2D fallback for prefers-reduced-motion and non-WebGL environments.
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
    camera.position.set(0, 1.8, 17);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup (Sculptural Three-Point System)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Key light (Emerald / Cyan glow)
    const keyLight = new THREE.DirectionalLight(0x10b981, 2.4);
    keyLight.position.set(10, 14, 10);
    scene.add(keyLight);

    // Warm Gold Rim Light
    const goldRim = new THREE.DirectionalLight(0xf59e0b, 2.6);
    goldRim.position.set(-12, 8, -6);
    scene.add(goldRim);

    // Deep Atmospheric Cyan Fill
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(0, -10, 8);
    scene.add(fillLight);

    // =========================================================================
    // 3. MEDALLION ARCHITECTURE (Bronze -> Silver -> Gold Tiers)
    // =========================================================================
    const medallionGroup = new THREE.Group();
    medallionGroup.position.set(0, -0.6, -1);
    medallionGroup.rotation.x = 0.35;
    scene.add(medallionGroup);

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0x92400e,
      roughness: 0.35,
      metalness: 0.85,
      flatShading: true
    });
    const bronzeEdgeMat = new THREE.LineBasicMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.85
    });

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

    const createTierMesh = (
      rTop: number,
      rBottom: number,
      h: number,
      mat: THREE.Material,
      edgeMat: THREE.LineBasicMaterial
    ) => {
      const geom = new THREE.CylinderGeometry(rTop, rBottom, h, 6, 1);
      const mesh = new THREE.Mesh(geom, mat);
      const edges = new THREE.EdgesGeometry(geom);
      const line = new THREE.LineSegments(edges, edgeMat);
      mesh.add(line);
      return mesh;
    };

    const bronzeTargetY = -1.4;
    const silverTargetY = 0.0;
    const goldTargetY = 1.4;

    const bronzeMesh = createTierMesh(4.4, 4.9, 0.7, bronzeMat, bronzeEdgeMat);
    bronzeMesh.position.y = -6.0;
    medallionGroup.add(bronzeMesh);

    const silverMesh = createTierMesh(3.2, 3.6, 0.65, silverMat, silverEdgeMat);
    silverMesh.position.y = 0.0;
    medallionGroup.add(silverMesh);

    const goldMesh = createTierMesh(2.0, 2.3, 0.6, goldMat, goldEdgeMat);
    goldMesh.position.y = 6.0;
    medallionGroup.add(goldMesh);

    // Apex Crown Prism
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

    // Orbital Ring with Data Beads
    const ringGeom = new THREE.TorusGeometry(5.6, 0.035, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.45
    });
    const orbitalRing = new THREE.Mesh(ringGeom, ringMat);
    orbitalRing.rotation.x = Math.PI / 2 + 0.2;
    medallionGroup.add(orbitalRing);

    // =========================================================================
    // 4. THE SOVEREIGN CYBER FALCON (Procedural Low-Poly Kinetic Raptor)
    // =========================================================================
    const falconGroup = new THREE.Group();
    scene.add(falconGroup);

    // Falcon Materials
    const falconBodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Obsidian fuselage
      roughness: 0.25,
      metalness: 0.92,
      flatShading: true
    });
    const falconEdgeMat = new THREE.LineBasicMaterial({
      color: 0x34d399, // Cyber emerald edge glow
      transparent: true,
      opacity: 0.9
    });
    const beakMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Burnished gold beak
      roughness: 0.2,
      metalness: 0.95,
      flatShading: true
    });
    const visorMat = new THREE.MeshBasicMaterial({
      color: 0x10b981 // Neon emerald optic sensor visor
    });
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.88,
      flatShading: true
    });
    const wingEdgeMat = new THREE.LineBasicMaterial({
      color: 0x6ee7b7,
      transparent: true,
      opacity: 0.85
    });

    // A. Torso & Aerodynamic Keel
    const torsoGeom = new THREE.ConeGeometry(0.55, 2.4, 5);
    torsoGeom.rotateX(Math.PI / 2); // Align forward along +Z
    const torsoMesh = new THREE.Mesh(torsoGeom, falconBodyMat);
    const torsoEdges = new THREE.LineSegments(new THREE.EdgesGeometry(torsoGeom), falconEdgeMat);
    torsoMesh.add(torsoEdges);
    falconGroup.add(torsoMesh);

    // B. Predatory Head & Optic Visor
    const headGeom = new THREE.ConeGeometry(0.38, 0.9, 5);
    headGeom.rotateX(Math.PI / 2 + 0.1);
    const headMesh = new THREE.Mesh(headGeom, falconBodyMat);
    headMesh.position.set(0, 0.25, 1.4);
    const headEdges = new THREE.LineSegments(new THREE.EdgesGeometry(headGeom), falconEdgeMat);
    headMesh.add(headEdges);

    // Gold Beak
    const beakGeom = new THREE.ConeGeometry(0.18, 0.55, 4);
    beakGeom.rotateX(Math.PI / 2 + 0.3);
    const beakMesh = new THREE.Mesh(beakGeom, beakMat);
    beakMesh.position.set(0, -0.05, 0.55);
    headMesh.add(beakMesh);

    // Optic Visor Bar
    const visorGeom = new THREE.BoxGeometry(0.42, 0.08, 0.16);
    const visorMesh = new THREE.Mesh(visorGeom, visorMat);
    visorMesh.position.set(0, 0.1, 0.25);
    headMesh.add(visorMesh);

    falconGroup.add(headMesh);

    // C. Splayed Tail Aerofoils
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.05, -1.2);

    for (let t = -1; t <= 1; t++) {
      const tailFeatherGeom = new THREE.BoxGeometry(0.4, 0.04, 1.3);
      const tailFeather = new THREE.Mesh(tailFeatherGeom, wingMat);
      tailFeather.position.set(t * 0.28, 0, -0.5);
      tailFeather.rotation.y = t * 0.25;
      const tailEdges = new THREE.LineSegments(new THREE.EdgesGeometry(tailFeatherGeom), wingEdgeMat);
      tailFeather.add(tailEdges);
      tailGroup.add(tailFeather);
    }
    falconGroup.add(tailGroup);

    // D. Articulated Left Wing (Shoulder -> Inner Wing -> Elbow -> Outer Wingtip)
    const leftShoulder = new THREE.Group();
    leftShoulder.position.set(-0.35, 0.1, 0.3);

    const innerWingGeomL = new THREE.BoxGeometry(1.6, 0.06, 0.9);
    const innerWingMeshL = new THREE.Mesh(innerWingGeomL, wingMat);
    innerWingMeshL.position.set(-0.8, 0, -0.1);
    const innerEdgesL = new THREE.LineSegments(new THREE.EdgesGeometry(innerWingGeomL), wingEdgeMat);
    innerWingMeshL.add(innerEdgesL);
    leftShoulder.add(innerWingMeshL);

    const leftElbow = new THREE.Group();
    leftElbow.position.set(-1.6, 0, 0);

    const outerWingGeomL = new THREE.BoxGeometry(2.0, 0.04, 0.65);
    const outerWingMeshL = new THREE.Mesh(outerWingGeomL, wingMat);
    outerWingMeshL.position.set(-1.0, 0, -0.15);
    outerWingMeshL.rotation.y = -0.2;
    const outerEdgesL = new THREE.LineSegments(new THREE.EdgesGeometry(outerWingGeomL), wingEdgeMat);
    outerWingMeshL.add(outerEdgesL);
    leftElbow.add(outerWingMeshL);

    leftShoulder.add(leftElbow);
    falconGroup.add(leftShoulder);

    // E. Articulated Right Wing (Mirrored)
    const rightShoulder = new THREE.Group();
    rightShoulder.position.set(0.35, 0.1, 0.3);

    const innerWingGeomR = new THREE.BoxGeometry(1.6, 0.06, 0.9);
    const innerWingMeshR = new THREE.Mesh(innerWingGeomR, wingMat);
    innerWingMeshR.position.set(0.8, 0, -0.1);
    const innerEdgesR = new THREE.LineSegments(new THREE.EdgesGeometry(innerWingGeomR), wingEdgeMat);
    innerWingMeshR.add(innerEdgesR);
    rightShoulder.add(innerWingMeshR);

    const rightElbow = new THREE.Group();
    rightElbow.position.set(1.6, 0, 0);

    const outerWingGeomR = new THREE.BoxGeometry(2.0, 0.04, 0.65);
    const outerWingMeshR = new THREE.Mesh(outerWingGeomR, wingMat);
    outerWingMeshR.position.set(1.0, 0, -0.15);
    outerWingMeshR.rotation.y = 0.2;
    const outerEdgesR = new THREE.LineSegments(new THREE.EdgesGeometry(outerWingGeomR), wingEdgeMat);
    outerWingMeshR.add(outerEdgesR);
    rightElbow.add(outerWingMeshR);

    rightShoulder.add(rightElbow);
    falconGroup.add(rightShoulder);

    // Initial scale for majestic proportions
    falconGroup.scale.set(0.85, 0.85, 0.85);

    // =========================================================================
    // 5. MOUSE PARALLAX & TELEMETRY
    // =========================================================================
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
        return;
      }

      animId = requestAnimationFrame(animLoop);
      const elapsed = clock.getElapsedTime();

      // Medallion Spring assembly
      if (assemblyProgress < 1) {
        assemblyProgress = Math.min(1, assemblyProgress + 0.025);
        const ease = 1 - Math.pow(1 - assemblyProgress, 3);
        bronzeMesh.position.y = -6.0 + (bronzeTargetY - (-6.0)) * ease;
        goldMesh.position.y = 6.0 + (goldTargetY - 6.0) * ease;
      } else {
        bronzeMesh.position.y = bronzeTargetY + Math.sin(elapsed * 1.2) * 0.04;
        silverMesh.position.y = silverTargetY + Math.sin(elapsed * 1.2 + 0.8) * 0.04;
        goldMesh.position.y = goldTargetY + Math.sin(elapsed * 1.2 + 1.6) * 0.04;
        prismMesh.position.y = 2.6 + Math.sin(elapsed * 2.0) * 0.08;
      }

      medallionGroup.rotation.y += 0.003;
      prismMesh.rotation.y -= 0.015;
      prismMesh.rotation.x += 0.008;

      // Mouse parallax damping
      targetParallaxX += (mouseX * 0.15 - targetParallaxX) * 0.04;
      targetParallaxY += (-mouseY * 0.1 - targetParallaxY) * 0.04;

      medallionGroup.rotation.z = targetParallaxX * 0.8;
      medallionGroup.rotation.x = 0.35 + targetParallaxY * 0.8;

      // -----------------------------------------------------------------------
      // SOVEREIGN FALCON FLIGHT DYNAMICS & ARTICULATED WING FLAPPING
      // -----------------------------------------------------------------------
      const flapFrequency = 3.6;
      const flapSine = Math.sin(elapsed * flapFrequency);

      // Articulated dual-joint flap
      leftShoulder.rotation.z = flapSine * 0.42;
      leftElbow.rotation.z = Math.sin(elapsed * flapFrequency - 0.4) * 0.38;

      rightShoulder.rotation.z = -flapSine * 0.42;
      rightElbow.rotation.z = -Math.sin(elapsed * flapFrequency - 0.4) * 0.38;

      // Tail pitch & trim
      tailGroup.rotation.x = -flapSine * 0.08;

      // Flight trajectory: sweeping wide circular/figure-eight patrol around the lakehouse
      const flightSpeed = elapsed * 0.42;
      const patrolRadiusX = 8.2;
      const patrolRadiusZ = 5.8;

      const targetFalconX = Math.sin(flightSpeed) * patrolRadiusX + mouseX * 2.5;
      const targetFalconZ = Math.cos(flightSpeed) * patrolRadiusZ - 1.5;
      const targetFalconY = 2.8 + Math.sin(elapsed * 1.8) * 0.7 - mouseY * 1.8;

      // Smooth position interpolation
      falconGroup.position.x += (targetFalconX - falconGroup.position.x) * 0.05;
      falconGroup.position.y += (targetFalconY - falconGroup.position.y) * 0.05;
      falconGroup.position.z += (targetFalconZ - falconGroup.position.z) * 0.05;

      // Orient forward along tangent of orbit
      const headingAngle = flightSpeed + Math.PI / 2;
      falconGroup.rotation.y = headingAngle;

      // Bank into turns (roll) + mouse parallax bank
      const bankAngle = -0.42 + mouseX * 0.3;
      falconGroup.rotation.z = bankAngle;

      // Subtle dive/climb pitch
      falconGroup.rotation.x = Math.sin(elapsed * 1.8) * 0.12 - mouseY * 0.2;

      renderer.render(scene, camera);
    };

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
      falconBodyMat.dispose();
      beakMat.dispose();
      wingMat.dispose();
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
              <span className="text-2xl font-mono text-emerald-400 font-bold">🦅</span>
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
