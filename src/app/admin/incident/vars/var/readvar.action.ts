"use server";

import prisma from "@/libs/db";

export async function countVariables() {
    const count = await prisma.variable.count();
    return count;
}
