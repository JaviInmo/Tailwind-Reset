"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/libs/db";

type FormSchemaData = {
    name: string;
};

export async function customSubmit(data: FormSchemaData) {
    return await registerAction(data);
}

export async function registerAction(data: FormSchemaData) {
    try {
        // Crea la variable
        const variable = await prisma.variable.create({
            data: {
                name: data.name,
            },
        });

        revalidatePath("/admin/variables/createVars");

        return { success: true, variable };
    } catch (error) {
        let errorMessage = "An unexpected error occurred";

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error("Error al registrar la variable:", error);
        return { success: false, error: errorMessage };
    }
}
