import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface HeroSectionProps {
  className?: string;
}

/**
 * Hero Section - 首页 Hero 展示
 */
export const HeroSection = React.memo(function HeroSection({
  className,
}: HeroSectionProps) {
  return (
    <section className={cn("w-full", className)}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative z-10 w-full h-screen flex flex-col justify-center px-6"
      >
        <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="max-w-5xl pt-20 lg:pt-0">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-foreground"
            >
              lihangfu <br />
              <span className="bg-clip-text text-primary">
                数字游民 & 全栈工程师
              </span>
            </motion.h1>
          </div>
        </div>
      </motion.div>
    </section>
  );
});
