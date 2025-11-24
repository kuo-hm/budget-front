'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'framer-motion';
import { fadeIn } from '@/lib/utils/animations';

function CoinSegment({ angle, distance, index }: { angle: number; distance: number; index: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/coin.glb');

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * (0.5 + index * 0.1);
    }
  });

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  const x = Math.cos(angle) * distance;
  const z = Math.sin(angle) * distance;

  return (
    <group ref={meshRef} position={[x, 0, z]} scale={[0.3, 0.3, 0.3]}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload('/models/coin.glb');

function PieChart3D() {
  const groupRef = useRef<THREE.Group>(null);

  const segments = useMemo(() => {
    const count = 12;
    const radius = 2;
    const coins = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      coins.push({ angle, distance: radius, index: i });
    }
    return coins;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.mouse.x * 0.5;
      groupRef.current.rotation.x = state.mouse.y * 0.3;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      <directionalLight position={[0, 10, 5]} intensity={0.5} />
      <group ref={groupRef}>
        {segments.map((segment, index) => (
          <CoinSegment
            key={index}
            angle={segment.angle}
            distance={segment.distance}
            index={index}
          />
        ))}
      </group>
      <OrbitControls enableZoom={false} />
    </>
  );
}

export function InteractivePieChart() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5]);

  return (
    <section
      ref={sectionRef}
      id="demo"
      className="py-20 px-4 relative overflow-hidden"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Visualize Your
            <span className="text-primary"> Spending Patterns</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Interactive 3D charts help you understand where your money goes
          </p>
        </motion.div>

        <motion.div
          style={{ opacity, scale }}
          className="h-[500px] w-full relative"
        >
          <Canvas>
            <PieChart3D />
          </Canvas>
        </motion.div>
      </div>
    </section>
  );
}

