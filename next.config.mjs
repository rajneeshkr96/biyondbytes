/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['unsplash.com','images.unsplash.com',"firebasestorage.googleapis.com",'utfs.io','lh3.googleusercontent.com','avatars.githubusercontent.com',"www.biyondbytes.com","dev-to-uploads.s3.amazonaws.com"],
      },
    swcMinify: true,
    env: {
    BASE_URL: process.env.BASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
  },
};

export default nextConfig;
