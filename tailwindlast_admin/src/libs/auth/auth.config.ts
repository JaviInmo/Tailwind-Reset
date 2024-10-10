import { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

import prisma from "../db";

// Definir el esquema de las credenciales
const credentialsSchema = z.object({
  name: z.string(),
  password: z.string(),
});

// Configuración de NextAuth
export const authConfig: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<User | null> => {
        // Validar las credenciales usando Zod
        const { name, password } = credentialsSchema.parse(credentials);

        try {
          // Buscar el usuario en la base de datos usando Prisma
          const user = await prisma.user.findFirstOrThrow({
            where: { name, password },
          });
          // Devolver el usuario si la autenticación es exitosa
          return { name: user.name, image: user.image, id: user.id };
        } catch (e) {
          // Devolver null si hay algún error (usuario no encontrado)
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Si el usuario existe, permitir el acceso
      if (user) {
        return true;
      }
      // De lo contrario, negar el acceso
      return false;
    },
    async session({ session, user }) {
      // Agregar los detalles del usuario a la sesión
      session.user = user;
      return session;
    },
  },
};
