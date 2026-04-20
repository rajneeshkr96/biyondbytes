import { auth } from "@/backend/auth/auth";
import { dataBasePrisma } from "@/databasePrisma";

export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();
  return session?.user?.role;
};

export const currentUserId = async () => {
  const session = await auth();
  return session?.user?.userId as string;
};

export const currentUserProfile = async () => {
  const session = await auth();
  const image = session?.user?.image;
  return image;
};

export const getCurrentRole = async () => {
  try {
    const id = await currentUserId();
    const role = await dataBasePrisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
    return role?.role;
  } catch (error) {
    // Return undefined on error
  }
};
