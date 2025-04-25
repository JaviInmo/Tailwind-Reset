import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"

import TablePage from "./catTable"

export default async function CatPage(props: { searchParams: { [key: string]: string | string[] | undefined } }) {
  await getAuth()

  // Get search parameters
  const search = typeof props.searchParams.search === "string" ? props.searchParams.search : undefined

  // Fetch categories with search filter if provided
  const categorias = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      variableId: true,
      variable: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { variable: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
  })

  const categoriasConVariable = categorias.map((categoria) => ({
    id: categoria.id,
    name: categoria.name,
    variable: categoria.variable.name,
    variableId: categoria.variableId,
  }))

  return (
    <div className="container">
      <TablePage data={categoriasConVariable} />
    </div>
  )
}
