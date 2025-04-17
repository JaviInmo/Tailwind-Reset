
import EditVarPage from "@/app/admin/incident/vars/var/edit/[id]/page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/app-dialog";

export default async function ModalEditVar(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  return (
    <Dialog open={true}>
      <DialogContent>
        
        <DialogDescription>
          {/* Reutilizamos la página “plana” de edición dentro del modal */}
          <EditVarPage params={params} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
