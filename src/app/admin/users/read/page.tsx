import prisma from "@/libs/db";
import UsersTable from "./UsersTable";

type TableSearchParams = Partial<{
  page: string;
  search: string;
  sort: string;
  order: "asc" | "desc";
  limit: string;
}>;

export default async function Page({ searchParams }: { searchParams: TableSearchParams }) {
  const itemsPerPage = searchParams.limit ? Number(searchParams.limit) : 10;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const search = searchParams.search ?? null;

  const sortField = searchParams.sort ?? "name";
  const sortOrder = searchParams.order ?? "asc";
  const skip = (page - 1) * itemsPerPage;

  const orderBy = { [sortField]: sortOrder };

  const userCount = await prisma.user.count({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { role: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
  });

  const users = await prisma.user.findMany({
    orderBy,
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { role: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    take: itemsPerPage,
    skip: skip,
    select: { id: true, name: true, role: true },
  });

  const pageCount = Math.ceil(userCount / itemsPerPage);

  return <UsersTable data={users} pageCount={pageCount} currentPage={page} />;
}
