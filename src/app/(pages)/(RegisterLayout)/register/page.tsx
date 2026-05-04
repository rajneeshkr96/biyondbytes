"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import CustomInputBox from "@/components/layoutComponents/InputBox";
import { useUploadThing } from "@/utilis";
import { toast } from "react-toastify";
import { IoPersonAdd } from "react-icons/io5";
import { Eye, EyeOff, Camera, Upload } from "lucide-react";
import Image from "next/image";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      setProfileImage(res[0].url);
      setUploading(false);
      toast.success("Image uploaded!");
    },
    onUploadError: (error) => {
      setUploading(false);
      toast.error(error.message);
    },
    onUploadBegin: () => setUploading(true),
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await startUpload([file]);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const passwordValue = watch("password", "");

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password, image: profileImage }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Registration failed.");
        return;
      }
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-[rgb(9,9,11)] mb-2 tracking-tight">
          Create account
        </h1>
        <p className="text-sm text-gray-500">Share your voice with the world</p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>

        {/* Profile Image Upload — fully custom, no UploadThing button */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Profile Image <span className="text-gray-400 font-normal">(optional)</span>
          </label>

          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`flex items-center gap-4 p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer
              ${uploading
                ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
              }`}
          >
            {/* Avatar preview */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
              {profileImage ? (
                <Image src={profileImage} alt="Profile" fill className="object-cover" />
              ) : (
                <Camera className="w-5 h-5 text-gray-300" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {uploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                  <span className="text-sm text-gray-500">Uploading…</span>
                </div>
              ) : profileImage ? (
                <div>
                  <p className="text-sm font-medium text-gray-700">Photo uploaded</p>
                  <p className="text-xs text-gray-400">Click to change</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-700">Upload a photo</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 1MB</p>
                </div>
              )}
            </div>

            <Upload className="w-4 h-4 text-gray-300 shrink-0" />
          </div>

          {/* Hidden real file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Name */}
        <div>
          <CustomInputBox
            placeholder="Enter your full name"
            label="Name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
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
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <CustomInputBox
              placeholder="Create a password"
              type={showPassword ? "text" : "password"}
              label="Password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Must be at least 8 characters" },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password ? (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          ) : (
            <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <div className="relative">
            <CustomInputBox
              placeholder="Confirm your password"
              type={showConfirm ? "text" : "password"}
              label="Confirm Password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === passwordValue || "Passwords do not match",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-[rgb(9,9,11)] text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <IoPersonAdd className="text-base" />
          {loading ? "Creating account…" : "Get Started"}
        </button>
      </form>

      {/* Divider */}
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
        Already have an account?{" "}
        <Link href="/login" className="text-[rgb(9,9,11)] font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
