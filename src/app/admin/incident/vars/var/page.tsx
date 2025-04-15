import prisma from "@/libs/db";
import VariablesTable from "./VarTable";

type TableSearchParams = Partial<{
  page: string;
  search: string;
  sort: string;           // En este ejemplo se ordena sólo por "name"
  order: "asc" | "desc";
  limit: string;
}>;

export default async function Page({ searchParams }: { searchParams: TableSearchParams }) {
  // Parámetros por defecto provenientes de la URL
  const itemsPerPage = searchParams.limit ? Number(searchParams.limit) : 10;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const search = searchParams.search ?? null;
  const sortField = searchParams.sort ?? "name";
  const sortOrder = searchParams.order ?? "asc";
  const skip = (page - 1) * itemsPerPage;

  // Mapeo del ordenamiento: en este caso, solo se permite ordenar por "name"
  const sortMapping: { [key: string]: any } = {
    name: { name: sortOrder },
  };

  const orderBy = sortMapping[sortField] || { name: "asc" };

  // Consulta de la base de datos con Prisma, aplicando búsqueda si corresponde
  const variableCount = await prisma.variable.count({
    where: search
      ? {
          name: { contains: search, mode: "insensitive" },
        }
      : undefined,
  });

  const variables = await prisma.variable.findMany({
    orderBy,
    select: { id: true, name: true },
    take: itemsPerPage,
    skip: skip,
    where: search
      ? {
          name: { contains: search, mode: "insensitive" },
        }
      : undefined,
  });

  const pageCount = Math.ceil(variableCount / itemsPerPage);

  return (
    <VariablesTable
      data={variables}
      pageCount={pageCount}
      currentPage={page}
    />
  );
}
