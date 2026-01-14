"use client";

import { HeroSection } from "@/components/home/hero-section";

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen bg-transparent text-foreground font-sans overflow-x-hidden selection:bg-primary selection:text-primary-foreground z-10">
      <HeroSection />
    </div>
  );
}
