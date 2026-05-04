import { auth } from "@/backend/auth/auth";
import { dataBasePrisma } from "@/databasePrisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BlogTable from "./BlogTable";
import Navbar from "@/components/layoutComponents/Navbar";
import { Settings } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard – BeyondBytes",
  description: "Manage your blog posts and profile on BeyondBytes.",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/byAuthBtn");

  let userId = session.user.userId as string;


  if (!userId && session.user.email) {
    const dbUser = await dataBasePrisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (dbUser) userId = dbUser.id;
  }

  // Strict guard: if userId is still missing, don't query blogs
  let blogs: any[] = [];
  if (userId && userId.trim() !== "") {
    blogs = await dataBasePrisma.blog.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        metaDesc: true,
        createdAt: true,
        viewsCount: true,
        commentsCount: true,
        likesCount: true,
      },
    });
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar showUserInfo hideSearchWrite />

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-20">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0a0a0a] to-[#1a0a2e] p-8 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(155,127,212,0.25) 0%, transparent 70%)", transform: "translate(20%, -20%)" }}
          />
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold mb-2">Dashboard</p>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight">
              Welcome back,<br />
              <span className="text-[#C4A8FF]">{user.name?.split(" ")[0]}</span>
            </h1>
            <p className="text-white/40 text-sm mt-2">
              {blogs.length} blog{blogs.length !== 1 ? "s" : ""} published
            </p>
          </div>
          {/* Profile image in banner */}
          <div className="relative z-10 shrink-0">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
              {user.image ? (
                <Image src={user.image} alt={user.name || "Profile"} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#462C7D] text-white font-bold text-3xl">
                  {user.name?.charAt(0).toUpperCase() ?? "U"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Posts", value: blogs.length },
            { label: "Total Views", value: blogs.reduce((a, b) => a + b.viewsCount, 0) },
            { label: "Total Likes", value: blogs.reduce((a, b) => a + b.likesCount, 0) },
            { label: "Total Comments", value: blogs.reduce((a, b) => a + b.commentsCount, 0) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-2xl font-bold text-[rgb(9,9,11)] font-serif">{value}</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">{label}</p>
            </div>
          ))}
        </div>

        {/* Blog Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-[rgb(9,9,11)]">My Blog Posts</h2>
              <p className="text-xs text-gray-400 mt-0.5">Manage, edit, and delete your articles</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/settings"
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
              <Link
                href="/dashboard/create"
                className="flex items-center gap-2 px-4 py-2.5 bg-[rgb(9,9,11)] text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all"
              >
                + New Post
              </Link>
            </div>
          </div>
          <BlogTable blogs={blogs as any} />
        </div>
      </main>
    </div>
  );
}
