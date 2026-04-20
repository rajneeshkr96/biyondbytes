import Navbar from "@/components/layoutComponents/Navbar";
import React from "react";

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
