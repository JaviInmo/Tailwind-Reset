import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import { Prisma } from "@prisma/client"

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
  const sortField = searchParams.sort ?? "title"
  const sortOrder = searchParams.order ?? "asc"
  const skip = (page - 1) * itemsPerPage

  // Sort mapping
  const sortMapping: { [key: string]: any } = {
    id: { id: sortOrder },
    title: { title: sortOrder },
    date: { date: sortOrder },
    variable: { variable: { name: sortOrder } },
    category: { category: { name: sortOrder } },
    subcategory: { subcategory: { name: sortOrder } },
    secondSubcategory: { secondSubcategory: { name: sortOrder } },
    province: { province: { name: sortOrder } },
    municipality: { municipality: { name: sortOrder } },
  }

  const orderBy = sortMapping[sortField] || { title: "asc" }

  // Database query with Prisma, applying search if provided
  const incidentCount = await prisma.incident.count({
    where: search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { variable: { name: { contains: search, mode: "insensitive" } } },
            { category: { name: { contains: search, mode: "insensitive" } } },
            { subcategory: { name: { contains: search, mode: "insensitive" } } },
            { secondSubcategory: { name: { contains: search, mode: "insensitive" } } },
            { province: { name: { contains: search, mode: "insensitive" } } },
            { municipality: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
  })

  // Fetch incidents with their relations
  const incidents = await prisma.incident.findMany({
    orderBy,
    include: {
      variable: true,
      category: true,
      subcategory: true,
      secondSubcategory: true,
      province: true,
      municipality: true,
      // Use raw query to get unit measures since the Prisma client might not be updated
    },
    where: search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { variable: { name: { contains: search, mode: "insensitive" } } },
            { category: { name: { contains: search, mode: "insensitive" } } },
            { subcategory: { name: { contains: search, mode: "insensitive" } } },
            { secondSubcategory: { name: { contains: search, mode: "insensitive" } } },
            { province: { name: { contains: search, mode: "insensitive" } } },
            { municipality: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
    take: itemsPerPage,
    skip: skip,
  })

  // Fetch unit measures for each incident using raw query
  const incidentIds = incidents.map((incident) => incident.id)

  // Only fetch unit measures if there are incidents
  let unitMeasuresMap: Record<number, string[]> = {}

  if (incidentIds.length > 0) {
    const unitMeasuresData = (await prisma.$queryRaw`
      SELECT ium.incident_id, um.name 
      FROM incident_unit_measures ium
      JOIN unidades_medida um ON ium.unit_measure_id = um.id
      WHERE ium.incident_id IN (${Prisma.join(incidentIds)})
    `) as { incident_id: number; name: string }[]

    // Group unit measures by incident ID
    unitMeasuresMap = unitMeasuresData.reduce(
      (acc, { incident_id, name }) => {
        if (!acc[incident_id]) {
          acc[incident_id] = []
        }
        acc[incident_id].push(name)
        return acc
      },
      {} as Record<number, string[]>,
    )
  }

  const pageCount = Math.ceil(incidentCount / itemsPerPage)

  const columns = {
    id: "Id",
    title: "Título",
    date: "Fecha",
    variable: "Variable",
    category: "Categoría",
    subcategory: "Subcategoría",
    secondSubcategory: "Segunda Subcategoría",
    province: "Provincia",
    municipality: "Municipio",
    unitMeasures: "Unidades de Medida",
  }

  // Map data to the expected format
  const data = incidents.map((incident) => ({
    id: incident.id.toString(),
    title: incident.title,
    date: new Date(incident.date).toLocaleDateString(),
    variable: incident.variable?.name || "-",
    category: incident.category?.name || "-",
    subcategory: incident.subcategory?.name || "-",
    secondSubcategory: incident.secondSubcategory?.name || "-",
    province: incident.province?.name || "-",
    municipality: incident.municipality?.name || "-",
    unitMeasures: unitMeasuresMap[incident.id]?.join(", ") || "-",
  }))

  const defaultHiddenColumns: (keyof typeof columns)[] = ["id"]

  return (
    <GenericTableRoot>
      <GenericTableHeader title="Tabla de Incidentes">
        <GenericTableSearch />
        <Link href="/admin/incident/items/create">
          <Button variant="default">Agregar Incidente</Button>
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
