import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { dataBasePrisma } from "../../../prisma/databasePrisma";
import { UserRole } from "@prisma/client";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({

  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        let resolvedUserId = token.userId as string | undefined;

        // Old sessions (minted before the jwt fix) won't have userId.
        // token.sub is a Google/GitHub UUID for OAuth — NOT a MongoDB ObjectId.
        // So we look up by email instead, which is always present.
        if (!resolvedUserId && token.email) {
          try {
            const dbUser = await dataBasePrisma.user.findUnique({
              where: { email: token.email as string },
              select: { id: true, role: true, username: true, image: true, name: true },
            });
            if (dbUser) {
              resolvedUserId = dbUser.id;
              // Also back-fill other fields that may be stale in old tokens
              session.user.role = dbUser.role;
              session.user.userName = dbUser.username ?? "";
              session.user.image = dbUser.image ?? "";
              session.user.name = dbUser.name ?? token.name ?? "";
            }
          } catch {}
        }

        session.user.userId = resolvedUserId ?? "";
        session.user.name = session.user.name || (token.name as string);
        session.user.userName = session.user.userName || (token.userName as string);
        session.user.email = token.email as string;
        session.user.image = session.user.image || (token.picture as string);
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      try {
        dataBasePrisma.$connect();
        if (!token.sub) return token;
        // Try email first (works for both OAuth and Credentials)
        let existingUser = token.email
          ? await dataBasePrisma.user.findUnique({
              where: { email: token.email as string },
            })
          : null;

        if (!existingUser) {
          // Brand new OAuth user — create them
          const userName = token?.email?.split('@')[0];
          const newUser = await dataBasePrisma.user.create({
            data: {
              username: userName,
              email: token.email,
              name: token.name,
              role: UserRole.USER,
              image: token.picture,
            },
          });
          token.role = newUser.role;
          token.name = newUser.name;
          token.email = newUser.email;
          token.userId = newUser.id;
          token.userName = newUser.username;
          return token;
        }

        token.name = existingUser.name;
        token.email = existingUser.email;
        token.role = existingUser.role;
        token.userId = existingUser.id;
        token.picture = existingUser.image; // must be token.picture — session reads token.picture
        token.userName = existingUser.username;

        return token;

      } finally {
        await dataBasePrisma.$disconnect();
      }
    },

  },

  session: { strategy: "jwt" },


  ...authConfig,
});


