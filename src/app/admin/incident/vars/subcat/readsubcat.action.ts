"use server";

import prisma from "@/libs/db";

export async function countSubCats() {
    const count = await prisma.subcategory.count();
    return count;
}
