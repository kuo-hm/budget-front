"use client";

import { Hero3D } from "@/components/landing/Hero3D";
import { Features } from "@/components/landing/Features";
import { InteractivePieChart } from "@/components/landing/InteractivePieChart";
import { AnalyticsPreview } from "@/components/landing/AnalyticsPreview";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  useEffect(() => {
    // Component-specific animations are handled within the components themselves
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main className="min-h-screen">
      <Hero3D />
      <Features />
      <InteractivePieChart />
      <AnalyticsPreview />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  );
}
