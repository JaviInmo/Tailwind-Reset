import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import { ItemForm } from "../../../items/create/item-form" // Ruta corregida
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/app-dialog" // Usando shadcn/ui Dialog

export default async function ModalCreateItemPage() {
  await getAuth()

  const unitMeasures = await prisma.unitMeasure.findMany({
    select: { id: true, name: true },
  })

  const variableData = await prisma.variable.findMany({
    include: {
      categories: {
        include: {
          subcategories: {
            include: {
              secondSubcategories: true
            }
          }
        }
      }
    },
  })

  return (
    <Dialog open={true}>
      <DialogContent className="max-h-[90vh] overflow-y-auto"> {/* Ajuste para scroll si el contenido es largo */}
        <DialogDescription>
          <ItemForm unitMeasures={unitMeasures} variableData={variableData} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
