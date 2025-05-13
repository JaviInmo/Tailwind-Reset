import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"

import {
  GenericTableContent,
  GenericTableFooter,
  GenericTableHeader,
  GenericTableRoot,
} from "@/components/generic/generic-table"
import { ItemActions } from "./actions"
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
  const sortField = searchParams.sort ?? "productName"
  const sortOrder = searchParams.order ?? "asc"
  const skip = (page - 1) * itemsPerPage

  // Sort mapping
  const sortMapping: { [key: string]: any } = {
    productName: { productName: sortOrder },
    quantity: { quantity: sortOrder },
    unitMeasure: { unitMeasure: { name: sortOrder } },
    incident: { incident: { title: sortOrder } },
  }

  const orderBy = sortMapping[sortField] || { productName: "asc" }

  // Database query with Prisma, applying search if provided
  const itemCount = await prisma.incidentItem.count({
    where: search
      ? {
          OR: [
            { productName: { contains: search, mode: "insensitive" } },
            { incident: { title: { contains: search, mode: "insensitive" } } },
            { unitMeasure: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
  })

  const items = await prisma.incidentItem.findMany({
    orderBy,
    include: {
      incident: {
        select: {
          id: true,
          title: true,
        },
      },
      unitMeasure: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: search
      ? {
          OR: [
            { productName: { contains: search, mode: "insensitive" } },
            { incident: { title: { contains: search, mode: "insensitive" } } },
            { unitMeasure: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
    take: itemsPerPage,
    skip: skip,
  })

  const pageCount = Math.ceil(itemCount / itemsPerPage)

  const columns = {
    id: "Id",
    productName: "Producto",
    quantity: "Cantidad",
    unitMeasure: "Unidad de Medida",
    incident: "Incidente",
  }

  // Map data to the expected format
  const data = items.map((item) => ({
    id: item.id.toString(),
    productName: item.productName,
    quantity: item.quantity.toString(),
    unitMeasure: item.unitMeasure?.name || "-",
    incident: item.incident.title,
  }))

  const defaultHiddenColumns: (keyof typeof columns)[] = ["id"]

  return (
    <GenericTableRoot>
      <GenericTableHeader title="Tabla de Ítems de Incidentes">
        <GenericTableSearch />
        <Link href="/admin/incident/items/create">
          <Button variant="default">Agregar Ítem</Button>
        </Link>
      </GenericTableHeader>
      <GenericTableContent
        data={data}
        columns={columns}
        defaultHiddenColumns={defaultHiddenColumns}
        extraColumns={[
          {
            head: "Acciones",
            cell: <ItemActions />,
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
