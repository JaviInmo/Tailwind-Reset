"use server";

import prisma from "@/libs/db";

export async function countSecondSubCats() {
    const count = await prisma.secondSubcategory.count();
    return count;
}
