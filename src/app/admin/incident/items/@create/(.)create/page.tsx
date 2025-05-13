import { ItemForm } from "../../create/item-form"
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/app-dialog"

export default async function ModalCreatePage() {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogDescription>
          <ItemForm />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
