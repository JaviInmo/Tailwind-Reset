import { UnitForm } from "../../create/unit-form"
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/app-dialog"

export default async function ModalCreatePage() {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogDescription>
          <UnitForm />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
