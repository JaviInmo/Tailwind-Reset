"use client";

import { ArrowDownUp } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import DeleteModal from "@/app/admin/incident/delete/page";
import { handleDeleteIncidentAction } from "@/app/admin/incident/delete/delete.action";
import ColumnVisibilityFilter from "@/app/admin/incident/read/ColumnVisibilityFilter.tsx";
import { CiSearch } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin7Line } from "react-icons/ri";
import { cx } from "@/util/cx";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Data {
    id: number;
    variable: string;
    categoria: string;
    subcategoria: string;
    segundasubcategoria: string;
    amount: number;
    numberOfPeople: number;
    descripcion: string;
    provincia: string;
    municipio: string;
    fecha: string;
}

interface TableProps {
    data: Data[];
}

const columns: { label: string; key: keyof Data }[] = [
    { label: "Id", key: "id" },
    { label: "Var", key: "variable" },
    { label: "Cat", key: "categoria" },
    { label: "Subcat", key: "subcategoria" },
    { label: "2° subcat", key: "segundasubcategoria" },
    { label: "Cant.", key: "amount" },
    { label: "No. Personas", key: "numberOfPeople" },
    { label: "Desc.", key: "descripcion" },
    { label: "Prov.", key: "provincia" },
    { label: "Munic.", key: "municipio" },
    { label: "Fecha", key: "fecha" },
];

const initialVisibleColumns = columns.reduce(
    (acc, { key }) => {
        acc[key] = true;
        return acc;
    },
    {} as Record<string, boolean>,
);

export default function TablePage({ data }: TableProps) {
    const [visibleColumns, setVisibleColumns] = useState(initialVisibleColumns);
    const [filterOpen, setFilterOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [sortColumn, setSortColumn] = useState<keyof Data | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: number | null }>({
        show: false,
        id: null,
    });

    const toggleColumnVisibility = (key: string) => {
        setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const filteredData = useMemo(
        () =>
            data.filter((row) =>
                Object.values(row).some((value) =>
                    String(value).toLowerCase().includes(search.toLowerCase()),
                ),
            ),
        [data, search],
    );

    const sortedData = useMemo(() => {
        if (sortColumn === null) return filteredData;
        return filteredData.slice().sort((a, b) => {
            if (a[sortColumn] < b[sortColumn]) {
                return sortDirection === "asc" ? -1 : 1;
            }
            if (a[sortColumn] > b[sortColumn]) {
                return sortDirection === "asc" ? 1 : -1;
            }
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

    const handleDelete = (id: number) => {
        setDeleteModal({ show: true, id });
    };

    const confirmDelete = async (id: number) => {
        const result = await handleDeleteIncidentAction(id);
        if (result.success) {
            console.log(`Incidencia con ID: ${id} eliminada`);
        } else {
            console.error(`Error al eliminar la incidencia con ID: ${id}`, result.error);
        }
        setDeleteModal({ show: false, id: null });
    };

    return (
        <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Tabla de Incidencias</h3>
                <div className="relative flex items-center gap-4">
                    <CiSearch className="absolute left-3 text-gray-500" size={20} />
                    <Input
                        type="text"
                        placeholder="Buscar..."
                        className="input input-bordered input-primary rounded border border-slate-400 py-1 pl-10 text-left"
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <div className="relative">
                        <Button
                            className="relative rounded border border-slate-700 bg-slate-800 px-4 py-1 text-slate-100 hover:bg-slate-950"
                            onClick={() => setFilterOpen(!filterOpen)}
                        >
                            Filtro
                        </Button>
                        {filterOpen && (
                            <div className="absolute left-0 z-50 mt-2">
                                <ColumnVisibilityFilter
                                    columns={columns}
                                    visibleColumns={visibleColumns}
                                    toggleColumnVisibility={toggleColumnVisibility}
                                />
                            </div>
                        )}
                    </div>
                    <Link href="/admin/incident/create" passHref>
                        <Button className="rounded border border-slate-700 bg-slate-800 px-4 py-1 text-slate-100 hover:bg-slate-950">
                            Agregar Incidencia
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="relative max-h-[calc(100vh-200px)] max-w-[calc(100vw-120px)] overflow-x-auto overflow-y-auto rounded-lg border border-slate-300 sm:max-h-[calc(80vh)] md:max-h-[500px]">
               
                <Table className="min-w-[2200px]">
                    <TableHeader className="sticky top-0 z-10 bg-white shadow-md">
                        <TableRow>
                            {columns.map(
                                ({ label, key }, index) =>
                                    visibleColumns[key] && (
                                        <TableHead
                                            key={label}
                                            className={cx(
                                                "border-r-2 p-2.5 text-sm font-semibold text-slate-800",
                                                "w-[200px]", 
                                                label === "2° subcat" && "whitespace-nowrap",
                                                index === columns.length - 1 && "border-r-0",
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                {label}
                                                <ArrowDownUp
                                                    size={12}
                                                    className="ml-2 cursor-pointer text-slate-800 transition-transform hover:scale-125"
                                                    onClick={() => requestSort(key)}
                                                />
                                            </div>
                                        </TableHead>
                                    ),
                            )}
                            <TableHead
                                className="sticky right-0 bg-white p-2.5 text-sm font-semibold text-slate-800"
                                style={{ boxShadow: "2px 0 0 #f1f5f9 inset" }}
                            >
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-slate-700">
                        {currentItems.map((row, rowIndex) => (
                            <TableRow
                                key={row.id}
                                className={cx(
                                  
                                    rowIndex % 2 === 0 ? "bg-slate-100" : "bg-white",
                                )}
                            >
                                {columns.map(
                                    ({ key }, index) =>
                                        visibleColumns[key] && (
                                            <TableCell
                                                key={key}
                                                className={cx(
                                                    "w-[200px] truncate border-r-2 px-2 py-2 text-sm",
                                                    rowIndex % 2 === 0 ?
                                                        "border-white"
                                                    :   "border-slate-100",
                                                )}
                                            >
                                                {key === "id" ? firstItem + rowIndex + 1 : row[key]}
                                            </TableCell>
                                        ),
                                )}
                                <TableCell
                                    className={cx(
                                        "sticky right-0 w-[200px] truncate p-3 text-sm",
                                        rowIndex % 2 === 0 ? "bg-slate-100" : "bg-white",
                                    )}
                                    style={{
                                        boxShadow: `2px 0 0 ${rowIndex % 2 === 0 ? "white" : "#f1f5f9"} inset`,
                                    }}
                                >
                                    <div className="flex items-center justify-start gap-2">
                                        <Link href={`/admin/incident/edit/${row.id}`}>
                                            <button className="flex w-full items-center justify-center">
                                                <FaRegEdit className="text-lg transition-transform hover:scale-110" />
                                            </button>
                                        </Link>
                                        <button
                                            className="flex w-full items-center justify-center"
                                            onClick={() => handleDelete(row.id)}
                                        >
                                            <RiDeleteBin7Line className="text-lg transition-transform hover:scale-110" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-end">
                <div className="btn-group gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i + 1}
                            className={`border border-gray-400 px-2 py-0 shadow-md ${
                                currentPage === i + 1 ?
                                    "border-slate-950 bg-slate-600 text-white"
                                :   "bg-white text-gray-700"
                            }`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
            {deleteModal.show && deleteModal.id !== null && (
                <DeleteModal
                    id={deleteModal.id}
                    show={deleteModal.show}
                    onCancel={() => setDeleteModal({ show: false, id: null })}
                    onConfirm={async () => {
                        if (deleteModal.id) await confirmDelete(deleteModal.id);
                    }}
                />
            )}
        </div>
    );
}
