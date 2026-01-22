import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"

import {
  GenericTableContent,
  GenericTableFooter,
  GenericTableHeader,
  GenericTableRoot,
} from "@/components/generic/generic-table"
import { CatActions } from "./actions"
import {
  GenericTablePageSize,
  GenericTablePagination,
  GenericTableSearch,
} from "@/components/generic/generic-table-filters"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Prisma } from "@prisma/client"

type TableSearchParams = Partial<{
  page: string
  search: string
  sort: string
  order: "asc" | "desc"
  limit: string
}>

export default async function Page(props: { searchParams: Promise<TableSearchParams> }) {
  await getAuth()

  const searchParams = await props.searchParams
  // Default parameters from URL
  const itemsPerPage = searchParams.limit ? Number(searchParams.limit) : 10
  const page = searchParams.page ? Number(searchParams.page) : 1
  const search = searchParams.search ?? null
  const sortField = searchParams.sort ?? "name"
  const sortOrder = searchParams.order ?? "asc"
  const skip = (page - 1) * itemsPerPage

  // Sort mapping
  const sortMapping: Record<string, Prisma.CategoryOrderByWithRelationInput> = {
    name: { name: sortOrder },
    variable: { variable: { name: sortOrder } },
  }

  const orderBy: Prisma.CategoryOrderByWithRelationInput =
    sortMapping[sortField] || { name: "asc" }

  // Database query with Prisma, applying search if provided
  const categoryCount = await prisma.category.count({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { variable: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
  })

  const categories = await prisma.category.findMany({
    orderBy,
    include: {
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
    take: itemsPerPage,
    skip: skip,
  })

  const pageCount = Math.ceil(categoryCount / itemsPerPage)

  const columns = { id: "Id", name: "Nombre", variable: "Variable" }

  // Map data to the expected format
  const data = categories.map((category) => ({
    id: category.id.toString(),
    name: category.name,
    variable: category.variable.name,
  }))

  const defaultHiddenColumns: (keyof typeof columns)[] = ["id"]

  return (
    <GenericTableRoot>
      <GenericTableHeader title="Tabla de Categorías">
        <GenericTableSearch />
        <Link href="/admin/incident/vars/cat/create">
          <Button variant="default">Agregar Categoría</Button>
        </Link>
      </GenericTableHeader>
      <GenericTableContent
        data={data}
        columns={columns}
        defaultHiddenColumns={defaultHiddenColumns}
        extraColumns={[
          {
            head: "Acciones",
            cell: <CatActions />,
          },
        ]}
      />
      <GenericTableFooter>
        <GenericTablePageSize />
        <GenericTablePagination pageCount={pageCount} />
      </GenericTableFooter>
    </GenericTableRoot>
  )
}
