"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect } from "react";
import { Mesh, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface CoinProps {
  position: Vector3;
  speed: number;
  modelPath?: string;
}

function Coin({ position, speed, modelPath = "/models/coin.glb" }: CoinProps) {
  const meshRef = useRef<Mesh>(null);
  const { scene } = useGLTF(modelPath);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y =
        position.y + Math.sin(state.clock.elapsedTime * speed) * 0.5;
      meshRef.current.position.x =
        position.x + Math.cos(state.clock.elapsedTime * speed * 0.5) * 0.3;
    }
  });

  if (scene) {
    return (
      <primitive
        ref={meshRef}
        object={scene.clone()}
        position={position}
        scale={[0.5, 0.5, 0.5]}
      />
    );
  }

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

export function FloatingCoinModel() {
  const [coins, setCoins] = useState<{ position: Vector3; speed: number }[]>(
    []
  );

  useEffect(() => {
    const items: { position: Vector3; speed: number }[] = [];
    for (let i = 0; i < 15; i++) {
      items.push({
        position: new Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ),
        speed: 0.5 + Math.random() * 0.5,
      });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCoins(items);
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      {coins.map((coin, index) => (
        <Coin
          key={index}
          position={coin.position}
          speed={coin.speed}
          modelPath="/models/coin.glb"
        />
      ))}
    </>
  );
}

useGLTF.preload("/models/coin.glb");
