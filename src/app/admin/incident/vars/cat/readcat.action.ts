"use server";

import prisma from "@/libs/db";

export async function countCats() {
    const count = await prisma.category.count();
    return count;
}
