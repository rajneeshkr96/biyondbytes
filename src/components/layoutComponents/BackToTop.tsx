"use client";
import React, { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 md:bottom-8 right-6 z-40 w-10 h-10 bg-gray-900 text-white rounded-full shadow-md hover:bg-gray-700 transition-all flex items-center justify-center"
      aria-label="Back to top"
    >
      <FiArrowUp className="w-5 h-5" />
    </button>
  );
};

export default BackToTop;
