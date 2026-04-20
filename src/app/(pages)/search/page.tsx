import { BlogcardProps } from "@/app/page";
import MainCard from "@/components/(cards)/MainCard/MainCard";
import Pagination from "@/components/Pagination/Pagination";
import { currentUserId } from "@/lib/authDet";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SearchPageClient from "./SearchPageClient";

export const metadata = {
  title: "Search | BiyondBytes",
  description: "Search articles, topics, and tags on BiyondBytes.",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: { keyword?: string; tags?: string; page?: string };
}) {
  const keyword = searchParams?.keyword || "";
  const tags = searchParams?.tags || "";
  const currentPage = Number(searchParams?.page) || 1;
  let blog: BlogcardProps[] = [];
  const id = await currentUserId();
  let success = false;
  let documentCount = 0;

  if (keyword || tags) {
    try {
      const res = await axios.get(
        `${process.env.BASE_URL}/api/blog/all?id=${id}&sort=-createdAt&fields=id,tags,likesCount,author,title,metaDesc,image,createdAt,slug,readTime&page=${currentPage}&search=${keyword}&tags=${tags}`
      );
      if (res.data.success) {
        blog = res.data.data;
        documentCount = res.data.total;
        success = true;
      }
    } catch (_) {}
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero search section */}
      <section className="pt-28 pb-12 border-b border-gray-100">
        <div className="bb-container max-w-[760px]">
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-4">Search</p>
          <h1 className="font-serif text-[clamp(2rem,4vw,2.75rem)] font-bold text-[rgb(9,9,11)] leading-[1.15] mb-8">
            {keyword
              ? <>Results for <span className="text-gray-400">&ldquo;{keyword}&rdquo;</span></>
              : "Find anything."}
          </h1>
          <SearchPageClient defaultValue={keyword} />
        </div>
      </section>

      {/* Results */}
      <section className="bb-container py-14">

        {/* No search yet */}
        {!keyword && !tags && (
          <div className="max-w-[760px] mx-auto py-20 border-t border-gray-100">
            <p className="text-gray-400 text-base">Start typing to discover articles, topics, and tags.</p>
          </div>
        )}

        {/* Searched but no results */}
        {(keyword || tags) && (!success || blog.length === 0) && (
          <div className="max-w-[760px] mx-auto py-20">
            <p className="font-serif text-2xl font-bold text-[rgb(9,9,11)] mb-2">
              No results for &ldquo;{keyword}&rdquo;
            </p>
            <p className="text-gray-400 mb-8 text-sm">Try different keywords or check the spelling.</p>
            <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[rgb(9,9,11)] text-sm font-medium text-[rgb(9,9,11)] hover:bg-[rgb(9,9,11)] hover:text-white transition-all">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        )}

        {/* Results */}
        {success && blog.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-100">
              <p className="text-sm text-gray-400">
                <span className="font-semibold text-[rgb(9,9,11)]">{documentCount}</span> article{documentCount !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {blog.map((data: BlogcardProps) => (
                <MainCard
                  key={data.id}
                  id={data.id}
                  title={data.title}
                  image={data.image}
                  createdAt={data.createdAt}
                  author={data.author}
                  slug={data.slug}
                />
              ))}
            </div>

            <div className="mt-14 pt-8 border-t border-gray-100">
              <Pagination
                className="justify-center"
                path="/search"
                page={currentPage}
                keyword={keyword}
                documentCount={documentCount}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
