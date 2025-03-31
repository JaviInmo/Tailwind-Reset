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
          // Se retorna también el rol
          return { id: user.id, name: user.name, image: user.image, role: user.role };
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      // Si el usuario se acaba de autenticar, se agrega el rol al token
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // Se agrega el rol a la sesión
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
    // Puedes mantener o modificar la validación de rutas según rol
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname.includes("/admin")) {
        // Permite acceso tanto a ADMIN como a ADVANCED, por ejemplo
        return auth?.user?.role === "ADMIN" || auth?.user?.role === "ADVANCED" || auth?.user?.role === "SIMPLE";
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
