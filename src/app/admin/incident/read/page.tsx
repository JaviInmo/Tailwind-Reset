import prisma from "@/libs/db";
import Table from "./Table";

type TableSearchParams = Partial<{
  page: string;
  search: string;
  sort: string;           // Campo por el que ordenar (ej: "provincia", "numeroPeople", etc.)
  order: "asc" | "desc";  // Orden: ascendente o descendente
}>;

export default async function Page({ searchParams }: { searchParams: TableSearchParams }) {
  const itemsPerPage = 5;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const search = searchParams.search ?? null;
  // Recibir los parámetros de ordenamiento, con valores por defecto
  const sortField = searchParams.sort ?? "date";
  const sortOrder = searchParams.order ?? "desc";
  const skip = (page - 1) * itemsPerPage;

  // Definir un mapeo entre el parámetro recibido y la estructura que espera Prisma en orderBy
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
  };

  // Se asigna el orderBy de Prisma según el campo recibido; si no se reconoce, se ordena por fecha por defecto
  const orderBy = sortMapping[sortField] || { date: "desc" };

  // Convertir la búsqueda a número para filtrar campos numéricos si es posible
  const searchNumber = Number(search);
  const hasNumericSearch = !isNaN(searchNumber);

  // Contar las incidencias aplicando el filtro de búsqueda
  const incidentCount = await prisma.incident.count({
    where: search
      ? {
          OR: [
            { description: { contains: search, mode: "insensitive" } },
            { variable: { name: { contains: search, mode: "insensitive" } } },
            { category: { name: { contains: search, mode: "insensitive" } } },
            { subcategory: { name: { contains: search, mode: "insensitive" } } },
            { secondSubcategory: { name: { contains: search, mode: "insensitive" } } },
            { province: { name: { contains: search, mode: "insensitive" } } },
            { municipality: { name: { contains: search, mode: "insensitive" } } },
            ...(hasNumericSearch
              ? [
                  { numberOfPeople: searchNumber },
                  { amount: searchNumber }
                ]
              : []),
          ],
        }
      : undefined,
  });

  // Obtener las incidencias incluyendo las relaciones necesarias y aplicar el ordenamiento dinámico
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
            { variable: { name: { contains: search, mode: "insensitive" } } },
            { category: { name: { contains: search, mode: "insensitive" } } },
            { subcategory: { name: { contains: search, mode: "insensitive" } } },
            { secondSubcategory: { name: { contains: search, mode: "insensitive" } } },
            { province: { name: { contains: search, mode: "insensitive" } } },
            { municipality: { name: { contains: search, mode: "insensitive" } } },
            ...(hasNumericSearch
              ? [
                  { numberOfPeople: searchNumber },
                  { amount: searchNumber }
                ]
              : []),
          ],
        }
      : undefined,
    take: itemsPerPage,
    skip: skip,
  });

  const pageCount = Math.ceil(incidentCount / itemsPerPage);

  // Mapear los datos para que sean compatibles con el componente de tabla
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
  }));

  return <Table data={data} pageCount={pageCount} currentPage={page} />;
}
