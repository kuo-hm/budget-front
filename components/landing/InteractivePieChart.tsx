'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'framer-motion';
import { fadeIn } from '@/lib/utils/animations';

function PieChart3D() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.mouse.x * 0.5;
      groupRef.current.rotation.x = state.mouse.y * 0.3;
    }
  });

  const segments = [
    { color: '#8b5cf6', size: 0.3, angle: 0 },
    { color: '#3b82f6', size: 0.25, angle: Math.PI * 0.6 },
    { color: '#10b981', size: 0.2, angle: Math.PI * 1.2 },
    { color: '#f59e0b', size: 0.15, angle: Math.PI * 1.8 },
    { color: '#ef4444', size: 0.1, angle: Math.PI * 2.4 },
  ];

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <group ref={groupRef}>
        {segments.map((segment, index) => (
          <mesh
            key={index}
            rotation={[0, 0, segment.angle]}
            position={[0, 0, index * 0.1]}
          >
            <cylinderGeometry args={[segment.size, segment.size, 0.2, 32]} />
            <meshStandardMaterial
              color={segment.color}
              emissive={segment.color}
              emissiveIntensity={0.3}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
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

