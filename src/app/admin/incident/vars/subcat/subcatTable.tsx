"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { RiDeleteBin7Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa"; // Icono para editar
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
import DeleteModal from "@/app/admin/incident/vars/subcat/delete/page";
import { handleDeleteSubCategoryAction } from "@/app/admin/incident/vars/subcat/delete/delete.action";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SubCatForm } from "./create/subcat-form";

interface Data {
    id: number;
    name: string;
    categoria: string;
    categoriaId: number; // Campo adicional para disponer del id de la categoría
}

interface TableProps {
    data: Data[];
}

export default function TablePage({ data }: TableProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [sortColumn, setSortColumn] = useState<keyof Data | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: number | null }>({
        show: false,
        id: null,
    });

    // Estado para el modal de edición y la subcategoría seleccionada
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSubcat, setSelectedSubcat] = useState<Data | null>(null);

    const filteredData = useMemo(
        () =>
            data.filter((row) =>
                Object.values(row).some((value) =>
                    String(value).toLowerCase().includes(search.toLowerCase())
                )
            ),
        [data, search]
    );

    const sortedData = useMemo(() => {
        if (!sortColumn) return filteredData;
        return filteredData.sort((a, b) => {
            if (a[sortColumn]! < b[sortColumn]!) return sortDirection === "asc" ? -1 : 1;
            if (a[sortColumn]! > b[sortColumn]!) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortColumn, sortDirection]);

    const lastItem = currentPage * itemsPerPage;
    const firstItem = lastItem - itemsPerPage;
    const currentItems = sortedData.slice(firstItem, lastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const requestSort = (column: keyof Data) => {
        const direction = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
        setSortColumn(column);
        setSortDirection(direction);
    };

    const handleDelete = (id: number) => setDeleteModal({ show: true, id });
    const confirmDelete = async (id: number) => {
        await handleDeleteSubCategoryAction(id);
        setDeleteModal({ show: false, id: null });
    };

    const handleEdit = (subcat: Data) => {
        setSelectedSubcat(subcat);
        setShowEditModal(true);
    };

    return (
        <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Tabla de Subcategorías</h3>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Buscar..."
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-56"
                    />
                    <Button
                        className="bg-slate-800 text-white"
                        onClick={() => setShowCreateModal(true)} // Muestra el modal de creación
                    >
                        Agregar Nueva
                    </Button>
                </div>
            </div>

            {/* Tabla */}
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto rounded-lg border border-slate-300 sm:max-h-[calc(80vh)] md:max-h-[500px]">
                <Table>
                    <TableHeader className="sticky top-0 z-10 bg-white shadow-md">
                        <TableRow>
                            {["id", "name", "categoria", "acciones"].map((column) => (
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
                                <TableCell>{firstItem + index + 1}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.categoria}</TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-start gap-2">
                                    
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(row.id)}
                                            className="flex items-center gap-1"
                                        >
                                            <RiDeleteBin7Line size={14} />
                                            Eliminar
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => handleEdit(row)}
                                            className="flex items-center gap-1 bg-green-700 text-white hover:bg-green-800"
                                        >
                                            <FaRegEdit size={14} />
                                            Editar
                                        </Button>
                                    </div>
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
                            <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
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
                            <PaginationNext onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            {/* Modal de creación */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent>
                    <SubCatForm categoryId={0} />
                </DialogContent>
            </Dialog>

            {/* Modal de edición */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent>
                    {selectedSubcat && (
                        <SubCatForm
                            subcategoryData={{
                                id: selectedSubcat.id,
                                name: selectedSubcat.name,
                                variableId: 0, // Ajusta este valor según corresponda
                            }}
                            categoryId={selectedSubcat.categoriaId}
                            onSuccess={() => setShowEditModal(false)}
                        />
                    )}
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
