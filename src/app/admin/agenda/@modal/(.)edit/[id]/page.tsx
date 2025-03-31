import { EditContactPage } from "@/app/admin/agenda/edit/[id]/page";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/app-dialog";
import { getAuth } from "@/libs/auth";

export default async function FormPage({ params }: { params: { id: string } }) {

    return <Dialog open={true}>
                <DialogContent  >
                    <DialogHeader>
                    <DialogDescription>
                        <EditContactPage params={params} />
                    </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
}