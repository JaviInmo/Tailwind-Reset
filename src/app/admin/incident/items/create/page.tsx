import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import { ItemForm } from "./item-form"

export default async function FormPage() {
  await getAuth()

  // Se vuelven a obtener las unidades de medida para el formulario
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

  // Se pasan unitMeasures al ItemForm
  return <ItemForm unitMeasures={unitMeasures} variableData={variableData} />
}
