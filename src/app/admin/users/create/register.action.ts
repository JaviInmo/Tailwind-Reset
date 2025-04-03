"use server";

import prisma from "@/libs/db";

type FormSchemaData = {
  name: string;
  password: string;
  role: "SIMPLE" | "ADVANCED" | "ADMIN";
};

export async function registerAction(data: FormSchemaData) {
  // Busca si el usuario ya existe por nombre
  const user = await prisma.user.findFirst({ where: { name: data.name } });
  if (user) return false;

  // Crea el usuario asignándole el rol seleccionado
  await prisma.user.create({
    data: {
      name: data.name,
      password: data.password,
      role: data.role,
    },
  });

  return true;
}
