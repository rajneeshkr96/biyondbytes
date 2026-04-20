"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaXTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaGithub } from "react-icons/fa6";
import { ArrowRight, Mail, Rss } from "lucide-react";
import { toast } from "react-toastify";

const navColumns = [
  {
    heading: "Explore",
    links: [
      { label: "All Articles", href: "/blog" },
      { label: "Tags & Topics", href: "/tags" },
      { label: "About Us", href: "/about-us" },
      { label: "Careers", href: "/career-page" },
    ],
  },
  {
    heading: "Write",
    links: [
      { label: "Start Writing", href: "/write/new" },
      { label: "Writer Guidelines", href: "/about-us" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-services" },
      { label: "Disclaimer", href: "/disclaimer-page" },
    ],
  },
];

const socials = [
  { icon: FaXTwitter, href: "https://x.com/BiyondBytes", label: "X / Twitter" },
  { icon: FaInstagram, href: "https://www.instagram.com/biyondbytes/", label: "Instagram" },
  { icon: FaLinkedinIn, href: "https://www.linkedin.com/company/biyondbytes", label: "LinkedIn" },
  { icon: FaYoutube, href: "https://www.youtube.com/@biyondbytes", label: "YouTube" },
  { icon: FaGithub, href: "https://github.com/BiyondBytes", label: "GitHub" },
];

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      toast.success("You're subscribed! Welcome to BiyondBytes.");
      setEmail("");
      setLoading(false);
    }, 800);
  };

  return (
    <footer className="bg-gray-50 text-[rgb(9,9,11)] relative overflow-hidden border-t border-gray-100">
      {/* Top decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[#462C7D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bb-container relative z-10">
        {/* Newsletter section */}
        <div className="py-16 md:py-20 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Rss className="w-4 h-4 text-[#462C7D]" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#462C7D]">Newsletter</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[rgb(9,9,11)] leading-tight mb-3">
                Stay in the loop.
              </h2>
              <p className="text-gray-500 text-base leading-relaxed">
                Get the best stories, insights, and ideas delivered to your inbox every week. No spam, ever.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md md:ml-auto">
              <div className="flex-1 relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white border border-gray-200 text-[rgb(9,9,11)] text-sm pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-[#462C7D] transition-all placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="shrink-0 bg-[rgb(9,9,11)] hover:bg-gray-800 text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all duration-200 disabled:opacity-60 flex items-center gap-2"
              >
                {loading ? "..." : <><span>Subscribe</span><ArrowRight className="w-3.5 h-3.5" /></>}
              </button>
            </form>
          </div>
        </div>

        {/* Main footer content */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[rgb(9,9,11)] inline-block mb-4">
              Biyond<span className="text-[#462C7D]">Bytes</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-8">
              Stories, ideas, and perspectives from writers who think deeply about technology, design, and culture.
            </p>
            <div className="flex items-center gap-2.5">
              {socials.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#462C7D] hover:border-[#462C7D] hover:bg-[#462C7D]/10 transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {navColumns.map((col) => (
            <div key={col.heading}>
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-5">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-[rgb(9,9,11)] transition-colors duration-200 font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 font-medium">
            © {new Date().getFullYear()} BiyondBytes · All rights reserved
          </p>
          <p className="text-xs text-gray-400">
            Made with ♥ for curious minds
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
