"use client";
import Link from "next/link";
import React, { useState } from "react";
import CustomInputBox from "@/components/layoutComponents/InputBox";
import { IoLogIn } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);
    setLoading(true);
    try {
      // First check if email exists in database
      const checkRes = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const checkJson = await checkRes.json();

      if (!checkJson.exists) {
        setServerError("No account found with this email. Please create a new account.");
        setLoading(false);
        return;
      }

      // Attempt sign in
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError("Invalid password. Please try again.");
        setLoading(false);
        return;
      }

      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-[rgb(9,9,11)] mb-2 tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500">Enter your credentials to continue</p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <CustomInputBox
            placeholder="Enter your email"
            label="Email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
            })}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <CustomInputBox
            placeholder="Enter password"
            type="password"
            label="Password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
            {serverError}
            {serverError.includes("create a new account") && (
              <Link href="/register" className="ml-1 font-semibold underline">
                Sign up here
              </Link>
            )}
          </div>
        )}

        <Link href="#" className="text-xs text-[#462C7D] self-end font-medium hover:underline">
          Forgot password?
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-[rgb(9,9,11)] text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <IoLogIn className="text-base" />
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <Link
        href="/byAuthBtn"
        className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-[rgb(9,9,11)] hover:bg-gray-50 transition-all"
      >
        Continue with Google / GitHub
      </Link>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-[rgb(9,9,11)] font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
