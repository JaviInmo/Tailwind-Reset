import { EditReportPage } from "@/app/admin/incident/edit/[id]/page"
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/app-dialog"

export default async function FormPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params

  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>
            <EditReportPage params={params} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
