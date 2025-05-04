import { EditUserPage } from "@/app/admin/users/edit/[id]/page";
import { Dialog, DialogContent } from "@/components/ui/app-dialog";
import prisma from "@/libs/db";
import { notFound } from "next/navigation";

export default async function FormPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    // Check if the user exists before rendering the EditUserPage
    const userData = await prisma.user.findUnique({
        where: { id: params.id },
    });

    if (!userData) {
        return notFound();
    }

    return (
        <Dialog open={true}>
            <DialogContent>
                <EditUserPage params={params} />
            </DialogContent>
        </Dialog>
    );
}
