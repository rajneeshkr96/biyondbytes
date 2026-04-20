import PostBody from '@/components/post/body/PostBody'
import Header from '@/components/post/header/Header'
import React from 'react'
import { currentUserId } from "@/lib/authDet";
import axios from 'axios'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { cache } from 'react'
import Author from '@/components/post/Author/Author';
import CommentSDisplay from '@/components/post/Comments/CommentSDisplay';
import PushNotification from '@/components/post/pushNotification/PushNotification';
import Script from 'next/script';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const getData = cache(async (slug: string, userId?: string) => {
  try {
    const baseURL = process.env.BASE_URL || "http://localhost:3000"
    const res = await axios.get(`${baseURL}/api/blog/${slug}/${userId}`);
    return res;
  } catch (error) {
    return null;
  }
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug
  const product = await getData(slug);
  if (product) {
    return {
      title: product.data.data.metaTitle || "page not found",
      description: product.data.data.metaDesc || "page not found",
      openGraph: {
        images: [{ url: product.data.data.image.src, alt: product.data.data.image.alt, width: 1200, height: 630 }],
      },
    }
  }
  return { title: { absolute: "page not found" }, description: "page not found" }
}

const Page = async (context: { params: { slug: string; schema: object } }) => {
  let blog: any;
  let relatedBlogs: any[] = [];
  let success = false;
  const slug = context.params.slug
  const baseURL = process.env.BASE_URL || "http://localhost:3000"

  try {
    const userId = await currentUserId();
    const res = await getData(slug, userId);
    if (res && res.data.success) {
      success = true;
      blog = { ...res.data.data, content: JSON.parse(res.data.data.content) };
    }
  } catch (error) {
    return notFound();
  }
  if (!success) return notFound();

  // Fetch related posts
  try {
    const rel = await axios.get(`${baseURL}/api/blog/all?sort=-createdAt&fields=id,title,image,slug&limit=3`);
    if (rel.data.success) relatedBlogs = rel.data.data.filter((b: any) => b.slug !== slug).slice(0, 3);
  } catch (_) {}

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": { "@type": "WebPage", "@id": `${process.env.BASE_URL}/${slug}` },
    "headline": blog.title,
    "image": [blog.image.src],
    "datePublished": blog.createdAt,
    "author": { "@type": "Person", "name": blog.author.name },
    "publisher": { "@type": "Organization", "name": "biyond bytes", "logo": { "@type": "ImageObject", "url": "/logo.png" } },
  };

  return (
    <>
      <article className="w-full min-h-screen bg-[#FAFAFA]">

        {/* Header: back link, date, title, author, hero image */}
        <Header
          author={blog.author}
          title={blog.title}
          createdAt={blog.createdAt}
          readTime={blog.readTime}
          image={blog.image}
          tags={blog.tags}
        />

        {/* Body: sticky TOC sidebar + prose content */}
        <PostBody image={blog.image} content={blog.content} />

        {/* Author + Comments */}
        <div className="max-w-[860px] mx-auto px-4 md:px-6 pb-16">
          <Author author={blog.author} isFollow={blog.isFollow} />
          <CommentSDisplay Blogid={blog.id} />
        </div>

        {/* Continue Reading */}
        {relatedBlogs.length > 0 && (
          <section className="bg-[#FAFAFA] border-t border-gray-100 py-14">
            <div className="max-w-[1100px] mx-auto px-4 md:px-6">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[rgb(9,9,11)]">Continue Reading</h2>
                  <p className="text-sm text-gray-400 mt-1">The latest handpicked blog articles</p>
                </div>
                <Link href="/blog" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors group">
                  Check all articles
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedBlogs.map((post: any) => (
                  <Link key={post.id} href={`/post/${post.slug}`} className="group relative block rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100">
                    <Image src={post.image.src} alt={post.image.alt || post.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <p className="absolute bottom-4 left-4 right-4 font-serif text-sm font-bold text-white leading-snug">
                      {post.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="relative bg-[rgb(24,24,27)] py-24 overflow-hidden">
          <div className="relative z-10 max-w-[500px] mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Don&apos;t Feed the Algorithm
            </h2>
            <form className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="name@email.com"
                className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm outline-none focus:border-white/50 transition-colors"
              />
              <button type="submit" className="px-5 py-2.5 rounded-full bg-white text-[rgb(9,9,11)] text-sm font-semibold hover:bg-gray-100 transition-colors shrink-0">
                Subscribe
              </button>
            </form>
            <p className="text-white/40 text-xs">Join 30,000+ Founders, Marketers &amp; Builders</p>
          </div>
        </section>

        <PushNotification />
        <Script
          id="Blog-script"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </article>
    </>
  )
}

export default Page
