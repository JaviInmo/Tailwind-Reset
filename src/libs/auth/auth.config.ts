import { NextAuthConfig, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

import prisma from "../db";

const credentialsSchema = z.object({
  name: z.string(),
  password: z.string(),
});

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<User | null> => {
        const { name, password } = credentialsSchema.parse(credentials);

        try {
          const user = await prisma.user.findFirstOrThrow({
            where: { name, password },
          });
          return { name: user.name, image: user.image, id: user.id };
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      console.log("[pathname] ", pathname);
      console.log("[auth] ", auth);
      if (pathname.includes("/admin")) return !!auth;

      return true;
    },
  },
} satisfies NextAuthConfig;
