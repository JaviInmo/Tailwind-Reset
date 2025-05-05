"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/libs/db";

type RegisterData = { id?:number; name: string };
type UpdateData   = { id: number; name: string };

export async function registerAction(data: RegisterData) {
  if (data.id){

    const variable = await prisma.variable.findUnique({ where: { id: data.id } });
    if (!variable) return { success: false };

    if (data.name !== variable.name) {
      const exists = await prisma.variable.findFirst({
        where: { name: data.name },
      });
      if (exists) return { success: false };
    } 

    await prisma.variable.update({
      where: { id: data.id },
      data: {
        name: data.name,
      },
    });

    revalidatePath("/admin/incident/var/vars/read");
    return { success: true };
  }

  const exists = await prisma.variable.findFirst({ where: { name: data.name } });
  if (exists) return { success: false };

  await prisma.variable.create({
    data: {
      name: data.name,
    },
  });
  revalidatePath("/admin/incident/var/vars/read");
  return { success: true };
}
 