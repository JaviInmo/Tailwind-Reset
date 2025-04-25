import EditVarPage from "@/app/admin/incident/vars/var/edit/[id]/page"
import { Dialog, DialogContent } from "@/components/ui/app-dialog"
import prisma from "@/libs/db"

export default async function ModalEditVar(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params

  // Check if the variable exists before rendering the EditVarPage
  const id = Number(params.id)
  const variableData = await prisma.variable.findUnique({
    where: { id },
    include: { categories: { include: { subcategories: true } } },
  })

  return (
    <Dialog open={true}>
      <DialogContent>
        {variableData ? (
          <EditVarPage params={params} />
        ) : (
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600">Variable not found</h2>
            <p className="mt-2 text-gray-600">The variable with ID {params.id} does not exist.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
