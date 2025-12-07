'use client'

import { fadeInUp, staggerContainer } from '@/lib/utils/animations'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DollarSign, Target, TrendingDown, TrendingUp } from 'lucide-react'
import { useEffect, useRef } from 'react'
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
} from 'recharts'

const spendingData = [
  { month: 'Jan', amount: 2400 },
  { month: 'Feb', amount: 2100 },
  { month: 'Mar', amount: 2800 },
  { month: 'Apr', amount: 2200 },
  { month: 'May', amount: 3000 },
  { month: 'Jun', amount: 2500 },
]

const categoryData = [
  { name: 'Food', value: 35, color: '#8b5cf6' },
  { name: 'Transport', value: 25, color: '#3b82f6' },
  { name: 'Shopping', value: 20, color: '#10b981' },
  { name: 'Bills', value: 15, color: '#f59e0b' },
  { name: 'Other', value: 5, color: '#ef4444' },
]

const stats = [
  { icon: DollarSign, label: 'Total Income', value: '$12,450', trend: '+12%' },
  {
    icon: TrendingDown,
    label: 'Total Expenses',
    value: '$8,200',
    trend: '-5%',
  },
  { icon: Target, label: 'Savings Rate', value: '34%', trend: '+8%' },
  { icon: TrendingUp, label: 'Net Savings', value: '$4,250', trend: '+15%' },
]

export function AnalyticsPreview() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger)
    }

    // Delay slightly to ensure Recharts has rendered the SVG
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const linePath = document.querySelector('.recharts-line-curve')
        if (linePath) {
          try {
            const length = (linePath as SVGPathElement).getTotalLength()
            gsap.set(linePath, {
              strokeDasharray: length,
              strokeDashoffset: length,
            })
            gsap.to(linePath, {
              strokeDashoffset: 0,
              duration: 2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 60%',
              },
            })
          } catch (e) {
            console.warn('Could not animate chart line', e)
          }
        }
      }, sectionRef)
      return () => ctx.revert()
    }, 500) // 500ms delay to allow Recharts to render

    return () => clearTimeout(timer)
  }, [])

  return (
    <section ref={sectionRef} className="bg-card/30 px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Powerful
            <span className="text-primary"> Analytics</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Get insights into your financial health with comprehensive analytics
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
          className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-lg border p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <Icon className="text-primary h-5 w-5" />
                  </div>
                  <span className="text-success text-sm font-medium">
                    {stat.trend}
                  </span>
                </div>
                <p className="text-muted-foreground mb-1 text-sm">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate={isInView ? 'animate' : 'initial'}
            className="bg-card rounded-lg border p-6"
          >
            <h3 className="mb-4 text-xl font-semibold">Spending Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={spendingData}>
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate={isInView ? 'animate' : 'initial'}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-lg border p-6"
          >
            <h3 className="mb-4 text-xl font-semibold">Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
