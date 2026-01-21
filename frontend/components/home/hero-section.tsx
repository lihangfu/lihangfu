"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { BowArrow } from "lucide-react";

export interface HeroSectionProps {
  className?: string;
}

/**
 * Hero Section - 首页 Hero 展示
 */
export const HeroSection = React.memo(function HeroSection({
  className,
}: HeroSectionProps) {
  const [quote, setQuote] = React.useState({
    hitokoto: "正在加载...",
    from: "Loading",
  });
  const [date] = React.useState(
    new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric" }),
  );

  // 调用一言 API
  React.useEffect(() => {
    fetch("https://v1.hitokoto.cn")
      .then((res) => res.json())
      .then((data) => setQuote(data))
      .catch(() =>
        setQuote({
          hitokoto: "万物皆有裂痕，那是光照进来的地方。",
          from: "莱昂纳德·科恩",
        }),
      );
  }, []);

  return (
    <section className={cn("w-full", className)}>
      <div className="min-h-screen text-slate-900 selection:bg-indigo-100 overflow-hidden">
        {/* header */}
        <nav className="max-w-7xl mx-auto px-8 py-10 flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <BowArrow className="w-6 h-6 text-indigo-500 group-hover:rotate-12 transition-transform" />
            <span className="text-lg font-semibold tracking-tight">
              lihangfu
            </span>
          </div>
          <button className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            About / 关于
          </button>
        </nav>

        {/* main */}
        <main className="max-w-7xl mx-auto px-8 pt-12 md:pt-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* left */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="space-y-2">
              <h1 className="text-8xl font-bold tracking-tighter text-slate-900 leading-none">
                lihangfu
              </h1>
              <p className="text-2xl font-light text-slate-400 tracking-[0.2em] uppercase">
                Daily Wisdom / 一言
              </p>
            </div>
            <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
            <p className="max-w-md text-slate-500 leading-relaxed italic">
              {quote.hitokoto}
            </p>
          </div>

          {/* right */}
          <div className="relative h-125 flex items-center justify-center">
            {/* 底层装饰卡片 (浅靛蓝) */}
            <div className="absolute w-64 h-80 bg-indigo-50/50 rounded-[2.5rem] -rotate-12 -translate-x-25 blur-[1px]"></div>

            {/* 中间层装饰卡片 (浅紫) */}
            <div className="absolute w-64 h-80 bg-purple-50/50 rounded-[2.5rem] rotate-6 translate-x-10 -translate-y-5 blur-[1px]"></div>

            {/* 主展示卡片 (磨砂玻璃风格) */}
            <div className="absolute w-72 h-96 bg-white/80 backdrop-blur-xl border border-white/20 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] z-10 flex flex-col p-8 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">
                  Daily
                </span>
                <div className="w-2 h-2 rounded-full bg-slate-200"></div>
              </div>

              <div className="mt-12 grow">
                <p className="text-xl font-medium leading-relaxed text-slate-800 line-clamp-6">
                  {quote.hitokoto}
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-50">
                <p className="text-sm font-bold text-slate-900">
                  — {quote.from || "未知"}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">
                  {date}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
});
