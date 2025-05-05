import { VariableForm } from "../../create/var-form"
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/app-dialog"

export default async function ModalCreatePage() {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogDescription>
          <VariableForm />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
