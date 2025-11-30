"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { fadeInUp, staggerContainer } from "@/lib/utils/animations";
import { TrendingUp, DollarSign, Target, TrendingDown } from "lucide-react";

const spendingData = [
  { month: "Jan", amount: 2400 },
  { month: "Feb", amount: 2100 },
  { month: "Mar", amount: 2800 },
  { month: "Apr", amount: 2200 },
  { month: "May", amount: 3000 },
  { month: "Jun", amount: 2500 },
];

const categoryData = [
  { name: "Food", value: 35, color: "#8b5cf6" },
  { name: "Transport", value: 25, color: "#3b82f6" },
  { name: "Shopping", value: 20, color: "#10b981" },
  { name: "Bills", value: 15, color: "#f59e0b" },
  { name: "Other", value: 5, color: "#ef4444" },
];

const stats = [
  { icon: DollarSign, label: "Total Income", value: "$12,450", trend: "+12%" },
  {
    icon: TrendingDown,
    label: "Total Expenses",
    value: "$8,200",
    trend: "-5%",
  },
  { icon: Target, label: "Savings Rate", value: "34%", trend: "+8%" },
  { icon: TrendingUp, label: "Net Savings", value: "$4,250", trend: "+15%" },
];

export function AnalyticsPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful
            <span className="text-primary"> Analytics</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get insights into your financial health with comprehensive analytics
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-lg p-6 border"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm text-success font-medium">
                    {stat.trend}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            className="bg-card rounded-lg p-6 border"
          >
            <h3 className="text-xl font-semibold mb-4">Spending Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={spendingData}>
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: "#8b5cf6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-lg p-6 border"
          >
            <h3 className="text-xl font-semibold mb-4">Category Breakdown</h3>
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
  );
}
