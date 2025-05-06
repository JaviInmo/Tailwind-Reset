import { SubCatForm } from "../../create/subcat-form"
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/app-dialog"

export default async function ModalCreatePage() {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogDescription>
          <SubCatForm />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
