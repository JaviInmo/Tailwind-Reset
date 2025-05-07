import { SecondSubCatForm } from "../../create/secondsubcat-form";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/app-dialog"

export default async function ModalCreatePage() {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogDescription>
          <SecondSubCatForm />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
