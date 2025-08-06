import prisma from "@/libs/db"
import Table from "./Table"

type TableSearchParams = Partial<{
  page: string
  search: string
  sort: string // Campo por el que ordenar (ej: "productName", "variable", etc.)
  order: "asc" | "desc" // Orden: ascendente o descendente
  limit: string // Cantidad de elementos por página
}>

export default async function Page(props: { searchParams: TableSearchParams }) {
  const searchParams = props.searchParams
  const itemsPerPage = searchParams.limit ? Number(searchParams.limit) : 10
  const page = searchParams.page ? Number(searchParams.page) : 1
  const search = searchParams.search ?? null

  const sortField = searchParams.sort ?? "productName"
  const sortOrder = searchParams.order ?? "asc" // Default asc for names

  const skip = (page - 1) * itemsPerPage

  const sortMapping: { [key: string]: any } = {
    productName: { productName: sortOrder },
    variable: { variable: { name: sortOrder } },
    categoria: { category: { name: sortOrder } },
    subcategoria: { subcategory: { name: sortOrder } },
    segundasubcategoria: { secondSubcategory: { name: sortOrder } },
  }

  const orderBy = sortMapping[sortField] || { productName: "asc" }

  const itemCount = await prisma.item.count({
    where: search
      ? {
          OR: [
            { productName: { contains: search, mode: "insensitive" } },
            { variable: { name: { contains: search, mode: "insensitive" } } },
            { category: { name: { contains: search, mode: "insensitive" } } },
            { subcategory: { name: { contains: search, mode: "insensitive" } } },
            { secondSubcategory: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
  })

  const items = await prisma.item.findMany({
    orderBy,
    include: {
      variable: { select: { name: true } },
      category: { select: { name: true } },
      subcategory: { select: { name: true } },
      secondSubcategory: { select: { name: true } },
      availableUnitMeasures: {
        include: {
          unitMeasure: {
            select: { name: true }
          }
        }
      }
    },
    where: search
      ? {
          OR: [
            { productName: { contains: search, mode: "insensitive" } },
            { variable: { name: { contains: search, mode: "insensitive" } } },
            { category: { name: { contains: search, mode: "insensitive" } } },
            { subcategory: { name: { contains: search, mode: "insensitive" } } },
            { secondSubcategory: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
    take: itemsPerPage,
    skip: skip,
  })

  const pageCount = Math.ceil(itemCount / itemsPerPage)

  const data = items.map((item) => ({
    id: item.id,
    productName: item.productName,
    variable: item.variable.name,
    categoria: item.category.name,
    subcategoria: item.subcategory.name, // subcategory es requerido en el modelo Item
    segundasubcategoria: item.secondSubcategory?.name || "",
    unitMeasures: item.availableUnitMeasures.map(ium => ium.unitMeasure.name).join(", "), // Unir nombres de unidades
  }))

  return <Table data={data} pageCount={pageCount} currentPage={page} />
}
