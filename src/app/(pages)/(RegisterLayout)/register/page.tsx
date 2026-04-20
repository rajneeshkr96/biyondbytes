"use client";
import Link from "next/link";
import React from "react";
import CustomInputBox from "@/components/layoutComponents/InputBox";
import { IoLogIn } from "react-icons/io5";

const page = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-[rgb(9,9,11)] mb-2 tracking-tight">
          Create account
        </h1>
        <p className="text-sm text-gray-500">Share your voice with the world</p>
      </div>

      <form className="flex flex-col gap-4">
        <CustomInputBox placeholder="Enter your name" label="Name" />
        <CustomInputBox placeholder="Enter your email" label="Email" />
        <CustomInputBox placeholder="Enter password" type="password" label="Password" />
        <p className="text-xs text-gray-400 -mt-2">Must be at least 8 characters</p>

        <button type="submit"
          className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-[rgb(9,9,11)] text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all mt-1">
          <IoLogIn className="text-base" /> Get Started
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/byAuthBtn" className="text-[rgb(9,9,11)] font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  );
};

export default page;
