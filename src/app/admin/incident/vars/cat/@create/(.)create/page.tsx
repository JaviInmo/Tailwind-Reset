import { CatForm } from "../../create/cat-form"
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/app-dialog"
import { fetchVariables } from "../../create/cat.action"

export default async function ModalCreatePage() {
  // Pre-fetch variables on the server before rendering the modal
  const variables = await fetchVariables()

  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogDescription>
          <CatForm initialVariables={variables} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
