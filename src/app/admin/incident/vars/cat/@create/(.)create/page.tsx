import { CatForm } from "../../create/cat-form"
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/app-dialog"

export default async function ModalCreatePage() {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogDescription>
          <CatForm />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
