import { Dialog, DialogContent } from "@/components/ui/app-dialog";
import prisma from "@/libs/db";
import { DeleteUserContent } from "@/app/admin/users/delete/delete-user-content";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function FormPage({ params }: PageProps) {
    // Check if the user exists before rendering the DeleteUserPage
    const userData = await prisma.user.findUnique({
        where: { id: params.id },
    });

    if (!userData) {
        return notFound();
    }

    return (
        <Dialog open={true}>
            <DialogContent>
                <DeleteUserContent id={params.id} userName={userData.name} />
            </DialogContent>
        </Dialog>
    );
}
