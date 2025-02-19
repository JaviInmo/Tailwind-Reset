"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/libs/db";

type FormSchemaData = {
    subcategoryId: number; // Cambiado de categoryId a subcategoryId
    name: string;
};

// Registra una nueva segunda subcategoría
export async function registerAction(data: FormSchemaData) {
    try {
        const existingSecondSubcategory = await prisma.secondSubcategory.findFirst({
            where:{
               name: data.name,
            subcategoryId: data.subcategoryId,
            },
        });

        if (existingSecondSubcategory){
            return {success:false, error:"La segunda subcategoría ya existe para esta subcategoría."};  // Cambiado de categoría a subcategoría
        }
            



        //crear segunda subcategoria sino existe
        const secondSubcategory = await prisma.secondSubcategory.create({
            data: {
                name: data.name,
                subcategoryId: data.subcategoryId, // Relación con subcategoría
            },
        });

        revalidatePath("/admin/incident/vars/secondsubcat/create");

        return { success: true, secondSubcategory };
    } catch (error) {
        let errorMessage = "An unexpected error occurred";

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error("Error al registrar la segunda subcategoría:", error);
        return { success: false, error: errorMessage };
    }
}


export async function updateSecondSubCategoryAction(id: number, name: string) {
    try {
        const existingSecondSubcategory = await prisma.secondSubcategory.findFirst({
            where: {
                name,
                NOT: {
                    id,
                },
            },
        });

        if (existingSecondSubcategory) {
            return { success: false, error: "La segunda subcategoría ya existe." };
        }

        const secondSubcategory = await prisma.secondSubcategory.update({
            where: {
                id,
            },
            data: {
                name,
            },
        });

        revalidatePath("/admin/incident/vars/secondsubcat/create");

        return { success: true, secondSubcategory };
    } catch (error) {
        let errorMessage = "An unexpected error occurred";

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error("Error al actualizar la segunda subcategoría:", error);
        return { success: false, error: errorMessage };
    }
}
// Obtiene todas las subcategorías disponibles
export async function fetchSubCategories() {
    return await prisma.subcategory.findMany({
        select: {
            id: true,
            name: true,
        },
    });
}

// Obtiene las segundas subcategorías asociadas a una subcategoría específica
export async function fetchSecondSubCategoriesBySubCategory(subcategoryId: number) {
    return await prisma.secondSubcategory.findMany({
        where: {
            subcategoryId: subcategoryId,
        },
        select: {
            id: true,
            name: true,
        },
    });
}
