import { ViewPage } from "@/app/admin/incident/view/[id]/page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/app-dialog";

export default async function ModalViewPage({ params }: { params: { id: string } }) {
  return (
    <Dialog open={true}>
      <DialogContent>
       
          <DialogDescription>
            <ViewPage params={params} />
          </DialogDescription>
       
      </DialogContent>
    </Dialog>
  );
}
