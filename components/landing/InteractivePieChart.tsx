'use client'

import { fadeIn } from '@/lib/utils/animations'
import { Center, Float, Html, PerspectiveCamera } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const data = [
  { name: 'Housing', value: 35, color: '#8b5cf6' }, // Violet
  { name: 'Food', value: 25, color: '#3b82f6' }, // Blue
  { name: 'Transport', value: 20, color: '#10b981' }, // Emerald
  { name: 'Entertainment', value: 15, color: '#f59e0b' }, // Amber
  { name: 'Savings', value: 5, color: '#ef4444' }, // Red
]

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
  onOut,
}: {
  startAngle: number
  endAngle: number
  color: string
  radius?: number
  depth?: number
  label: string
  value: number
  isSelected: boolean
  onHover: () => void
  onOut: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const shape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.arc(0, 0, radius, startAngle, endAngle, false)
    shape.lineTo(0, 0)
    return shape
  }, [startAngle, endAngle, radius])

  const extrudeSettings = useMemo(
    () => ({
      depth,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 10,
    }),
    [depth],
  )

  // Calculate center of the slice for label positioning and movement
  const midAngle = (startAngle + endAngle) / 2
  const x = Math.cos(midAngle)
  const y = Math.sin(midAngle)

  // Animation for hover/selection
  useFrame((state, delta) => {
    if (meshRef.current) {
      const targetScale = hovered || isSelected ? 1.1 : 1
      const targetX = hovered || isSelected ? x * 0.2 : 0
      const targetY = hovered || isSelected ? y * 0.2 : 0

      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, 1),
        delta * 10,
      )
      meshRef.current.position.lerp(
        new THREE.Vector3(targetX, targetY, 0),
        delta * 10,
      )
    }
  })

  return (
    <group>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          onHover()
        }}
        onPointerOut={() => {
          setHovered(false)
          onOut()
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
          <div className="bg-background/90 border-border pointer-events-none rounded-lg border p-2 text-xs whitespace-nowrap shadow-xl backdrop-blur-md">
            <div className="text-foreground font-bold">{label}</div>
            <div className="text-muted-foreground">{value}%</div>
          </div>
        </Html>
      )}
    </group>
  )
}

function PieChart3D() {
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const slices = useMemo(() => {
    const total = data.reduce((acc, item) => acc + item.value, 0)

    return data.reduce(
      (acc, item) => {
        const angle = (item.value / total) * Math.PI * 2
        const startAngle = acc.currentAngle
        const endAngle = acc.currentAngle + angle

        acc.items.push({
          ...item,
          startAngle,
          endAngle,
        })
        acc.currentAngle += angle
        return acc
      },
      {
        items: [] as ((typeof data)[0] & {
          startAngle: number
          endAngle: number
        })[],
        currentAngle: 0,
      },
    ).items
  }, [])

  /* Removed conflicting useFrame scale animation to let GSAP control it */
  /* useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 2);
    }
  }); */

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger)
    }

    const ctx = gsap.context(() => {
      if (groupRef.current) {
        // Reset scale initially
        groupRef.current.scale.set(0, 0, 0)

        gsap.to(groupRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1.5,
          ease: 'back.out(1.2)', // Add a nice bounce
          scrollTrigger: {
            trigger: '#demo', // Target the section ID
            start: 'top 70%',
            end: 'center center',
            scrub: 1,
          },
        })

        gsap.from(groupRef.current.rotation, {
          y: Math.PI * 2,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#demo',
            start: 'top 70%',
            end: 'center center',
            scrub: 1,
          },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <group ref={groupRef} scale={[0, 0, 0]} rotation={[0.5, 0, 0]}>
      {' '}
      {/* Tilt the chart slightly */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Center>
          {slices.map((item, index) => (
            <PieSlice
              key={item.name}
              startAngle={item.startAngle}
              endAngle={item.endAngle}
              color={item.color}
              label={item.name}
              value={item.value}
              isSelected={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onOut={() => setHoveredIndex(null)}
            />
          ))}
        </Center>
      </Float>
    </group>
  )
}

export function InteractivePieChart() {
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={sectionRef}
      id="demo"
      className="relative overflow-hidden px-4 py-20"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Visualize Your
            <span className="text-primary"> Spending Patterns</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Interactive 3D charts help you understand where your money goes
          </p>
        </motion.div>

        <motion.div
          className="relative mx-auto h-[500px] w-full max-w-4xl cursor-pointer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} castShadow />
            <pointLight
              position={[-10, -10, -10]}
              intensity={0.5}
              color="#3b82f6"
            />
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
          <div className="bg-background/50 border-border/50 absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-wrap justify-center gap-4 rounded-xl border p-4 backdrop-blur-sm">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground text-sm font-medium">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
