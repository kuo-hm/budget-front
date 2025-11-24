'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EnhancedFloatingCoins } from './EnhancedCoin';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { fadeIn, slideInFromLeft } from '@/lib/utils/animations';
import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

export function Hero3D() {
  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="absolute inset-0 opacity-40 -z-10">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} />
          <EnhancedFloatingCoins isHovering={isHovering} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
          />
        </Canvas>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <motion.h1
              variants={slideInFromLeft}
              initial="initial"
              animate="animate"
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
            >
              Master Your Money with
              <br />
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                AI-Powered Insights
              </span>
            </motion.h1>
          </motion.div>

          <motion.p
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Track expenses, set budgets, achieve goals - all in one beautiful platform
          </motion.p>

          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link href="#demo">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

