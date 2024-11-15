"use server";

import prisma from "@/libs/db";

export async function handleDeleteIncidentAction(id: number) {
    try {
        // Elimina el incidente
        await prisma.incident.delete({
            where: { id },
        });

        return { success: true };
    } catch (error) {
        let errorMessage = "An unexpected error occurred";

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error("Error al eliminar el incidente:", error);
        return { success: false, error: errorMessage };
    }
}
