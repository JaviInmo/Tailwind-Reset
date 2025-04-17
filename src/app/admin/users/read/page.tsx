import prisma from "@/libs/db";
import UsersTable from "./Table";
import { Role } from "@prisma/client";

type TableSearchParams = Partial<{
  page: string;
  search: string;
  sort: string;           // Campo por el que ordenar (ej: "name", "role")
  order: "asc" | "desc";  // Orden ascendente o descendente
  limit: string;          // Cantidad de elementos por página
}>;

export default async function Page(props: { searchParams: Promise<TableSearchParams> }) {
  const searchParams = await props.searchParams;
  // Leer el parámetro "limit" y asignar un valor por defecto de 10 si no existe
  const itemsPerPage = searchParams.limit ? Number(searchParams.limit) : 10;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const search = searchParams.search ?? null;

  // Parámetros de ordenamiento
  const sortField = searchParams.sort ?? "name";
  const sortOrder = searchParams.order ?? "asc";
  const skip = (page - 1) * itemsPerPage;

  // Mapeo de los parámetros de orden
  const sortMapping: { [key: string]: any } = {
    id: { id: sortOrder },
    name: { name: sortOrder },
    role: { role: sortOrder },
  };

  const orderBy = sortMapping[sortField] || { name: "asc" };

  // Filtro para la búsqueda en el campo 'role'
  const validRoles: Role[] = ['SIMPLE', 'ADVANCED', 'ADMIN'];
  const roleFilter = search && validRoles.includes(search.toUpperCase() as Role)
    ? { equals: search.toUpperCase() as Role }
    : undefined;

  // Filtro WHERE para búsqueda en 'name' y 'role' (si existe)
  const whereFilter = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          ...(roleFilter ? [{ role: roleFilter }] : []),
        ],
      }
    : undefined;

  // Contar usuarios según el filtro
  const userCount = await prisma.user.count({
    where: whereFilter,
  });

  // Obtener los usuarios con paginación y ordenamiento
  const users = await prisma.user.findMany({
    orderBy,
    where: whereFilter,
    take: itemsPerPage,
    skip: skip,
  });

  const pageCount = Math.ceil(userCount / itemsPerPage);

  // Mapear los datos al tipo User
  const data = users.map((user) => ({
    id: user.id,
    name: user.name,
    role: user.role,
  }));

  return <UsersTable data={data} pageCount={pageCount} currentPage={page} />;
}
