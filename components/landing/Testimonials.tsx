"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/utils/animations";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Freelance Designer",
    image: "https://i.pravatar.cc/150?u=sarah",
    content: "The 3D visualizations completely changed how I look at my finances. It's not just a spreadsheet anymore, it's an immersive experience.",
  },
  {
    name: "Marcus Johnson",
    role: "Small Business Owner",
    image: "https://i.pravatar.cc/150?u=marcus",
    content: "BudgetTracker has helped me cut my monthly expenses by 30%. The goal tracking with milestone celebrations is incredibly motivating.",
  },
  {
    name: "Elena Rodriguez",
    role: "Software Engineer",
    image: "https://i.pravatar.cc/150?u=elena",
    content: "Finally, a finance app that looks as good as it works. The smooth animations and dark mode are a joy to use everyday.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 px-4 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by
            <span className="text-primary"> Thousands</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join the community of users taking control of their financial future
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-1 mb-4 text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
