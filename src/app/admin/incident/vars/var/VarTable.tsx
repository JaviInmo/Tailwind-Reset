"use client";

import { useMemo, useState } from "react";
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
import DeleteModal from "@/app/admin/incident/vars/var/delete/page";
import { handleDeleteVariableAction } from "@/app/admin/incident/vars/var/delete/delete.action";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VariableForm } from "./create/var-form";
import { cx } from "@/util/cx";

interface Data {
    id: number;
    name: string;
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
    const [showCreateModal, setShowCreateModal] = useState(false); // Estado para mostrar el modal del formulario
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: number | null }>({
        show: false,
        id: null,
    });

    const filteredData = useMemo(
        () =>
            data.filter((row) =>
                Object.values(row).some((value) =>
                    String(value).toLowerCase().includes(search.toLowerCase())
                )
            ),
        [data, search]
    );

  // Ordenamiento
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return filteredData.slice().sort((a, b) => {
        if (a[sortColumn]! < b[sortColumn]!) return sortDirection === "asc" ? -1 : 1;
        if (a[sortColumn]! > b[sortColumn]!) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });
}, [filteredData, sortColumn, sortDirection]);


    const lastItem = currentPage * itemsPerPage;
    const firstItem = lastItem - itemsPerPage;
    const currentItems = sortedData.slice(firstItem, lastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const requestSort = (columnKey: keyof Data) => {
        const direction = sortColumn === columnKey && sortDirection === "asc" ? "desc" : "asc";
        setSortColumn(columnKey);
        setSortDirection(direction);
    };

    const handleDelete = (id: number) => setDeleteModal({ show: true, id });

    const confirmDelete = async (id: number) => {
        await handleDeleteVariableAction(id);
        setDeleteModal({ show: false, id: null });
    };

    return (
        <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Tabla de Variables</h3>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Buscar..."
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-56"
                    />
                    <Button
                        className="bg-slate-800 text-white"
                        onClick={() => setShowCreateModal(true)} // Muestra el modal al hacer clic
                    >
                        Agregar Nueva
                    </Button>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-[calc(80vh)] md:max-h-[500px] border border-slate-300 rounded-lg">
                <Table>
                    <TableHeader className="sticky top-0 bg-white shadow-md z-10">
                        <TableRow>
                            {["id", "name", "acciones"].map((column) => (
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
                    {currentItems.map((row, index) => (
                            <TableRow key={row.id}>
                                {/* Número de fila basado en el índice y la página actual */}
            <TableCell>{firstItem + index + 1}</TableCell>
                                <TableCell>{row.name}</TableCell>
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

  {/* Modal de creación */}
  <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent>
                    
                    <VariableForm />
                    
                </DialogContent>
            </Dialog>


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
