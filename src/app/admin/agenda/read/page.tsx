import prisma from "@/libs/db";
import Table from "./Table";

type TableSearchParams = Partial<{
  page: string;
  search: string;
  sort: string;           // Campo por el que ordenar (ej: "name", "jobTitle", etc.)
  order: "asc" | "desc";  // Orden: ascendente o descendente
  limit: string;          // Cantidad de elementos por página
}>;

export default async function Page({ searchParams }: { searchParams: TableSearchParams }) {
  // Leer el parámetro "limit" y asignar un valor por defecto de 10 si no existe
  const itemsPerPage = searchParams.limit ? Number(searchParams.limit) : 10;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const search = searchParams.search ?? null;

  // Parámetros de ordenamiento
  const sortField = searchParams.sort ?? "name"; 
  const sortOrder = searchParams.order ?? "asc";
  const skip = (page - 1) * itemsPerPage;

  const sortMapping: { [key: string]: any } = {
    id: { id: sortOrder }, // opcional, si deseas permitir ordenar por id
    name: { name: sortOrder },
    province: { province: { name: sortOrder } },
    municipality: { municipality: { name: sortOrder } },
    personalPhone: { personalPhone: sortOrder },
    statePhone: { statePhone: sortOrder },
    landlinePhone: { landlinePhone: sortOrder },
    jobTitle: { jobTitle: sortOrder },
    workplace: { workplace: sortOrder },
  };
  

  const orderBy = sortMapping[sortField] || { name: "asc" };

  const contactCount = await prisma.contact.count({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { personalPhone: { contains: search, mode: "insensitive" } },
            { statePhone: { contains: search, mode: "insensitive" } },
            { landlinePhone: { contains: search, mode: "insensitive" } },
            { jobTitle: { contains: search, mode: "insensitive" } },
            { workplace: { contains: search, mode: "insensitive" } },
            { province: { name: { contains: search, mode: "insensitive" } } },
            { municipality: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
  });

  const contacts = await prisma.contact.findMany({
    orderBy,
    include: {
      province: { select: { name: true } },
      municipality: { select: { name: true } },
    },
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { personalPhone: { contains: search, mode: "insensitive" } },
            { statePhone: { contains: search, mode: "insensitive" } },
            { landlinePhone: { contains: search, mode: "insensitive" } },
            { jobTitle: { contains: search, mode: "insensitive" } },
            { workplace: { contains: search, mode: "insensitive" } },
            { province: { name: { contains: search, mode: "insensitive" } } },
            { municipality: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
    take: itemsPerPage,
    skip: skip,
  });

  const pageCount = Math.ceil(contactCount / itemsPerPage);

  const data = contacts.map(contact => ({
    ...contact,
    province: contact.province.name,
    municipality: contact.municipality.name,
  }));

  return <Table data={data} pageCount={pageCount} currentPage={page} />;
}
