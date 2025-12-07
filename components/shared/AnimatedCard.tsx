'use client'

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { cardHoverVariants, fadeInUp } from '@/lib/utils/animations'
import { motion } from 'framer-motion'

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  delay?: number
  title?: string
}

export function AnimatedCard({
  children,
  className,
  hover = true,
  delay = 0,
  title,
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
          {title ? (
            <>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
              </CardHeader>
              <CardContent>{children}</CardContent>
            </>
          ) : (
            children
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}
