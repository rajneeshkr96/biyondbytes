
import PostBody from '@/components/post/body/PostBody'
import Header from '@/components/post/header/Header'
import React from 'react'
import { currentUserId } from "@/lib/authDet";
import axios from 'axios'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { cache } from 'react'
import Author from '@/components/post/Author/Author';
import CommentSDisplay from '@/components/post/Comments/CommentSDisplay';
import PushNotification from '@/components/post/pushNotification/PushNotification';
import Script from 'next/script';


type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
// export const dynamic = "force-dynamic";
// export async function generateStaticParams() {
//   const response = await fetch(`${process.env.BASE_URL}/api/blog/all?fields=slug`);
//   const {data} = await response.json();
//   const val = data.data.map((slug:string) => slug);
//   return val;
// }

 const getData = cache(async (slug:string,userId?:string) => {
  try {
    const baseURL = process.env.BASE_URL || "http://localhost:3000"
    const res = await axios.get(`${baseURL}/api/blog/${slug}/${userId}`);
    return res;
    
  } catch (error) {
    return null;
  }
 })
export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  // read route params
  const slug = params.slug
  const product = await getData(slug);
  if(product){
    // optionally access and extend (rather than replace) parent metadata
    return {
      
      title: product.data.data.metaTitle || "page not found",
      description: product.data.data.metaDesc || "page not found",
      openGraph: {
        images: [{
          url: product.data.data.image.src,
          alt: product.data.data.image.alt,
          width: 1200,
          height: 630,
        }],
  
      },
    }
  }else{
    return {
      title: {
        absolute:"page not found"
      },
      description:"page not found",
    }
  }
}


const Page = async (context: { params: { slug: string,schema:object }}) => {
  let blog;
  let success = false;
  const slug = context.params.slug
  try {
   const userId = await currentUserId();
   const res = await getData(slug,userId);
    
   if(res && res.data.success){
    success = true;
     blog = {...res.data.data,content:JSON.parse(res.data.data.content)};
   }
  } catch (error) {
    return notFound();
  }
  if (!success) {
    return notFound();
  }
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.BASE_URL}/${slug}`
    },
    "headline": blog.title,
    "image": [blog.image.src],
    "datePublished": blog.createdAt,
    "author": {
      "@type": "Person",
      "name": blog.author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "biyond bytes",
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.png"
      }
    },
  };


  return (
    <>
      <article className='px-6 py-12'>
        <Header author={blog.author} title={blog.title} createdAt={blog.createdAt} readTime={blog.readTime}  image={blog.image} tags={blog.tags}  />
        <PostBody image={blog.image} content={blog.content} />
        <Author author={blog.author} isFollow={blog.isFollow}/>
        <CommentSDisplay Blogid={blog.id} />
        <PushNotification/>
        <Script
          id="Blog-script"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

      </article>
    </>
  )
}

export default Page