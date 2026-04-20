"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiShare2, FiTwitter, FiLinkedin, FiFacebook, FiLink } from "react-icons/fi";
import { RiWhatsappLine } from "react-icons/ri";

interface ShareToolbarProps {
  title: string;
}

const ShareToolbar = ({ title }: ShareToolbarProps) => {
  const [url, setUrl] = useState("");
  
  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Twitter",
      icon: <FiTwitter className="w-5 h-5" />,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10",
    },
    {
      name: "LinkedIn",
      icon: <FiLinkedin className="w-5 h-5" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:text-[#0A66C2] hover:bg-[#0A66C2]/10",
    },
    {
      name: "Facebook",
      icon: <FiFacebook className="w-5 h-5" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:text-[#1877F2] hover:bg-[#1877F2]/10",
    },
    {
      name: "WhatsApp",
      icon: <RiWhatsappLine className="w-5 h-5" />,
      href: `https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`,
      color: "hover:text-[#25D366] hover:bg-[#25D366]/10",
    },
  ];

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3 bg-white p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">
      <div className="mb-2 text-center text-gray-400">
        <FiShare2 className="w-5 h-5 mx-auto" />
      </div>
      <div className="w-full h-px bg-gray-100 mb-2"></div>
      
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-2.5 rounded-xl text-gray-500 transition-all duration-200 ${link.color}`}
          aria-label={`Share on ${link.name}`}
          title={`Share on ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
      
      <button
        onClick={handleCopyLink}
        className="p-2.5 rounded-xl text-gray-500 hover:text-[#495E57] hover:bg-[#495E57]/10 transition-all duration-200"
        aria-label="Copy link"
        title="Copy link"
      >
        <FiLink className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ShareToolbar;
