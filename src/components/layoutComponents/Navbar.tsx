import React from "react";
import Link from "next/link";
import { currentUserProfile } from "@/lib/authDet";
import Image from "next/image";
import { Search, PenLine } from "lucide-react";

const navLinks = [
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about-us" },
  { name: "Tags", href: "/tags" },
];

const Navbar = async ({ dark = false }: { dark?: boolean }) => {
  const image = await currentUserProfile();
  const isDark = dark;

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 transition-all duration-300">
      <div className="bb-container flex items-center justify-between h-14">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-[1.15rem] font-bold tracking-tight shrink-0 text-[rgb(9,9,11)] hover:opacity-70 transition-opacity"
        >
          Biyond<span className="text-[#462C7D]">Bytes</span>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-gray-500 hover:text-[rgb(9,9,11)] transition-colors tracking-wide"
            >
              {l.name}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="p-2 text-gray-400 hover:text-[rgb(9,9,11)] hover:bg-gray-100 rounded-full transition-all"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </Link>

          {!!image ? (
            <>
              <Link
                href="/write/new"
                className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-[rgb(9,9,11)] hover:bg-gray-100 px-3 py-1.5 rounded-full transition-all"
              >
                <PenLine className="w-3.5 h-3.5" />
                Write
              </Link>
              <Link href="/settings">
                <Image
                  src={image}
                  alt="profile"
                  width={30}
                  height={30}
                  className="rounded-full w-[30px] h-[30px] object-cover ring-1 ring-gray-200 hover:ring-[#462C7D] transition-all"
                />
              </Link>
            </>
          ) : (
            <Link
              href="/byAuthBtn"
              className="text-[13px] font-semibold text-gray-700 hover:text-[rgb(9,9,11)] border border-gray-200 hover:border-gray-400 px-4 py-1.5 rounded-full transition-all duration-200"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
