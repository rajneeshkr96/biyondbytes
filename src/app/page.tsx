import HeroSection from "@/components/layoutComponents/HeroSection/HeroSection";
import axios from "axios";
import { currentUserId } from "@/lib/authDet";
import { notFound } from "next/navigation";
import MainCard from "@/components/(cards)/MainCard/MainCard";
import CategorySlide from "@/components/categorySlide/CategorySlide";
import MediaQuery from "@/components/layoutComponents/MediaQuery";
import AddStorie from "@/components/(cards)/DiscoverCard/AddStorie";
import ViewStorie from "@/components/(cards)/DiscoverCard/ViewStorie";
import Script from "next/script";



export const metadata = {
  description: "Explore the world of technology, lifestyle, travel, and more at BiyondBytes. Discover insightful articles across all categories and stay updated on the latest trends. Join us as we dive deep into diverse topics beyond the ordinary, only at BiyondBytes",

};

export interface BlogcardProps {
  title: string;
  image: { src: string; alt: string };
  slug: string;
  id: string;
  author: { id: string; name: string, email: string, image: string, role: string };
  createdAt: Date;
}
export default async function Home() {
  let blog;
  const id: string = await currentUserId();
  let success = false;
  const baseURL = process.env.BASE_URL || "http://localhost:3000"
  try {
    const res = await axios.get(`${baseURL}/api/blog/all?id=${id}&sort=-createdAt&fields=id,tags,likesCount,author,title,metaDesc,image,createdAt,slug,readTime`);
    if (res.data.success) {
      blog = res.data.data;
      success = true;
    }
  } catch (error) {
    success = false;
    console.log(error);
  }
  if (!success) {
    return notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Biyondbytes-make your skills like a pro",
        item: `${process.env.BASE_URL}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Login",
        item: `${process.env.BASE_URL}/byAuthBtn`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Contact Us",
        item: `${process.env.BASE_URL}/contact-us`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "About Us",
        item: `${process.env.BASE_URL}/about-us`
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Policy Page",
        item: `${process.env.BASE_URL}/privacy-policy`
      }
    ]
  }

  return (
    <>

      <main className="min-h-screen">
        <MediaQuery minSize={999}>
          <div className="heroSection w-screen h-screen">
            <HeroSection />
          </div>
        </MediaQuery>
        <MediaQuery maxSize={720}>
          <div className="flex gap-x-3 mt-14 px-4 py-4 flex-row overflow-auto">
            <AddStorie />
            <ViewStorie />
            <ViewStorie />
            <ViewStorie />
          </div>
        </MediaQuery>
        <section className="my-12 featureSection">
          <CategorySlide data={blog} />
        </section>


        <section className="flex justify-center  flex-wrap ">

          {blog.map((data: BlogcardProps) =>
            <MainCard
              key={data.id}
              id={data.id}
              title={data.title}
              image={data.image}
              createdAt={data.createdAt}
              author={data.author}
              slug={data.slug}
            />
          )}

        </section>
        <Script
          id="layout-script"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </main>
    </>


  );
}
