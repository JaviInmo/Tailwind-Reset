import { EditVarPage } from "@/app/admin/incident/vars/var/edit/[id]/page";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/app-dialog";

export default async function ModalEditPage({ params }: { params: { id: string } }) {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogDescription>
          <EditVarPage params={params} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
