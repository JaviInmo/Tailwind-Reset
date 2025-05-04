import { getAuth } from "@/libs/auth";
import { DeleteUserContent } from "@/app/admin/users/delete/delete-user-content";
import prisma from "@/libs/db";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        id: string;
    };
}

// This is a Server Component
export default async function DeleteUserPage({ params }: PageProps) {
    await getAuth();

    // Check if user exists on the server
    const userData = await prisma.user.findUnique({
        where: { id: params.id },
    });

    if (!userData) {
        return notFound();
    }

    // Pass user data to client component
    return <DeleteUserContent id={params.id} userName={userData.name} />;
}
