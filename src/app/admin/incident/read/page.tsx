// page.tsx
import prisma from "@/libs/db"
import Table from "./Table"

type TableSearchParams = Partial<{
  page: string
  search: string
  sort: string // Campo por el que ordenar (ej: "provincia", "numeroPeople", etc.)
  order: "asc" | "desc" // Orden: ascendente o descendente
  limit: string // Cantidad de elementos por página
}>

export default async function Page(props: { searchParams: Promise<TableSearchParams> }) {
  const searchParams = await props.searchParams
  // Leer el parámetro "limit" y asignar un valor por defecto de 10 si no existe
  const itemsPerPage = searchParams.limit ? Number(searchParams.limit) : 10
  const page = searchParams.page ? Number(searchParams.page) : 1
  const search = searchParams.search ?? null

  // Parámetros de ordenamiento
  const sortField = searchParams.sort ?? "date"
  const sortOrder = searchParams.order ?? "desc"
  const skip = (page - 1) * itemsPerPage

  const sortMapping: { [key: string]: any } = {
    provincia: { province: { name: sortOrder } },
    municipio: { municipality: { name: sortOrder } },
    variable: { variable: { name: sortOrder } },
    categoria: { category: { name: sortOrder } },
    subcategoria: { subcategory: { name: sortOrder } },
    segundasubcategoria: { secondSubcategory: { name: sortOrder } },
    amount: { amount: sortOrder },
    numberOfPeople: { numberOfPeople: sortOrder },
    descripcion: { description: sortOrder },
    fecha: { date: sortOrder },
    titulo: { title: sortOrder },
  }

  const orderBy = sortMapping[sortField] || { date: "desc" }
  const searchNumber = Number(search)
  const hasNumericSearch = !isNaN(searchNumber)

  const incidentCount = await prisma.incident.count({
    where: search
      ? {
          OR: [
            { description: { contains: search, mode: "insensitive" } },
            { title: { contains: search, mode: "insensitive" } },
            { variable: { name: { contains: search, mode: "insensitive" } } },
            { category: { name: { contains: search, mode: "insensitive" } } },
            { subcategory: { name: { contains: search, mode: "insensitive" } } },
            { secondSubcategory: { name: { contains: search, mode: "insensitive" } } },
            { province: { name: { contains: search, mode: "insensitive" } } },
            { municipality: { name: { contains: search, mode: "insensitive" } } },
            ...(hasNumericSearch ? [{ numberOfPeople: searchNumber }, { amount: searchNumber }] : []),
          ],
        }
      : undefined,
  })

  const incidents = await prisma.incident.findMany({
    orderBy,
    include: {
      province: { select: { name: true } },
      municipality: { select: { name: true } },
      variable: { select: { name: true } },
      category: { select: { name: true } },
      subcategory: { select: { name: true } },
      secondSubcategory: { select: { name: true } },
      unitMeasure: true,
    },
    where: search
      ? {
          OR: [
            { description: { contains: search, mode: "insensitive" } },
            { title: { contains: search, mode: "insensitive" } },
            { variable: { name: { contains: search, mode: "insensitive" } } },
            { category: { name: { contains: search, mode: "insensitive" } } },
            { subcategory: { name: { contains: search, mode: "insensitive" } } },
            { secondSubcategory: { name: { contains: search, mode: "insensitive" } } },
            { province: { name: { contains: search, mode: "insensitive" } } },
            { municipality: { name: { contains: search, mode: "insensitive" } } },
            ...(hasNumericSearch ? [{ numberOfPeople: searchNumber }, { amount: searchNumber }] : []),
          ],
        }
      : undefined,
    take: itemsPerPage,
    skip: skip,
  })

  const pageCount = Math.ceil(incidentCount / itemsPerPage)

  const data = incidents.map((incident) => ({
    id: incident.id,
    variable: incident.variable.name,
    categoria: incident.category.name,
    subcategoria: incident.subcategory?.name || "",
    segundasubcategoria: incident.secondSubcategory?.name || "",
    amount: incident.amount || 0,
    numberOfPeople: incident.numberOfPeople || 0,
    descripcion: incident.description,
    provincia: incident.province.name,
    municipio: incident.municipality.name,
    fecha: incident.date.toISOString().split("T")[0],
    titulo: incident.title,
  }))

  return <Table data={data} pageCount={pageCount} currentPage={page} />
}
