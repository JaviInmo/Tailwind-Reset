"use client";

import { SetStateAction, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownUp } from "lucide-react";
import { RiDeleteBin7Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from "@/components/ui/pagination";
import DeleteModal from "@/app/admin/incident/vars/cat/delete/page";
import { handleDeleteCategoryAction } from "./delete/delete.action";

interface Data {
    id: number;
    name: string;
    variable: string;
}

interface TableProps {
    data: Data[];
}

export default function TablePage({ data }: TableProps) {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [sortColumn, setSortColumn] = useState<keyof Data | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: number | null }>({
        show: false,
        id: null,
    });

    // Filtrado
    const filteredData = useMemo(
        () =>
            data.filter((row) =>
                Object.values(row).some((value) =>
                    String(value).toLowerCase().includes(search.toLowerCase()),
                ),
            ),
        [data, search],
    );

    // Ordenamiento
    const sortedData = useMemo(() => {
        if (sortColumn === null) return filteredData;
        return filteredData.slice().sort((a, b) => {
            if (a[sortColumn]! < b[sortColumn]!) return sortDirection === "asc" ? -1 : 1;
            if (a[sortColumn]! > b[sortColumn]!) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortColumn, sortDirection]);

    // Paginación
    const lastItem = currentPage * itemsPerPage;
    const firstItem = lastItem - itemsPerPage;
    const currentItems = sortedData.slice(firstItem, lastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Ordenar columna
    const requestSort = (columnKey: keyof Data) => {
        const direction = sortColumn === columnKey && sortDirection === "asc" ? "desc" : "asc";
        setSortColumn(columnKey);
        setSortDirection(direction);
    };

    const handleDelete = (id: number) => setDeleteModal({ show: true, id });

    const confirmDelete = async (id: number) => {
        await handleDeleteCategoryAction(id);
        setDeleteModal({ show: false, id: null });
    };

    return (
        <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Tabla de Categorías</h3>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Buscar..."
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-56"
                    />
                    <Link href="/admin/incident/vars/cat/create">
                        <Button className="bg-slate-800 text-white">Agregar Nueva</Button>
                    </Link>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {["id", "name", "variable", "acciones"].map((column) => (
                                <TableHead key={column} className="text-slate-700">
                                    <div className="flex items-center justify-between">
                                        {column.charAt(0).toUpperCase() + column.slice(1)}
                                        {column !== "acciones" && (
                                            <ArrowDownUp
                                                size={16}
                                                className="cursor-pointer"
                                                onClick={() => requestSort(column as keyof Data)}
                                            />
                                        )}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.variable}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(row.id)}
                                        className="flex items-center gap-1"
                                    >
                                        <RiDeleteBin7Line size={14} />
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Paginación */}
            <div className="flex justify-end">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    isActive={currentPage === index + 1}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() =>
                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            {/* Modal de eliminación */}
            {deleteModal.show && deleteModal.id !== null && (
                <DeleteModal
                    id={deleteModal.id}
                    onCancel={() => setDeleteModal({ show: false, id: null })}
                    onConfirm={() => confirmDelete(deleteModal.id as number)}
                />
            )}
        </div>
    );
}
