"use server";
import { revalidatePath } from "next/cache";

import prisma from "@/libs/db";

type FormSchemaData = {
    id?: string;
    name: string;
    password: string;
    role: "SIMPLE" | "ADVANCED" | "ADMIN";
};

export async function registerOrUpdateAction(data: FormSchemaData) {
    if (data.id) {
        const user = await prisma.user.findUnique({ where: { id: data.id } });
        if (!user) return false;

        if (data.name !== user.name) {
            const exists = await prisma.user.findFirst({ where: { name: data.name } });
            if (exists) return false;
        }

        await prisma.user.update({
            where: { id: data.id },
            data: {
                name: data.name,
                password: data.password ? data.password : user.password,
                role: data.role,
            },
        });
        revalidatePath("/admin/users/read");
        return true;
    } else {
        const exists = await prisma.user.findFirst({ where: { name: data.name } });
        if (exists) return false;

        await prisma.user.create({
            data: {
                name: data.name,
                password: data.password,
                role: data.role,
            },
        });
        revalidatePath("/admin/users/read");
        return true;
    }
}
