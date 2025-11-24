'use client';

import { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, useGLTF } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { fadeIn } from '@/lib/utils/animations';

useGLTF.preload('/models/coin.glb');

function PieChart3D() {
  const { scene } = useGLTF('/models/coin.glb');

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      <directionalLight position={[0, 10, 5]} intensity={0.5} />
      <group position={[0, 0, 0]}>
        <primitive object={clonedScene} scale={[2.5, 2.5, 2.5]} />
      </group>
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
      className="py-20 px-4 relative "
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
          className="relative w-full aspect-square max-w-4xl mx-auto"
        >
          <Canvas>
            <PieChart3D />
          </Canvas>
        </motion.div>
      </div>
    </section>
  );
}

