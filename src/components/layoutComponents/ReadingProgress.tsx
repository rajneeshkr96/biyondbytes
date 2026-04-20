"use client";
import React, { useState, useEffect } from "react";

const ReadingProgress = () => {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const scrollListener = () => {
      if (!window) return;
      
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}`;
      
      setReadingProgress(Number(scroll));
    };

    window.addEventListener("scroll", scrollListener, { passive: true });
    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-50 bg-transparent">
      <div 
        className="h-full bg-[#495E57] transition-all duration-150 ease-out rtl:float-right rtl:transition-transform"
        style={{ width: `${readingProgress}%` }}
      />
    </div>
  );
};

export default ReadingProgress;
