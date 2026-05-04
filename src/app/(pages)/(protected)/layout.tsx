import { redirect } from "next/navigation";
import { auth } from "@/backend/auth/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/byAuthBtn");
  }
  return <>{children}</>;
}
