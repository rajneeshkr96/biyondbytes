"use client";
import React, { FC, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import BlogsCards from "@/components/BlogCard/BlogsCards";
export interface MyPostsProps {
  id: string;
  tags?: Array<string>;

  likesCount?: number;
  disableBtn?: boolean;

  title: string;
  metaDesc: string;
  image: { src: string; alt: string };
  createdAt: Date;
  author: {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
  };
  slug: string;
  commentsCount: number;
  baseurl: string;

  readTime: string;
}

const MyPosts=  () => {
  const id = "65eabfc18015eaeff8ae6e31";

  const [post, setPost] = useState([]);
  const getAllPosts = async () => {
    const { data } = await axios.get(`/api/blog/writer/${id}`);
    setPost(data.data);
  };
  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="bg-[#e2eafc] w-11/12 mx-auto">
      <section className="grid grid-cols-3 max-sm:grid-cols-1 justify-evenly max-sm:justify-center gap-2 p-2  max-sm:flex-col   ">
        {post.map((data: MyPostsProps) => (
          <BlogsCards
            key={data.id}
            id={data.id}
            title={data.title}
            description={data.metaDesc}
            image={data.image}
            slug={data.slug}
            authId={data.author.id}
            likesCount={data?.likesCount?data.likesCount:0}
            commentCount={data.commentsCount}
            baseurl={process.env.BASE_URL as string} 

          />
        ))}
      </section>
    </div>
  );
};

export default MyPosts;
