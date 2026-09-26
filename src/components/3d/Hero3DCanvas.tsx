'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Hero3DCanvasProps {
  className?: string;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Node definitions (Botanical Light Green Data Engineering Pipeline)
    const nodeDefs = [
      { name: 'Kafka', pos: new THREE.Vector3(-14, 4, -2), color: 0x10b981, shape: 'octahedron' },
      { name: 'Spark', pos: new THREE.Vector3(-6, 7, 2), color: 0x34d399, shape: 'dodecahedron' },
      { name: 'Iceberg', pos: new THREE.Vector3(2, 5, -1), color: 0x6ee7b7, shape: 'icosahedron' },
      { name: 'Snowflake', pos: new THREE.Vector3(12, 6, 1), color: 0x059669, shape: 'octahedron' },
      { name: 'Airflow', pos: new THREE.Vector3(-8, -4, 0), color: 0x047857, shape: 'box' },
      { name: 'dbt', pos: new THREE.Vector3(4, -5, -3), color: 0xa7f3d0, shape: 'icosahedron' },
      { name: 'DuckDB', pos: new THREE.Vector3(13, -3, 2), color: 0x86efac, shape: 'dodecahedron' }
    ];

    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    const nodeMeshes: THREE.Mesh[] = [];

    nodeDefs.forEach(def => {
      let geom: THREE.BufferGeometry;
      if (def.shape === 'octahedron') geom = new THREE.OctahedronGeometry(1.3, 0);
      else if (def.shape === 'dodecahedron') geom = new THREE.DodecahedronGeometry(1.2, 0);
      else if (def.shape === 'icosahedron') geom = new THREE.IcosahedronGeometry(1.2, 0);
      else geom = new THREE.BoxGeometry(1.8, 1.8, 1.8);

      // Outer wireframe shell
      const wireMat = new THREE.MeshBasicMaterial({
        color: def.color,
        wireframe: true,
        transparent: true,
        opacity: 0.75
      });
      const outerMesh = new THREE.Mesh(geom, wireMat);
      outerMesh.position.copy(def.pos);

      // Inner glowing core
      const innerGeom = new THREE.SphereGeometry(0.65, 16, 16);
      const innerMat = new THREE.MeshBasicMaterial({
        color: def.color,
        transparent: true,
        opacity: 0.6
      });
      const innerMesh = new THREE.Mesh(innerGeom, innerMat);
      outerMesh.add(innerMesh);

      nodesGroup.add(outerMesh);
      nodeMeshes.push(outerMesh);
    });

    // Pipelines (Curves & Traveling Data Packets)
    const pipelineConnections = [
      [0, 1], // Kafka -> Spark
      [1, 2], // Spark -> Iceberg
      [2, 3], // Iceberg -> Snowflake
      [4, 1], // Airflow -> Spark
      [4, 5], // Airflow -> dbt
      [5, 2], // dbt -> Iceberg
      [5, 6]  // dbt -> DuckDB
    ];

    const curves: THREE.CatmullRomCurve3[] = [];
    const packets: { curveIdx: number; t: number; speed: number; mesh: THREE.Mesh }[] = [];

    pipelineConnections.forEach(([fromIdx, toIdx], cIdx) => {
      const p1 = nodeDefs[fromIdx].pos;
      const p2 = nodeDefs[toIdx].pos;
      const mid = new THREE.Vector3(
        (p1.x + p2.x) / 2 + (Math.random() - 0.5) * 3,
        (p1.y + p2.y) / 2 + (Math.random() - 0.5) * 3,
        (p1.z + p2.z) / 2 + (Math.random() - 0.5) * 2
      );

      const curve = new THREE.CatmullRomCurve3([p1, mid, p2]);
      curves.push(curve);

      // Branch / Pipeline Line representation (Emerald glow)
      const points = curve.getPoints(50);
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.45
      });
      const line = new THREE.Line(lineGeom, lineMat);
      scene.add(line);

      // Data packet (pulsing glowing mint sphere flowing along branch)
      const packetGeom = new THREE.SphereGeometry(0.28, 8, 8);
      const packetMat = new THREE.MeshBasicMaterial({
        color: 0x6ee7b7,
        transparent: true,
        opacity: 0.95
      });
      const packetMesh = new THREE.Mesh(packetGeom, packetMat);
      scene.add(packetMesh);

      packets.push({
        curveIdx: cIdx,
        t: Math.random(),
        speed: 0.003 + Math.random() * 0.003,
        mesh: packetMesh
      });
    });

    // Ambient 3D Particle Cloud (Data Dust)
    const particleCount = 280;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 60;
      positions[i + 1] = (Math.random() - 0.5) * 40;
      positions[i + 2] = (Math.random() - 0.5) * 40;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.18,
      transparent: true,
      opacity: 0.45
    });
    const particlePoints = new THREE.Points(particleGeom, particleMat);
    scene.add(particlePoints);

    // Mouse movement parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) * 0.0008;
      mouseY = (e.clientY - windowHalfY) * 0.0008;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Window Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Camera orbital parallax with damping
      targetX += (mouseX * 12 - targetX) * 0.05;
      targetY += (-mouseY * 8 - targetY) * 0.05;
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 0, 0);

      // Rotate nodes and pulse inner cores
      nodeMeshes.forEach((mesh, idx) => {
        mesh.rotation.x += 0.008 * (idx % 2 === 0 ? 1 : -1);
        mesh.rotation.y += 0.01;
        mesh.position.y += Math.sin(elapsedTime * 1.5 + idx) * 0.004;
      });

      // Move data packets along pipelines
      packets.forEach(p => {
        p.t += p.speed;
        if (p.t > 1) p.t = 0;
        const pt = curves[p.curveIdx].getPoint(p.t);
        p.mesh.position.copy(pt);
      });

      // Slowly drift background particle field
      particlePoints.rotation.y = elapsedTime * 0.02;
      particlePoints.rotation.x = elapsedTime * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};
