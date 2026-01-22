import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import Table from "./Table"
import { Prisma } from "@prisma/client"

// Tipos derivados de Prisma
type IncidentWithRelations = Prisma.IncidentGetPayload<{
  include: {
    province: { select: { name: true; id: true } }
    municipality: { select: { name: true; id: true } }
    variable: { select: { name: true; id: true } }
    category: { select: { name: true; id: true } }
    subcategory: { select: { name: true; id: true } }
    secondSubcategory: { select: { name: true; id: true } }
    items: {
      include: {
        item: { select: { productName: true } }
        unitMeasure: { select: { id: true; name: true } }
      }
    }
  }
}>

type ProvinceWithMunicipalities = Prisma.ProvinceGetPayload<{
  include: { municipalities: true }
}>

type VariableWithRelations = Prisma.VariableGetPayload<{
  include: {
    categories: {
      include: {
        subcategories: {
          include: { secondSubcategories: true }
        }
      }
    }
  }
}>

type TableSearchParams = Partial<{
  page: string
  search: string
  sort: string
  order: "asc" | "desc"
  limit: string
}>

export default async function Page(props: { searchParams: TableSearchParams }) {
  await getAuth()
  const searchParams = props.searchParams
  const itemsPerPage = searchParams.limit ? Number(searchParams.limit) : 10
  const page = searchParams.page ? Number(searchParams.page) : 1
  const search = searchParams.search ?? null

  const sortField = searchParams.sort ?? "date"
  const sortOrder = searchParams.order ?? "desc"
  const skip = (page - 1) * itemsPerPage

  const sortMapping: Record<string, Prisma.IncidentOrderByWithRelationInput> = {
    provincia: { province: { name: sortOrder } },
    municipio: { municipality: { name: sortOrder } },
    variable: { variable: { name: sortOrder } },
    categoria: { category: { name: sortOrder } },
    subcategoria: { subcategory: { name: sortOrder } },
    segundasubcategoria: { secondSubcategory: { name: sortOrder } },
    numberOfPeople: { numberOfPeople: sortOrder },
    descripcion: { description: sortOrder },
    fecha: { date: sortOrder },
    titulo: { title: sortOrder },
    itemsSummary: { items: { _count: sortOrder } },
  }

  const orderBy = sortMapping[sortField] || { date: "desc" }
  const searchNumber = Number(search)
  const hasNumericSearch = !isNaN(searchNumber)

  const createStringFilter = (value: string): Prisma.StringFilter => ({
    contains: value,
    mode: Prisma.QueryMode.insensitive,
  })

  const baseWhere: Prisma.IncidentWhereInput | undefined = search
    ? {
        OR: [
          { description: createStringFilter(search) },
          { title: createStringFilter(search) },
          { variable: { name: createStringFilter(search) } },
          { category: { name: createStringFilter(search) } },
          { subcategory: { name: createStringFilter(search) } },
          { secondSubcategory: { name: createStringFilter(search) } },
          { province: { name: createStringFilter(search) } },
          { municipality: { name: createStringFilter(search) } },
          ...(hasNumericSearch ? [{ numberOfPeople: searchNumber }] : []),
        ],
      }
    : undefined

  const incidentCount = await prisma.incident.count({ where: baseWhere })

  const incidents: IncidentWithRelations[] = await prisma.incident.findMany({
    orderBy,
    include: {
      province: { select: { name: true, id: true } },
      municipality: { select: { name: true, id: true } },
      variable: { select: { name: true, id: true } },
      category: { select: { name: true, id: true } },
      subcategory: { select: { name: true, id: true } },
      secondSubcategory: { select: { name: true, id: true } },
      items: {
        include: {
          item: { select: { productName: true } },
          unitMeasure: { select: { id: true, name: true } },
        },
      },
    },
    where: baseWhere,
    take: itemsPerPage,
    skip,
  })

  const pageCount = Math.ceil(incidentCount / itemsPerPage)

  const data = incidents.map((incident) => ({
    id: incident.id,
    variable: incident.variable.name,
    categoria: incident.category.name,
    subcategoria: incident.subcategory?.name || "",
    segundasubcategoria: incident.secondSubcategory?.name || "",
    numberOfPeople: incident.numberOfPeople || 0,
    descripcion: incident.description,
    provincia: incident.province.name,
    municipio: incident.municipality.name,
    fecha: incident.date.toISOString().split("T")[0],
    titulo: incident.title,
    itemsSummary: incident.items
      .map(
        (item) =>
          `${item.item.productName} (${item.quantityUsed} ${
            item.unitMeasure?.name || ""
          })`
      )
      .join(", "),
  }))

  const provinceData: ProvinceWithMunicipalities[] =
    await prisma.province.findMany({
      include: { municipalities: true },
    })

  const variableData: VariableWithRelations[] = await prisma.variable.findMany({
    include: {
      categories: {
        include: {
          subcategories: { include: { secondSubcategories: true } },
        },
      },
    },
  })

  return (
    <Table
      data={data}
      pageCount={pageCount}
      currentPage={page}
      incidentsFullData={incidents}
      provinceData={provinceData}
      variableData={variableData}
    />
  )
}
