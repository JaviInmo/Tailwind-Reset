import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import { CategoryUpdateForm } from "../cat-form"

export default async function EditCatPage(props: {
  params: { id: string }
}) {
  const params = props.params
  await getAuth()

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

  if (!categoryData) {
    return <div>Categoría no encontrada</div>
  }

  return <CategoryUpdateForm categoryData={categoryData} />
}
