"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, PenLine } from "lucide-react";

const TOPICS = ["Technology", "Design", "AI & ML", "Startups", "Culture", "Future of Work", "Open Source", "Science"];

const HeroSection: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-[#0a0a0a] overflow-hidden flex flex-col">

      {/* Very subtle grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Faint violet glow — top right only */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(70,44,125,0.1) 0%, transparent 65%)",
          transform: "translate(30%, -30%)",
        }}
      />

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-line-1 { animation: fade-up 0.7s ease forwards 0.1s; opacity: 0; }
        .hero-line-2 { animation: fade-up 0.7s ease forwards 0.25s; opacity: 0; }
        .hero-sub    { animation: fade-up 0.7s ease forwards 0.4s; opacity: 0; }
        .hero-cta    { animation: fade-up 0.7s ease forwards 0.55s; opacity: 0; }
        .hero-tags   { animation: fade-up 0.7s ease forwards 0.7s; opacity: 0; }
        .hero-stats  { animation: fade-up 0.5s ease forwards 0.8s; opacity: 0; }
      `}</style>

      {/* ── Top bar ──────────────────────────────────── */}
      <div className="relative z-10 border-b border-white/[0.06]">
        <div className="bb-container py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#462C7D] opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#462C7D]" />
            </span>
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/30">
              BiyondBytes Editorial
            </p>
          </div>
          <Link
            href="/blog"
            className="text-[10px] font-bold tracking-widest uppercase text-white/25 hover:text-white/60 transition-colors flex items-center gap-1 group"
          >
            Explore all
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ── Main content ────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center bb-container py-24 md:py-32">

        {/* Eyebrow */}
        {mounted && (
          <p className="hero-line-1 text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 mb-8 flex items-center gap-3">
            <span className="w-8 h-px bg-white/20 inline-block" />
            Ideas · Technology · Culture
            <span className="w-8 h-px bg-white/20 inline-block" />
          </p>
        )}

        {/* Headline */}
        <h1 className="font-serif font-bold leading-[1.05] tracking-tight mb-7">
          {mounted && (
            <>
              <span className="hero-line-1 block text-[clamp(3rem,7.5vw,6rem)] text-white">
                Stories that go
              </span>
              <span className="hero-line-2 block text-[clamp(3rem,7.5vw,6rem)]">
                <span
                  className="inline-block bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(95deg, #C4A8FF 0%, #A87FE8 50%, #7B5BB6 100%)" }}
                >
                  beyond
                </span>
                <span className="text-white"> the bytes.</span>
              </span>
            </>
          )}
        </h1>

        {/* Sub */}
        {mounted && (
          <p className="hero-sub text-base md:text-lg text-white/35 max-w-xl mx-auto leading-relaxed mb-10 font-light">
            Explore technology, design, and culture from writers who think deeply about the world we&apos;re building.
          </p>
        )}

        {/* CTAs */}
        {mounted && (
          <div className="hero-cta flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 bg-white text-[#0a0a0a] text-sm font-bold px-7 py-3 rounded-full hover:bg-[#462C7D]/10 transition-all duration-200"
            >
              <BookOpen className="w-4 h-4" />
              Start Reading
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/write/new"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white border border-white/[0.1] hover:border-white/25 px-7 py-3 rounded-full transition-all duration-200"
            >
              <PenLine className="w-4 h-4" />
              Write a Story
            </Link>
          </div>
        )}

        {/* Topic tags */}
        {mounted && (
          <div className="hero-tags mt-14 flex flex-wrap justify-center gap-2 max-w-2xl">
            {TOPICS.map((tag) => (
              <Link
                key={tag}
                href="/tags"
                className="text-[11px] font-semibold text-white/30 border border-white/[0.07] hover:border-[#462C7D]/50 hover:text-[#9B7FD4] px-3.5 py-1.5 rounded-full transition-all duration-200"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Stats bar ──────────────────────────────── */}
      {mounted && (
        <div className="hero-stats relative z-10 border-t border-white/[0.06]">
          <div className="bb-container py-5">
            <div className="grid grid-cols-3 divide-x divide-white/[0.06]">
              {[
                { value: "10K+", label: "Monthly Readers" },
                { value: "500+", label: "Articles" },
                { value: "50+", label: "Writers" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center px-4">
                  <p className="text-xl font-bold text-white font-serif">{value}</p>
                  <p className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
