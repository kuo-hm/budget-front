'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { Mesh, Vector3 } from 'three';
import * as THREE from 'three';

interface CoinProps {
  position: Vector3;
  speed: number;
}

function Coin({ position, speed }: CoinProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * speed) * 0.5;
      meshRef.current.position.x = position.x + Math.cos(state.clock.elapsedTime * speed * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
      <meshStandardMaterial
        color="#8b5cf6"
        emissive="#8b5cf6"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

export function FloatingCoins() {
  const coins = useMemo(() => {
    const positions: Vector3[] = [];
    for (let i = 0; i < 15; i++) {
      positions.push(
        new Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        )
      );
    }
    return positions;
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      {coins.map((position, index) => (
        <Coin
          key={index}
          position={position}
          speed={0.5 + Math.random() * 0.5}
        />
      ))}
    </>
  );
}

