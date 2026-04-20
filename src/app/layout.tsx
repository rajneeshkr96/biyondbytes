import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { GoogleTagManager } from '@next/third-parties/google'
import { ToastContainer } from 'react-toastify';
// @ts-ignore
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import ReduxProvider from "@/redux/Provider";
import { auth } from "@/backend/auth/auth";
import { SessionProvider } from "next-auth/react"
const inter = Inter({ subsets: ["latin"] });
const source_serif_4 = Source_Serif_4({
  subsets: ['latin'],
  variable: '--source_serif_4',
});
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL || "https://biyondbytes.com"),
  title: {
    default: "Biyond Bytes",
    template: `%s | Biyond Bytes`,
  },
  description: "Biyond Bytes",



};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = null;

try {
  session = await auth();
} catch (err) {
  console.log("Auth failed during build:", err);
}

  return (
    <html lang="en">
      <meta name="robots" content="max-image-preview:large"></meta>
      <GoogleTagManager gtmId="GTM-MCDRPZ4H" />
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2216699954641967"
          crossOrigin="anonymous"></script>
      </head>
      <body className={` !overflow-x-hidden ${inter.className} ${source_serif_4.variable}`}>
        <SessionProvider session={session}>
          <ReduxProvider>
            {children}
          </ReduxProvider>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </SessionProvider>
      </body>
    </html>
  );
}
