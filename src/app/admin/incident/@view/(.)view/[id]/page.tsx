import { ViewPage } from "@/app/admin/incident/view/[id]/page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/app-dialog";

export default async function ModalViewPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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
