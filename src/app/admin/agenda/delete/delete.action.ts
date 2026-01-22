"use server";

import prisma from "@/libs/db";

export async function handleDeleteContactAction(id: number, currentIds: string) {
  try {
    // Elimina el contacto
    await prisma.contact.delete({
      where: { id },
    });

    // Procesamos el listado actual de IDs (cadena separada por comas)
    const idsArray = currentIds ? currentIds.split(",").map(Number) : [];
    const updatedIds = idsArray.filter(itemId => itemId !== id);
    
    // Retornamos el listado actualizado para actualizar la query string en el cliente
    return { success: true, newIds: updatedIds.join(",") };
  } catch (error) {
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Error al eliminar el contacto:", error);
    return { success: false, error: errorMessage };
  }
}
