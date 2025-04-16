// delete.action.ts
"use server";

import prisma from "@/libs/db";
import { revalidatePath } from "next/cache";

export async function handleDeleteUserAction(id: string, currentIds: string) {
  try {
    // 1) Elimino el usuario
    await prisma.user.delete({
      where: { id },
    });

    // 2) Parto y filtro como STRINGS
    const idsArray = currentIds ? currentIds.split(",") : [];
    const updatedIds = idsArray.filter(itemId => itemId !== id);

    // 3) Revalido la ruta donde lees usuarios
    revalidatePath("/admin/users/read");

    return { success: true, newIds: updatedIds.join(",") };
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado"
    };
  }
}
