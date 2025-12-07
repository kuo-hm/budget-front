'use client'

import { useFrame } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Vector3 } from 'three'

import { useGLTF } from '@react-three/drei'

interface CoinProps {
  position: Vector3
  speed: number
  rotationSpeed: number
  rotationDirection: number
  mousePosition: React.MutableRefObject<{
    x: number
    y: number
    isHovering: boolean
  }>
  selfFlipSpeed: number
}

function Coin({
  position,
  speed,
  rotationSpeed,
  rotationDirection,
  mousePosition,
}: CoinProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/coin.glb')

  useFrame((state) => {
    if (groupRef.current) {
      const baseRotation =
        state.clock.elapsedTime * rotationSpeed * rotationDirection

      groupRef.current.rotation.x = baseRotation

      if (mousePosition.current.isHovering) {
        const mouseInfluence = 0.3
        groupRef.current.rotation.x += mousePosition.current.y * mouseInfluence
        groupRef.current.rotation.z =
          mousePosition.current.x * mouseInfluence * 0.5
      } else {
        groupRef.current.rotation.z = 0
      }

      groupRef.current.rotation.y = 0

      groupRef.current.position.y =
        position.y + Math.sin(state.clock.elapsedTime * speed) * 0.2
      groupRef.current.position.z = position.z
      groupRef.current.position.x = position.x
    }
  })

  const clonedScene = useMemo(() => scene.clone(), [scene])

  return (
    <group ref={groupRef} position={position} scale={[0.15, 0.15, 0.15]}>
      <primitive object={clonedScene} position={[0, 0, 0]} />
    </group>
  )
}

interface EnhancedFloatingCoinsProps {
  isHovering?: boolean
}

export function EnhancedFloatingCoins({
  isHovering = false,
}: EnhancedFloatingCoinsProps) {
  const mousePositionRef = useRef({ x: 0, y: 0, isHovering: false })

  useGLTF.preload('/models/coin.glb')

  const [coins, setCoins] = React.useState<
    Array<{
      position: Vector3
      speed: number
      rotationSpeed: number
      rotationDirection: number
      selfFlipSpeed: number
    }>
  >([])

  React.useEffect(() => {
    const positions: Array<{
      position: Vector3
      speed: number
      rotationSpeed: number
      rotationDirection: number
      selfFlipSpeed: number
    }> = []
    for (let i = 0; i < 20; i++) {
      positions.push({
        position: new Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
        ),
        speed: 0.3 + Math.random() * 0.4,
        rotationSpeed: 0.2 + Math.random() * 0.8,
        rotationDirection: Math.random() > 0.5 ? 1 : -1,
        selfFlipSpeed: 1.5 + Math.random() * 1.0,
      })
    }

    setCoins(positions)
  }, [])

  return (
    <>
      <MouseTracker
        mousePositionRef={mousePositionRef}
        isHovering={isHovering}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      <directionalLight position={[0, 10, 5]} intensity={0.5} />
      {coins.map((coin, index) => (
        <Coin
          key={index}
          position={coin.position}
          speed={coin.speed}
          rotationSpeed={coin.rotationSpeed}
          rotationDirection={coin.rotationDirection}
          mousePosition={mousePositionRef}
          selfFlipSpeed={coin.selfFlipSpeed}
        />
      ))}
    </>
  )
}

function MouseTracker({
  mousePositionRef,
  isHovering,
}: {
  mousePositionRef: React.MutableRefObject<{
    x: number
    y: number
    isHovering: boolean
  }>
  isHovering: boolean
}) {
  useFrame(({ pointer }) => {
    mousePositionRef.current.x = pointer.x
    mousePositionRef.current.y = pointer.y
    mousePositionRef.current.isHovering = isHovering
  })
  return null
}
