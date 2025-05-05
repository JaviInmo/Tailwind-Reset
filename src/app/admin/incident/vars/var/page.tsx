import prisma from "@/libs/db";

import {
    GenericTableContent,
    GenericTableFooter,
    GenericTableHeader,
    GenericTableRoot,
} from "@/components/generic/generic-table";
import {  VarActions } from "./actions";
import {
    GenericTablePageSize,
    GenericTablePagination,
    GenericTableSearch,
    GenericTableVisibility,
} from "@/components/generic/generic-table-filters";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type TableSearchParams = Partial<{
    page: string;
    search: string;
    sort: string; // En este ejemplo se ordena sólo por "name"
    order: "asc" | "desc";
    limit: string;
}>;

export default async function Page(props: { searchParams: Promise<TableSearchParams> }) {
    const searchParams = await props.searchParams;
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
        where:
            search ?
                {
                    name: { contains: search, mode: "insensitive" },
                }
            :   undefined,
    });

    const variables = await prisma.variable.findMany({
        orderBy,
        select: { id: true, name: true },
        take: itemsPerPage,
        skip: skip,
        where:
            search ?
                {
                    name: { contains: search, mode: "insensitive" },
                }
            :   undefined,
    });

    const pageCount = Math.ceil(variableCount / itemsPerPage);

    const columns = { id: "Id", name: "Nombre" };

    // Mapear los datos al tipo variable
    const data = variables.map((variable) => ({
        id: variable.id.toString(),
        name: variable.name,
    }));

    const defaultHiddenColumns: (keyof typeof columns)[] = ["id"];

    return (
        /*  <VariablesTable
      data={variables}
      pageCount={pageCount}
      currentPage={page}
    /> */

        <GenericTableRoot>
            <GenericTableHeader title="Tabla de Variables">
                <GenericTableSearch />
                <Link href="/admin/users/create">
                    <Button variant={"immo"}>Agregar Usuario</Button>
                </Link>
            </GenericTableHeader>
            <GenericTableContent
                data={data}
                columns={columns}
                defaultHiddenColumns={defaultHiddenColumns}
                extraColumns={[
                    {
                        head: "Actions",
                        cell: <VarActions />,
                    },
                ]}
            />
            <GenericTableFooter>
                <GenericTablePageSize />
                <GenericTablePagination pageCount={pageCount} />
            </GenericTableFooter>
        </GenericTableRoot>
    );
}
