import { EditContactPage } from "@/app/admin/agenda/edit/[id]/page";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/app-dialog";
import { getAuth } from "@/libs/auth";

export default async function FormPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    return <Dialog open={true}>
                <DialogContent  >
                   
                    <DialogDescription>
                        <EditContactPage params={params} />
                    </DialogDescription>
                   
                </DialogContent>
            </Dialog>
}