import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"

import {
  GenericTableContent,
  GenericTableFooter,
  GenericTableHeader,
  GenericTableRoot,
} from "@/components/generic/generic-table"
import { SubCatActions } from "./actions"
import {
  GenericTablePageSize,
  GenericTablePagination,
  GenericTableSearch,
} from "@/components/generic/generic-table-filters"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
  const sortMapping: { [key: string]: any } = {
    name: { name: sortOrder },
    category: { category: { name: sortOrder } },
  }

  const orderBy = sortMapping[sortField] || { name: "asc" }

  // Database query with Prisma, applying search if provided
  const subcategoryCount = await prisma.subcategory.count({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { category: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
  })

  const subcategories = await prisma.subcategory.findMany({
    orderBy,
    include: {
      category: {
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
            { category: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
    take: itemsPerPage,
    skip: skip,
  })

  const pageCount = Math.ceil(subcategoryCount / itemsPerPage)

  const columns = { id: "Id", name: "Nombre", category: "Categoría" }

  // Map data to the expected format
  const data = subcategories.map((subcategory) => ({
    id: subcategory.id.toString(),
    name: subcategory.name,
    category: subcategory.category.name,
  }))

  const defaultHiddenColumns: (keyof typeof columns)[] = ["id"]

  return (
    <GenericTableRoot>
      <GenericTableHeader title="Tabla de Subcategorías">
        <GenericTableSearch />
        <Link href="/admin/incident/vars/subcat/create">
          <Button variant="default">Agregar Subcategoría</Button>
        </Link>
      </GenericTableHeader>
      <GenericTableContent
        data={data}
        columns={columns}
        defaultHiddenColumns={defaultHiddenColumns}
        extraColumns={[
          {
            head: "Acciones",
            cell: <SubCatActions />,
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
