import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"
import { IncidentEditForm } from "../incident-edit-form" // Importar el nuevo formulario de edición

export default async function EditIncidentPage({ params }: { params: { id: string } }) {
  await getAuth()

  const id = Number(params.id)

  // Obtener los datos del incidente, incluyendo todas sus relaciones necesarias
  const incidentData = await prisma.incident.findUnique({
    where: { id },
    include: {
      province: true,
      municipality: true,
      variable: true,
      category: true,
      subcategory: true,
      secondSubcategory: true,
      items: {
        include: {
          item: {
            include: {
              availableUnitMeasures: {
                include: {
                  unitMeasure: true
                }
              }
            }
          },
          unitMeasure: true,
        },
      },
    },
  })

  if (!incidentData) {
    return notFound()
  }

  // Obtener datos para los selects de profundidad (variables, categorías, etc.)
  const variableData = await prisma.variable.findMany({
    include: {
      categories: {
        include: {
          subcategories: {
            include: { secondSubcategories: true },
          },
        },
      },
    },
  })

  // Obtener datos para los selects de ubicación (provincias, municipios)
  const provinceData = await prisma.province.findMany({
    include: { municipalities: true },
  })

  return (
    <IncidentEditForm
      incidentData={incidentData}
      provinceData={provinceData}
      variableData={variableData}
    />
  )
}
