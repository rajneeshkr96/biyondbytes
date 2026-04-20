import Link from "next/link";
import React from "react";
import { FiPlusCircle } from "react-icons/fi";
import { ImHome } from "react-icons/im";
import { FaUserSecret } from "react-icons/fa";
import { IoSearchCircleSharp } from "react-icons/io5";
import { AiFillMessage } from "react-icons/ai";

const FooterNav = () => {
  return (
    <div className="main">
      <div className="fixed bottom-0 flex justify-center flex-row w-full h-12 bottom-nav z-30 bg-white border-t border-gray-100 shadow-sm">
        <div className="nav-slot bg-white round-top-left">
          <Link href="/" className="nav-link text-gray-600" aria-label="Home">
            <ImHome className="w-full h-full" />
          </Link>
        </div>
        <div className="nav-slot bg-white">
          <Link href="/search" className="nav-link text-gray-600" aria-label="Search">
            <IoSearchCircleSharp className="w-full h-full" />
          </Link>
        </div>
        <div className="nav-slot relative curve">
          <Link
            href="/write/new"
            className="fixed left-[5px] right-0 mx-auto bottom-6 bg-gray-900 border w-14 h-14 rounded-full text-center"
            aria-label="Write new post"
          >
            <FiPlusCircle className="w-full h-full rounded-full text-white text-2xl" />
          </Link>
        </div>
        <div className="nav-slot bg-white">
          <Link href="/tags" className="nav-link text-gray-600" aria-label="Explore Tags">
            <AiFillMessage className="w-full h-full" />
          </Link>
        </div>
        <div className="nav-slot bg-white round-top-right">
          <Link href="/settings" className="nav-link text-gray-600" aria-label="Profile">
            <FaUserSecret className="w-full h-full" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FooterNav;
