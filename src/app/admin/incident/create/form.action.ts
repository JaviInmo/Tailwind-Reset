"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/libs/db";

type FormSchemaData = {
  date: Date;
  provinceId: string;
  municipalityId: string;
  variableId: number;
  categoryId: number;
  subcategoryId?: number;
  secondSubcategoryId?: number;
  amount: number;
  numberOfPeople: number; // Nuevo campo
  description: string;
};

export async function customSubmit(data: FormSchemaData) {
  return await registerAction(data);
}

export async function registerAction(data: FormSchemaData) {
  try {
    // Crea el incidente
    console.log("Datos a insertar:", data);
    const incident = await prisma.incident.create({
      data: {
        date: data.date,
        provinceId: data.provinceId,
        municipalityId: data.municipalityId,
        variableId: data.variableId,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        secondSubcategoryId: data.secondSubcategoryId,
        amount: data.amount,
        numberOfPeople: data.numberOfPeople, // Se inserta el número de personas
        description: data.description,
      },
    });

    revalidatePath("/admin/form");

    return { success: true, incident };
  } catch (error) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Error al registrar el incidente:", error);
    return { success: false, error: errorMessage };
  }
}
