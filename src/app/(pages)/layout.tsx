import HomeLayout from "@/components/layoutComponents/HomeLayout/HomeLayout";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return <HomeLayout>{children}</HomeLayout>;
}
