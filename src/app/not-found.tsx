import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">

        <p className="font-serif text-[120px] md:text-[160px] font-bold text-gray-100 leading-none select-none">404</p>

        <div className="-mt-8 mb-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[rgb(9,9,11)] mb-3">Page Not Found</h2>
          <p className="text-[rgb(113,113,122)] leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[rgb(9,9,11)] text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link href="/search" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-[rgb(113,113,122)] rounded-full text-sm font-semibold hover:border-gray-400 hover:text-[rgb(9,9,11)] transition-colors">
            <Search className="w-4 h-4" /> Search Articles
          </Link>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <p className="text-xs text-gray-400 mb-4 uppercase tracking-widest">Popular pages</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[{ label: "Home", href: "/" }, { label: "About", href: "/about-us" }, { label: "Tags", href: "/tags" }, { label: "Contact", href: "/contact-us" }].map((l) => (
              <Link key={l.href} href={l.href} className="px-4 py-2 bg-white border border-gray-100 rounded-full text-sm text-[rgb(113,113,122)] hover:border-gray-300 hover:text-[rgb(9,9,11)] transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
