import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import { ReportForm } from "../create/report-form" // Ruta corregida

export default async function FormPage() {
  await getAuth()
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
  const provinceData = await prisma.province.findMany({
    include: { municipalities: true },
  })
  return <ReportForm provinceData={provinceData} variableData={variableData} />
}
