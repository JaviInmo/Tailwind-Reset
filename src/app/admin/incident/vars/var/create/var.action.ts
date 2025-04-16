"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/libs/db";

type RegisterData = { name: string };
type UpdateData   = { id: number; name: string };

export async function registerAction(data: RegisterData) {
  try {
    // Evitar duplicados
    const existingVar = await prisma.variable.findFirst({
      where: { name: data.name },
    });
    if (existingVar) {
      return { success: false, error: "La Variable ya existe" };
    }

    // Crear nueva
    const variable = await prisma.variable.create({
      data: { name: data.name },
    });

    // Revalida la ruta de creación (opcional)
    revalidatePath("/admin/incident/vars/var/create");
    return { success: true, variable };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error inesperado";
    console.error("Error al registrar la variable:", error);
    return { success: false, error: errorMessage };
  }
}

export async function updateAction(data: UpdateData) {
  try {
    // Asegurar que existe
    const existing = await prisma.variable.findUnique({
      where: { id: data.id },
    });
    if (!existing) {
      return { success: false, error: "Variable no encontrada" };
    }

    // Actualizar
    const variable = await prisma.variable.update({
      where: { id: data.id },
      data: { name: data.name },
    });

    // Revalida la ruta del listado
    revalidatePath("/admin/incident/vars/var");
    return { success: true, variable };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error inesperado";
    console.error("Error al actualizar la variable:", error);
    return { success: false, error: errorMessage };
  }
}
