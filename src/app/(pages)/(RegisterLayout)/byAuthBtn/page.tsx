"use client";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { signIn } from "next-auth/react";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-[rgb(9,9,11)] mb-2 tracking-tight">Welcome back</h1>
        <p className="text-sm text-gray-500">Choose how you&apos;d like to sign in</p>
      </div>

      <div className="flex flex-col gap-3">
        <button onClick={() => signIn("google")}
          className="flex items-center justify-center gap-3 w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-[rgb(9,9,11)] hover:bg-gray-50 hover:border-gray-300 transition-all">
          <FcGoogle className="text-xl" /> Continue with Google
        </button>
        <button onClick={() => signIn("github")}
          className="flex items-center justify-center gap-3 w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-[rgb(9,9,11)] hover:bg-gray-50 hover:border-gray-300 transition-all">
          <FaGithub className="text-xl" /> Continue with GitHub
        </button>

        <div className="flex items-center gap-3 py-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <Link href="login"
          className="flex items-center justify-center gap-3 w-full px-5 py-3.5 bg-[rgb(9,9,11)] text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all">
          <HiOutlineMail className="text-base" /> Continue with Email
        </Link>
      </div>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-[rgb(9,9,11)] font-semibold hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
