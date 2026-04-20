import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full min-h-screen flex">
      {/* Left: dark brand panel */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-[#0a0a0a] flex-col justify-between p-14 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(70,44,125,0.18) 0%, transparent 65%)", transform: "translate(30%, -30%)" }}
        />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(70,44,125,0.12) 0%, transparent 65%)", transform: "translate(-30%, 30%)" }}
        />

        {/* Logo */}
        <Link href="/" className="font-serif text-xl font-bold text-white tracking-tight relative z-10">
          Biyond<span style={{ color: "#9B7FD4" }}>Bytes</span>
        </Link>

        {/* Center quote */}
        <div className="relative z-10">
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/25 mb-6 flex items-center gap-2">
            <span className="w-5 h-px bg-white/20 inline-block" />
            Editorial Platform
          </p>
          <h2 className="font-serif text-[clamp(2rem,3.5vw,3rem)] font-bold text-white leading-[1.1] tracking-tight mb-6">
            Stories that go<br />
            <span className="inline-block bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #C4A8FF 0%, #A87FE8 50%, #7B5BB6 100%)" }}>
              beyond
            </span>{" "}
            <span>the bytes.</span>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Share your knowledge, connect with readers, and grow your audience on the platform built for creators.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-8">
          {[{ value: "10K+", label: "Readers" }, { value: "500+", label: "Articles" }, { value: "50+", label: "Writers" }].map(({ value, label }) => (
            <div key={label}>
              <p className="font-serif text-xl font-bold text-white">{value}</p>
              <p className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: form */}
      <div className="flex justify-center items-center w-full lg:w-[55%] px-6 py-20 bg-white">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </section>
  );
}
