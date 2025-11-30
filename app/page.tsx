"use client";

import { Hero3D } from "@/components/landing/Hero3D";
import { Features } from "@/components/landing/Features";
import { InteractivePieChart } from "@/components/landing/InteractivePieChart";
import { AnalyticsPreview } from "@/components/landing/AnalyticsPreview";
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
    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

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
      <Pricing />
      <Footer />
    </main>
  );
}
