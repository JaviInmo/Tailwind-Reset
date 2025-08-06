import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"
import { ItemEditForm } from "../../../update/item-edit-form" // Ruta corregida
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog" // Usando shadcn/ui Dialog

export default async function ModalEditItemPage({ params }: { params: { id: string } }) {
  await getAuth()

  const id = Number(params.id)

  const itemData = await prisma.item.findUnique({
    where: { id },
    include: {
      variable: true,
      category: true,
      subcategory: true,
      secondSubcategory: true,
      availableUnitMeasures: {
        include: {
          unitMeasure: true,
        },
      },
    },
  })

  if (!itemData) {
    return notFound()
  }

  const variableData = await prisma.variable.findMany({
    include: {
      categories: {
        include: {
          subcategories: {
            include: {
              secondSubcategories: true,
            },
          },
        },
      },
    },
  })

  const unitMeasures = await prisma.unitMeasure.findMany({
    select: { id: true, name: true },
  })

  return (
    <Dialog open={true}>
      <DialogContent className="max-h-[90vh] overflow-y-auto"> {/* Ajuste para scroll si el contenido es largo */}
        <DialogDescription>
          <ItemEditForm
            itemData={itemData}
            variableData={variableData}
            unitMeasures={unitMeasures}
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
