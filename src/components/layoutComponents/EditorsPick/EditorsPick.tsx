import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogcardProps } from '@/app/page';
import { ArrowRight, Clock } from 'lucide-react';

const CATEGORIES = ["All", "AI & ML", "Technology", "Design", "Culture", "Startups", "Future of Work"];

const EditorsPick = ({ data }: { data: BlogcardProps[] }) => {
  if (!data || data.length === 0) return null;

  const featured = data[0];
  const secondary = data.slice(1, 4);
  const trending = data.slice(4, 7);

  return (
    <section className="bg-white border-t border-gray-100">
      <div className="bb-container py-20 md:py-28">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-gray-400 mb-3 flex items-center gap-2">
              <span className="w-5 h-px bg-gray-200 inline-block" />
              Editor&apos;s Selection
            </p>
            <h2 className="font-serif text-[clamp(1.8rem,4.5vw,3rem)] font-bold text-[rgb(9,9,11)] leading-tight tracking-tight">
              Stories worth
              <br className="hidden md:block" />
              {" "}your time
            </h2>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 max-w-lg">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all duration-200 ${
                  i === 0
                    ? "bg-[rgb(9,9,11)] text-white"
                    : "text-gray-500 hover:text-[rgb(9,9,11)] border border-gray-200 hover:border-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main editorial grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 mb-16">

          {/* Featured large card */}
          <div className="lg:col-span-7">
            <Link href={`/post/${featured.slug}`} className="group block">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 mb-7">
                <Image
                  src={featured.image.src}
                  alt={featured.image.alt || featured.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] bg-[#462C7D]/90 text-white backdrop-blur-sm">
                    {featured.tags?.[0] || 'Featured'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden ring-1 ring-gray-200 shrink-0">
                    <Image
                      src={featured.author.image}
                      alt={featured.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[12px] font-medium text-gray-500">
                    {featured.author.name}
                  </span>
                  <span className="text-gray-300">·</span>
                  {featured.readTime && (
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Clock className="w-3 h-3" />
                      {featured.readTime}
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-[clamp(1.4rem,3vw,2.1rem)] font-bold text-[rgb(9,9,11)] leading-[1.15] tracking-tight group-hover:text-[#462C7D] transition-colors duration-300">
                  {featured.title}
                </h2>

                {featured.metaDesc && (
                  <p className="text-gray-500 text-[0.9rem] leading-relaxed line-clamp-2">
                    {featured.metaDesc}
                  </p>
                )}

                <span className="inline-flex items-center gap-2 text-[12px] font-bold text-gray-400 group-hover:text-[rgb(9,9,11)] transition-colors tracking-wide uppercase">
                  Read article
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          </div>

          {/* Right column — secondary stack */}
          <div className="lg:col-span-5 flex flex-col gap-0 divide-y divide-gray-100">
            {secondary.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.slug}`}
                className="group flex gap-4 items-center py-6 first:pt-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#462C7D] mb-2 block">
                    {post.tags?.[0] || 'Article'}
                  </span>
                  <h3 className="font-serif text-[1.05rem] font-bold text-gray-700 leading-snug tracking-tight group-hover:text-[rgb(9,9,11)] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] text-gray-400 font-medium">
                      {post.author.name}
                    </span>
                    {post.readTime && (
                      <>
                        <span className="text-gray-200">·</span>
                        <span className="text-[11px] text-gray-400">{post.readTime}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="w-[84px] h-[66px] md:w-[100px] md:h-[78px] shrink-0 rounded-xl overflow-hidden relative bg-gray-100">
                  <Image
                    src={post.image.src}
                    alt={post.image.alt || post.title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                  />
                </div>
              </Link>
            ))}

            <div className="pt-6">
              <Link
                href="/blog"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-[12px] font-bold text-gray-400 hover:border-gray-400 hover:text-[rgb(9,9,11)] transition-all duration-200 tracking-wide uppercase"
              >
                View all articles <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Trending strip */}
        {trending.length > 0 && (
          <div className="border-t border-gray-100 pt-12">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[10px] font-bold tracking-[0.28em] uppercase text-gray-400">
                Trending now
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {trending.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  className="group flex gap-4 items-start"
                >
                  <span className="text-[2.2rem] font-bold text-gray-100 leading-none font-serif shrink-0 group-hover:text-[#7B5BB6] transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#462C7D] mb-1.5">
                      {post.tags?.[0] || 'Read'}
                    </p>
                    <h4 className="font-serif text-[0.88rem] font-bold text-gray-600 leading-snug group-hover:text-[rgb(9,9,11)] transition-colors line-clamp-3">
                      {post.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EditorsPick;