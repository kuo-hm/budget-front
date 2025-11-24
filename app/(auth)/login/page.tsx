'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { LoginForm } from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/utils/animations';

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.3} />
      </mesh>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 opacity-20">
        <Canvas>
          <Scene />
        </Canvas>
      </div>
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="relative z-10 w-full px-4"
      >
        <LoginForm />
      </motion.div>
    </div>
  );
}
