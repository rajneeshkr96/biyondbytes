"use client";
import React, { useEffect } from "react";
import MainCard from "@/components/(cards)/MainCard/MainCard";

import { BlogcardProps } from "@/app/page";
import axios from "axios";
import { useSession } from "next-auth/react";

const ResultCard = () => {
  const [blog, setBlog] = React.useState<BlogcardProps[]>([]);
  const id = useSession().data?.user?.userId;

  const getBlogData = async () => {
    try {
      const res = await axios.get(
        `/api/blog/all?id=${id}&sort=-createdAt&fields=id,tags,likesCount,author,title,metaDesc,image,createdAt,slug,readTime`
      );
      if (res.data.success) {
        setBlog(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBlogData();
  }, [blog,getBlogData]);
  return (
    <div className="grid grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1 max-sm:grid-cols-1">
      {blog.map((data: BlogcardProps) => (
        
          <MainCard
            className="max-w-[50vw] h-[35vh]"
            key={data.id}
            id={data.id}
            title={data.title}
            image={data.image}
            createdAt={data.createdAt}
            author={data.author}
            slug={data.slug}
            bookMarked={true}
          />
      ))}
    </div>
  );
};

export default ResultCard;
