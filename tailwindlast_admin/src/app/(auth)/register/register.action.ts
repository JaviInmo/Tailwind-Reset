"use server";

import prisma from "@/app/libs/db";

type FormSchemaData = {
  name: string;
  password: string;
};

export async function registerAction(data: FormSchemaData) {
  const user = await prisma.user.findFirst({ where: data });

  if (user) return false;

  await prisma.user.create({ data });

  return true;
}
