import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import type { Prisma } from "@prisma/client"

import {
  GenericTableContent,
  GenericTableFooter,
  GenericTableHeader,
  GenericTableRoot,
} from "@/components/generic/generic-table"
import { UnitActions } from "./actions"
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
  const itemsPerPage = searchParams.limit ? Number(searchParams.limit) : 10
  const page = searchParams.page ? Number(searchParams.page) : 1
  const search = searchParams.search ?? null
  const sortField = searchParams.sort ?? "name"
  const sortOrder = searchParams.order ?? "asc"
  const skip = (page - 1) * itemsPerPage

  // Sort mapping tipado
  const sortMapping: Record<string, Prisma.UnitMeasureOrderByWithRelationInput> = {
    id: { id: sortOrder },
    name: { name: sortOrder },
  }

  const orderBy = sortMapping[sortField] || { name: "asc" }

  const unitCount = await prisma.unitMeasure.count({
    where: search
      ? { name: { contains: search, mode: "insensitive" } }
      : undefined,
  })

  const units = await prisma.unitMeasure.findMany({
    orderBy,
    where: search
      ? { name: { contains: search, mode: "insensitive" } }
      : undefined,
    take: itemsPerPage,
    skip,
  })

  const pageCount = Math.ceil(unitCount / itemsPerPage)

  const columns = {
    id: "ID",
    name: "Nombre",
  }

  const data = units.map((unit) => ({
    id: unit.id.toString(),
    name: unit.name,
  }))

  const defaultHiddenColumns: (keyof typeof columns)[] = ["id"]

  return (
    <GenericTableRoot>
      <GenericTableHeader title="Unidades de Medida">
        <GenericTableSearch />
        <Link href="/admin/incident/measures/create">
          <Button variant="default">Agregar Unidad</Button>
        </Link>
      </GenericTableHeader>
      <GenericTableContent
        data={data}
        columns={columns}
        defaultHiddenColumns={defaultHiddenColumns}
        extraColumns={[
          {
            head: "Acciones",
            cell: <UnitActions />,
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
