import EditCatPage from "@/app/admin/incident/vars/cat/update/[id]/page"
import { Dialog, DialogContent } from "@/components/ui/app-dialog"
import prisma from "@/libs/db"

export default async function ModalEditCat(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params

  // Check if the category exists before rendering the EditCatPage
  const id = Number(params.id)
  const categoryData = await prisma.category.findUnique({
    where: { id },
    include: {
      variable: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  return (
    <Dialog open={true}>
      <DialogContent>
        {categoryData ? (
          <EditCatPage params={params} />
        ) : (
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600">Categoría no encontrada</h2>
            <p className="mt-2 text-gray-600">La categoría con ID {params.id} no existe.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
