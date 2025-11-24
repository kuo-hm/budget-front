'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cardHoverVariants, fadeInUp } from '@/lib/utils/animations';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function AnimatedCard({ 
  children, 
  className,
  hover = true,
  delay = 0,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      transition={{ delay }}
    >
      <motion.div
        variants={hover ? cardHoverVariants : undefined}
        initial="rest"
        whileHover={hover ? 'hover' : undefined}
        whileTap={hover ? { scale: 0.98 } : undefined}
      >
        <Card className={cn('transition-shadow duration-300', className)}>
          {children}
        </Card>
      </motion.div>
    </motion.div>
  );
}

