"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";

// ─── DATA ────────────────────────────────────────────────────────────────────
const links = [
  { name: "Home",        link: "/" },
  { name: "BiyondBytes", link: "/biyondbytes" },
  { name: "Team Page",   link: "/team" },
  { name: "Blog Reel",   link: "/blog" },
  { name: "About Us",    link: "/about" },
  { name: "Contact Us",  link: "/contact" },
];

// Replace these with your real per-page background images
const backgroundImages = [
  // "https://dev-to-uploads.s3.amazonaws.com/uploads/articles/p38gsgk2j42ogrzf1rnm.gif",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=85",
  "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1400&q=85",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&q=85",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85",
  "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=1400&q=85",
];

const DEFAULT_BG = backgroundImages[0];

const TICKER_ITEMS = [
  "Latest Posts", "Design Systems", "Team Updates",
  "Blog Reel", "About BiyondBytes", "Contact Us",
  "Collection 2024", "Explore Now",
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const changeBg = (
  src: string,
  container: HTMLElement,
  currentRef: React.MutableRefObject<HTMLElement | null>
) => {
  // 🔥 REMOVE ALL OLD IMAGES FIRST
  container.querySelectorAll("img").forEach((img) => {
    if (img !== currentRef.current) img.remove();
  });

  const next = document.createElement("img");
  next.src = src;
  next.style.cssText = `
    position:absolute;top:0;left:0;width:100%;height:100%;
    object-fit:cover;opacity:0;
  `;

  container.appendChild(next);

  const prev = currentRef.current;
  currentRef.current = next;

  gsap.to(next, { opacity: 1, duration: 0.6 });

  if (prev) {
    gsap.to(prev, {
      opacity: 0,
      duration: 0.6,
      onComplete: () => prev.remove(),
    });
  }
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────
const HeroSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isHovering, setIsHovering]   = useState(false);

  const previewBgRef  = useRef<HTMLDivElement>(null);
  const currentImgRef = useRef<HTMLElement | null>(null);
  const hoverTimeout  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Entrance animations ──────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline rows slide up staggered
      gsap.fromTo(
        ".hero-hl-row .hero-hl-inner",
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.14, ease: "expo.out", delay: 0.2 }
      );

      // Sub-line fade
      gsap.fromTo(
        ".hero-subline",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.7 }
      );

      // CTA button
      gsap.fromTo(
        ".hero-cta",
        { opacity: 0, y: 20, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.5)", delay: 0.9 }
      );

      // Nav pills stagger from left
      gsap.fromTo(
        ".hero-nav-item",
        { opacity: 0, x: -28 },
        { opacity: 1, x: 0, duration: 0.7, stagger: 0.09, ease: "power3.out", delay: 0.4 }
      );

      // Ambient blobs pulse
      gsap.to(".hero-blob", {
        scale: 1.08,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 1.5,
      });
    });
    return () => ctx.revert();
  }, []);

  // ── Hover handlers ────────────────────────────────────────────────
  const handleMouseEnter = useCallback(
    (index: number) => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      setIsHovering(true);
      setActiveIndex(index);

      if (previewBgRef.current) {
        changeBg(backgroundImages[index] ?? DEFAULT_BG, previewBgRef.current, currentImgRef);
      }
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    hoverTimeout.current = setTimeout(() => {
      setActiveIndex(null);
      if (previewBgRef.current) {
        changeBg(DEFAULT_BG, previewBgRef.current, currentImgRef);
      }
    }, 120);
  }, []);

  useEffect(() => () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  }, []);

  return (
    <>
      {/* ── Global styles ──────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --hero-navy:     #050d1a;
          --hero-navy2:    #0a1628;
          --hero-electric: #00e5ff;
          --hero-violet:   #7b2fff;
          --hero-rose:     #ff2d78;
          --hero-text:     #e8eaf6;
          --hero-muted:    rgba(232,234,246,0.45);
          --hero-pill-bg:  rgba(255,255,255,0.055);
          --hero-pill-bd:  rgba(255,255,255,0.12);
        }

        /* ── Layout ── */
        .hero-root {
          position: relative;
          width: 100vw;
          height: 100dvh;
          overflow: hidden;
          background: var(--hero-navy);
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Grid texture ── */
        .hero-grid {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(0,229,255,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.028) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        /* ── Noise ── */
        .hero-noise {
          position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: 0.032;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
        }

        /* ── Ambient blobs ── */
        .hero-blobs { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .hero-blob {
          position: absolute; border-radius: 50%;
          filter: blur(88px); will-change: transform;
        }
        .hero-blob-1 {
          width: 560px; height: 560px;
          background: radial-gradient(circle, rgba(123,47,255,0.38) 0%, transparent 70%);
          top: -12%; right: 10%;
        }
        .hero-blob-2 {
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(0,229,255,0.28) 0%, transparent 70%);
          bottom: 0%; right: 28%;
        }
        .hero-blob-3 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(255,45,120,0.22) 0%, transparent 70%);
          top: 35%; right: 44%;
        }

        /* ── Navbar ── */
        .hero-navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 40px;
          backdrop-filter: blur(14px) saturate(1.5);
          -webkit-backdrop-filter: blur(14px) saturate(1.5);
          background: rgba(5,13,26,0.55);
          border-bottom: 0.5px solid rgba(255,255,255,0.07);
        }
        .hero-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px; letter-spacing: 0.14em;
          background: linear-gradient(120deg, #fff 0%, var(--hero-electric) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
        }
        .hero-login {
          font-size: 12.5px; font-weight: 400;
          letter-spacing: 0.07em; color: var(--hero-muted);
          text-decoration: none;
          transition: color 0.25s;
        }
        .hero-login:hover { color: var(--hero-electric); }

        /* ── Left panel ── */
        .hero-left {
          position: absolute; left: 0; top: 0; bottom: 0; z-index: 10;
          width: 300px;
          display: flex; flex-direction: column; justify-content: center;
          padding: 0 0 0 40px;
        }
        .hero-nav-links { display: flex; flex-direction: column; gap: 9px; }

        /* ── Nav pill ── */
        .hero-nav-item {
          position: relative;
          display: inline-flex; align-items: center; gap: 10px;
          padding: 10px 20px 10px 14px;
          background: var(--hero-pill-bg);
          border: 1px solid var(--hero-pill-bd);
          border-radius: 100px;
          cursor: pointer; width: fit-content;
          text-decoration: none;
          transition:
            background 0.32s ease,
            border-color 0.32s ease,
            transform 0.4s cubic-bezier(.16,1,.3,1),
            box-shadow 0.32s ease;
          overflow: hidden;
        }
        .hero-nav-item::after {
          content: '';
          position: absolute; inset: 0; border-radius: inherit;
          background: linear-gradient(135deg, rgba(0,229,255,0.1) 0%, rgba(123,47,255,0.06) 100%);
          opacity: 0; transition: opacity 0.32s;
        }
        .hero-nav-item:hover::after,
        .hero-nav-item.active::after { opacity: 1; }

        .hero-nav-item:hover,
        .hero-nav-item.active {
          border-color: rgba(0,229,255,0.42);
          background: rgba(0,229,255,0.06);
          transform: translateX(10px);
          box-shadow: 0 0 22px rgba(0,229,255,0.07);
        }

        .hero-nav-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--hero-electric);
          box-shadow: 0 0 7px var(--hero-electric);
          flex-shrink: 0; position: relative; z-index: 1;
          opacity: 0; transform: scale(0.4);
          transition: opacity 0.3s, transform 0.3s;
        }
        .hero-nav-item:hover .hero-nav-dot,
        .hero-nav-item.active .hero-nav-dot {
          opacity: 1; transform: scale(1);
        }

        .hero-nav-label {
          font-size: 13px; font-weight: 400;
          letter-spacing: 0.025em;
          color: rgba(232,234,246,0.6);
          position: relative; z-index: 1;
          transition: color 0.3s;
        }
        .hero-nav-item:hover .hero-nav-label,
        .hero-nav-item.active .hero-nav-label {
          color: #fff;
        }

        .hero-nav-arrow {
          margin-left: auto; position: relative; z-index: 1;
          color: var(--hero-electric); opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.3s, transform 0.35s cubic-bezier(.16,1,.3,1);
          font-size: 12px;
        }
        .hero-nav-item:hover .hero-nav-arrow,
        .hero-nav-item.active .hero-nav-arrow {
          opacity: 1; transform: translateX(0);
        }

        /* ── BG image layer ── */
        .hero-preview-bg {
          position: absolute;
          top: 0; right: 0;
          width: 72%; height: 100%;
          z-index: 2; overflow: hidden;
        }
        .hero-preview-bg::before {
          content: '';
          position: absolute; inset: 0; z-index: 3;
          background:
            linear-gradient(to right, var(--hero-navy) 0%, rgba(5,13,26,0.2) 30%, transparent 55%),
            linear-gradient(to bottom, transparent 55%, var(--hero-navy) 100%),
            linear-gradient(to top, transparent 90%, rgba(5,13,26,0.4) 100%);
        }
        .hero-scanline {
          position: absolute; left: 0; right: 0; height: 1.5px; z-index: 4;
          background: linear-gradient(90deg, transparent 0%, rgba(0,229,255,0.25) 40%, rgba(0,229,255,0.25) 60%, transparent 100%);
          animation: heroScan 9s linear infinite;
          pointer-events: none;
        }
        @keyframes heroScan {
          0%   { top: -2px; opacity: 0; }
          4%   { opacity: 1; }
          96%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .hero-preview-bg img {
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%; object-fit: cover;
        }

        /* ── Headline ── */
        .hero-center {
          position: absolute;
          top: 0; left: 260px; right: 0; bottom: 0;
          z-index: 8;
          display: flex; flex-direction: column; justify-content: center;
          padding: 0 64px;
          pointer-events: none;
        }
        .hero-hl-row { overflow: hidden; line-height: 0.88; }
        .hero-hl-inner {
          display: block;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(76px, 9vw, 148px);
          letter-spacing: 0.015em;
          color: #fff;
          will-change: transform;
        }
        .hero-hl-electric {
          background: linear-gradient(95deg, var(--hero-electric) 0%, #a8edff 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-hl-violet {
          background: linear-gradient(95deg, var(--hero-violet) 0%, #b580ff 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subline {
          margin-top: 22px;
          display: flex; align-items: center; gap: 14px;
          font-size: 11.5px; font-weight: 300;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--hero-muted);
        }
        .hero-subline-bar {
          display: block; width: 36px; height: 1px;
          background: linear-gradient(90deg, var(--hero-electric), transparent);
          flex-shrink: 0;
        }

        .hero-cta-row {
          margin-top: 34px;
          display: flex; align-items: center; gap: 28px;
          pointer-events: all;
        }
        .hero-cta {
          position: relative;
          display: inline-flex; align-items: center; gap: 10px;
          padding: 13px 30px;
          border-radius: 100px; text-decoration: none;
          font-size: 12.5px; font-weight: 500;
          letter-spacing: 0.08em; color: var(--hero-navy);
          background: linear-gradient(130deg, var(--hero-electric) 0%, #5eafff 50%, var(--hero-violet) 100%);
          background-size: 200% 200%; background-position: 0% 50%;
          box-shadow: 0 4px 28px rgba(0,229,255,0.22);
          transition: background-position 0.5s ease, transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
        }
        .hero-cta::before {
          content: '';
          position: absolute; inset: 0; border-radius: inherit;
          background: rgba(255,255,255,0.14);
          opacity: 0; transition: opacity 0.3s;
        }
        .hero-cta:hover {
          background-position: 100% 50%;
          transform: translateY(-2px);
          box-shadow: 0 8px 40px rgba(0,229,255,0.38);
        }
        .hero-cta:hover::before { opacity: 1; }

        .hero-scroll-hint {
          font-size: 10.5px; font-weight: 300;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--hero-muted);
        }

        /* ── Bottom bar / ticker ── */
        .hero-bottom-bar {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
          height: 36px;
          display: flex; align-items: center;
          border-top: 0.5px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(10px);
          background: rgba(5,13,26,0.75);
          overflow: hidden;
        }
        .hero-ticker {
          display: flex; align-items: center; gap: 0;
          animation: heroTicker 30s linear infinite;
          white-space: nowrap; will-change: transform;
        }
        @keyframes heroTicker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hero-ticker-item {
          display: inline-flex; align-items: center; gap: 16px;
          padding: 0 30px;
          font-size: 10.5px; font-weight: 300;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--hero-muted);
        }
        .hero-ticker-dot {
          width: 3.5px; height: 3.5px; border-radius: 50%;
          background: var(--hero-electric); opacity: 0.5; flex-shrink: 0;
        }

        /* ── Corner labels ── */
        .hero-corner {
          position: fixed; z-index: 200;
          font-size: 10px; font-weight: 300;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--hero-muted);
        }
        .hero-corner-bl { bottom: 46px; left: 40px; }
        .hero-corner-br { bottom: 46px; right: 40px; text-align: right; }

        /* ── Index tag ── */
        .hero-index-tag {
          position: fixed; top: 80px; right: 40px; z-index: 200;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 11px; letter-spacing: 0.18em;
          color: var(--hero-electric); opacity: 0.5;
        }

        /* ── Vertical rule ── */
        .hero-vline {
          position: absolute; top: 90px; bottom: 44px;
          left: 300px; z-index: 9;
          width: 0.5px;
          background: linear-gradient(to bottom, transparent, rgba(0,229,255,0.18) 30%, rgba(0,229,255,0.18) 70%, transparent);
        }
      `}</style>

      {/* ── Root ── */}
      <header className="hero-root">
        <div className="hero-grid" />
        <div className="hero-noise" />

        {/* Ambient blobs */}
        <div className="hero-blobs">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
        </div>

        {/* ── Navbar ── */}
        <nav className="hero-navbar">
          <Link href="/" className="hero-logo">BiyondBytes</Link>
          <Link href="/login" className="hero-login">Login</Link>
        </nav>

        {/* ── Index tag ── */}
        <span className="hero-index-tag">
          {activeIndex !== null ? `0${activeIndex + 1} / 0${links.length}` : "00 / 06"}
        </span>

        {/* ── Vertical divider ── */}
        <div className="hero-vline" />

        {/* ── Left nav ── */}
        <div className="hero-left">
          <nav className="hero-nav-links">
            {links.map((link, i) => (
              <Link
                key={i}
                href={link.link}
                className={`hero-nav-item${activeIndex === i ? " active" : ""}`}
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={handleMouseLeave}
              >
                <span className="hero-nav-dot" />
                <span className="hero-nav-label">{link.name}</span>
                <span className="hero-nav-arrow">→</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* ── BG image layer ── */}
        <div className="hero-preview-bg" ref={previewBgRef}>
          <div className="hero-scanline" />
          <Image
            src={DEFAULT_BG}
            alt="hero background"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* ── Headline ── */}
        <div className="hero-center">
          <div className="hero-hl-row">
            <span className="hero-hl-inner">
              HELLO,
            </span>
          </div>
          <div className="hero-hl-row">
            <span className="hero-hl-inner">
              WELCOME{" "}
              <span className="hero-hl-electric">TO</span>
            </span>
          </div>
          <div className="hero-hl-row">
            <span className="hero-hl-inner">
              <span className="hero-hl-violet">BIYOND</span>BYTES
            </span>
          </div>

          <p className="hero-subline">
            <span className="hero-subline-bar" />
            Explore Our Latest Posts
          </p>

          <div className="hero-cta-row">
            <Link href="/blog" className="hero-cta">
              Explore Now
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M1.5 6.5h10M8 2.5l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <span className="hero-scroll-hint">Scroll to Discover</span>
          </div>
        </div>

        {/* ── Bottom ticker ── */}
        <div className="hero-bottom-bar">
          <div className="hero-ticker">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="hero-ticker-item">
                <span className="hero-ticker-dot" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── Corner labels ── */}
        <span className="hero-corner hero-corner-bl">Match Shoreel</span>
        <span className="hero-corner hero-corner-br">Collection 2024</span>
      </header>
    </>
  );
};

export default HeroSection;