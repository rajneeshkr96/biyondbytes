"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";

interface Blog {
  id: string;
  title: string;
  slug: string;
  image: { src: string; alt?: string };
  metaDesc: string;
  createdAt: string;
  viewsCount: number;
  commentsCount: number;
  likesCount: number;
}

export default function BlogTable({ blogs: initialBlogs }: { blogs: Blog[] }) {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDeleteConfirm = (id: string) => setConfirmId(id);
  const handleDeleteCancel = () => setConfirmId(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setConfirmId(null);
    try {
      const res = await axios.delete(`/api/blog/delete/${id}`);
      if (res.data.success) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
        toast.success("Blog deleted.");
      } else {
        toast.error(res.data.message || "Failed to delete.");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  if (blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <span className="text-2xl">✍️</span>
        </div>
        <p className="font-semibold text-[rgb(9,9,11)]">No posts yet</p>
        <p className="text-sm text-gray-400 mt-1">Start writing your first blog post</p>
        <Link
          href="/dashboard/create"
          className="mt-5 px-5 py-2.5 bg-[rgb(9,9,11)] text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all"
        >
          + Create First Post
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Delete Confirmation Modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <span className="text-xl">🗑️</span>
            </div>
            <h3 className="font-bold text-lg text-[rgb(9,9,11)] mb-2">Delete this post?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. The blog and all its comments will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Post</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Views</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Likes</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {blog.image?.src && (
                        <Image
                          src={blog.image.src}
                          alt={blog.image.alt || blog.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[rgb(9,9,11)] truncate max-w-[260px]">{blog.title}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[260px] mt-0.5">{blog.metaDesc}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-xs text-gray-400 whitespace-nowrap">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-4 py-4 text-center text-sm text-gray-600 font-medium">{blog.viewsCount}</td>
                <td className="px-4 py-4 text-center text-sm text-gray-600 font-medium">{blog.likesCount}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/post/${blog.slug}`}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/edit/${blog.id}`}
                      className="px-3 py-1.5 text-xs font-semibold text-[#462C7D] bg-purple-50 hover:bg-purple-100 rounded-lg transition-all"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteConfirm(blog.id)}
                      disabled={deletingId === blog.id}
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all disabled:opacity-50"
                    >
                      {deletingId === blog.id ? "…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-100">
        {blogs.map((blog) => (
          <div key={blog.id} className="p-4 flex gap-3">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              {blog.image?.src && (
                <Image src={blog.image.src} alt={blog.title} fill className="object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-[rgb(9,9,11)] leading-snug line-clamp-2">{blog.title}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(blog.createdAt).toLocaleDateString()} · {blog.viewsCount} views
              </p>
              <div className="flex gap-2 mt-2">
                <Link href={`/post/${blog.slug}`} className="px-2.5 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg">View</Link>
                <Link href={`/dashboard/edit/${blog.id}`} className="px-2.5 py-1 text-xs font-semibold text-[#462C7D] bg-purple-50 rounded-lg">Edit</Link>
                <button
                  onClick={() => handleDeleteConfirm(blog.id)}
                  disabled={deletingId === blog.id}
                  className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 rounded-lg disabled:opacity-50"
                >
                  {deletingId === blog.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
