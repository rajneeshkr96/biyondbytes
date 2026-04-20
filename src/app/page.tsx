import HeroSection from "@/components/layoutComponents/HeroSection/HeroSection";
import Navbar from "@/components/layoutComponents/Navbar";
import HomeLayout from "@/components/layoutComponents/HomeLayout/HomeLayout";
import axios from "axios";
import { currentUserId } from "@/lib/authDet";
import { notFound } from "next/navigation";
import MainCard from "@/components/(cards)/MainCard/MainCard";
import EditorsPick from "@/components/layoutComponents/EditorsPick/EditorsPick";
import Script from "next/script";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer/Footer";

export const dynamic = "force-dynamic";

export const metadata = {
  description:
    "Explore the world of technology, lifestyle, travel, and more at BiyondBytes. Discover insightful articles across all categories and stay updated on the latest trends.",
};

export interface BlogcardProps {
  title: string;
  image: { src: string; alt: string };
  slug: string;
  id: string;
  author: { id: string; name: string; email: string; image: string; role: string };
  createdAt: Date;
  tags?: string[];
  metaDesc?: string;
  readTime?: string;
}

export default async function Home() {
  let blog: BlogcardProps[] = [];
  const id: string = await currentUserId();
  let success = false;
  const baseURL = process.env.BASE_URL || "http://localhost:3000";

  try {
    const res = await axios.get(
      `${baseURL}/api/blog/all?id=${id}&sort=-createdAt&fields=id,tags,likesCount,author,title,metaDesc,image,createdAt,slug,readTime`
    );
    if (res.data.success) {
      blog = res.data.data;
      success = true;
    }
  } catch (error) {
    success = false;
    console.log(error);
  }

  if (!success) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "BiyondBytes", item: `${process.env.BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Login", item: `${process.env.BASE_URL}/byAuthBtn` },
      { "@type": "ListItem", position: 3, name: "Contact Us", item: `${process.env.BASE_URL}/contact-us` },
      { "@type": "ListItem", position: 4, name: "About Us", item: `${process.env.BASE_URL}/about-us` },
      { "@type": "ListItem", position: 5, name: "Policy Page", item: `${process.env.BASE_URL}/privacy-policy` },
    ],
  };

  const latestArticles = blog.length > 7 ? blog.slice(7) : blog;

  return (
    <HomeLayout>
      <Navbar />

      <main>
        {/* Hero — full viewport, dark */}
        <HeroSection />

        {/* Editorial picks — light section */}
        <EditorsPick data={blog} />

        {/* Latest Articles Grid */}
        {latestArticles.length > 0 && (
          <section className="bg-white border-t border-gray-100">
            <div className="bb-container py-20 md:py-28">
              {/* Section header */}
              <div className="flex items-center justify-between mb-12">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-gray-400 mb-3 flex items-center gap-2">
                    <span className="w-5 h-px bg-gray-200 inline-block" />
                    Latest
                  </p>
                  <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-[rgb(9,9,11)] leading-tight tracking-tight">
                    Fresh from the desk
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="hidden md:inline-flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-[rgb(9,9,11)] transition-colors group tracking-wide uppercase"
                >
                  View all
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {latestArticles.map((data: BlogcardProps) => (
                  <MainCard
                    key={data.id}
                    id={data.id}
                    title={data.title}
                    image={data.image}
                    createdAt={data.createdAt}
                    author={data.author}
                    slug={data.slug}
                    tags={data.tags}
                  />
                ))}
              </div>

              {/* Mobile view-all CTA */}
              <div className="md:hidden mt-10 text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 text-[12px] font-bold text-gray-500 hover:text-[rgb(9,9,11)] hover:border-gray-400 transition-all duration-200 tracking-wide uppercase"
                >
                  View all articles <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section className="bg-gray-50 border-t border-gray-100">
          <div className="bb-container py-20 md:py-24">
            <div className="max-w-2xl mx-auto text-center border border-gray-200 rounded-2xl p-12 relative overflow-hidden bg-white">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-[#462C7D]/10 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-5">Your story matters</p>
                <h2 className="font-serif text-[clamp(1.8rem,4.5vw,3rem)] font-bold text-[rgb(9,9,11)] mb-4 leading-tight">
                  Have something to say?<br />
                  <span className="text-[#462C7D]">Write for BiyondBytes.</span>
                </h2>
                <p className="text-gray-500 text-base max-w-md mx-auto mb-8 leading-relaxed">
                  Join our community of thinkers, creators, and experts. Share your perspective with readers who care.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Link
                    href="/write/new"
                    className="inline-flex items-center gap-2 bg-[rgb(9,9,11)] text-white text-sm font-bold px-7 py-3 rounded-full hover:bg-gray-800 transition-all duration-200"
                  >
                    Start writing <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/about-us"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-[rgb(9,9,11)] text-sm font-medium px-7 py-3 rounded-full border border-gray-200 hover:border-gray-400 transition-all duration-200"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Script
          id="layout-script"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </main>       <Footer />    
    </HomeLayout>
  );
}
