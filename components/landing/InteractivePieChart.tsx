'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Html, Center, Float } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { fadeIn } from '@/lib/utils/animations';
import * as THREE from 'three';

const data = [
  { name: 'Housing', value: 35, color: '#8b5cf6' }, // Violet
  { name: 'Food', value: 25, color: '#3b82f6' },    // Blue
  { name: 'Transport', value: 20, color: '#10b981' }, // Emerald
  { name: 'Entertainment', value: 15, color: '#f59e0b' }, // Amber
  { name: 'Savings', value: 5, color: '#ef4444' },    // Red
];

function PieSlice({
  startAngle,
  endAngle,
  color,
  radius = 2,
  depth = 0.5,
  label,
  value,
  isSelected,
  onHover,
  onOut
}: {
  startAngle: number;
  endAngle: number;
  color: string;
  radius?: number;
  depth?: number;
  label: string;
  value: number;
  isSelected: boolean;
  onHover: () => void;
  onOut: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.arc(0, 0, radius, startAngle, endAngle, false);
    shape.lineTo(0, 0);
    return shape;
  }, [startAngle, endAngle, radius]);

  const extrudeSettings = useMemo(() => ({
    depth,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 10,
  }), [depth]);

  // Calculate center of the slice for label positioning and movement
  const midAngle = (startAngle + endAngle) / 2;
  const x = Math.cos(midAngle);
  const y = Math.sin(midAngle);

  // Animation for hover/selection
  useFrame((state, delta) => {
    if (meshRef.current) {
      const targetScale = hovered || isSelected ? 1.1 : 1;
      const targetX = (hovered || isSelected) ? x * 0.2 : 0;
      const targetY = (hovered || isSelected) ? y * 0.2 : 0;

      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), delta * 10);
      meshRef.current.position.lerp(new THREE.Vector3(targetX, targetY, 0), delta * 10);
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover();
        }}
        onPointerOut={(e) => {
          setHovered(false);
          onOut();
        }}
      >
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.2}
          emissive={color}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>
      {(hovered || isSelected) && (
        <Html
          position={[x * radius * 0.8, y * radius * 0.8, depth + 0.5]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-background/90 backdrop-blur-md border border-border p-2 rounded-lg shadow-xl text-xs whitespace-nowrap pointer-events-none">
            <div className="font-bold text-foreground">{label}</div>
            <div className="text-muted-foreground">{value}%</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function PieChart3D() {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  let currentAngle = 0;
  const total = data.reduce((acc, item) => acc + item.value, 0);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smooth entry animation
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 2);
    }
  });

  return (
    <group ref={groupRef} scale={[0, 0, 0]} rotation={[0.5, 0, 0]}> {/* Tilt the chart slightly */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Center>
          {data.map((item, index) => {
            const angle = (item.value / total) * Math.PI * 2;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle += angle;

            return (
              <PieSlice
                key={item.name}
                startAngle={startAngle}
                endAngle={endAngle}
                color={item.color}
                label={item.name}
                value={item.value}
                isSelected={hoveredIndex === index}
                onHover={() => setHoveredIndex(index)}
                onOut={() => setHoveredIndex(null)}
              />
            );
          })}
        </Center>
      </Float>
    </group>
  );
}

export function InteractivePieChart() {
  const sectionRef = useRef<HTMLDivElement>(null);

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
          className="relative w-full h-[500px] max-w-4xl mx-auto cursor-pointer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
            <spotLight
              position={[0, 10, 0]}
              intensity={0.8}
              angle={0.5}
              penumbra={1}
              castShadow
            />
            <PieChart3D />
          </Canvas>

          {/* Legend */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-4 bg-background/50 backdrop-blur-sm p-4 rounded-xl border border-border/50">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-muted-foreground">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

