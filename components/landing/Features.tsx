'use client';

import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/shared/AnimatedCard';
import { staggerContainer, fadeInUp } from '@/lib/utils/animations';
import {
  TrendingUp,
  Bell,
  Globe,
  Target,
  BarChart3,
  Download,
} from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Real-time Expense Tracking',
    description: 'Track your spending in real-time with automatic categorization and smart insights.',
  },
  {
    icon: Bell,
    title: 'Smart Budget Alerts',
    description: 'Get notified when you approach budget limits with intelligent alerts and recommendations.',
  },
  {
    icon: Globe,
    title: 'Multi-currency Support',
    description: 'Manage finances across multiple currencies with automatic conversion and tracking.',
  },
  {
    icon: Target,
    title: 'Goal Tracking with Milestones',
    description: 'Set financial goals and track progress with visual milestones and achievements.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics & Insights',
    description: 'Deep dive into your spending patterns with comprehensive analytics and AI-powered insights.',
  },
  {
    icon: Download,
    title: 'CSV Import/Export',
    description: 'Import transactions from banks or export your data for external analysis.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4 bg-card/50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to
            <span className="text-primary"> Manage Your Finances</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you take control of your money
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <AnimatedCard className="h-full p-6">
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </AnimatedCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

