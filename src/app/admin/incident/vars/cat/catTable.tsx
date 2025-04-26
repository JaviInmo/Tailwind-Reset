"use client";

import type React from "react";

import { ArrowDownUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
import { RiDeleteBin7Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { handleDeleteCategoryAction } from "./delete/delete.action";
import DeleteModal from "./delete/page";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Data {
    id: number;
    name: string;
    variable: string;
    variableId: number;
}

interface Column {
    key: keyof Data;
    label: string;
}

function ColumnVisibilityFilter({
    columns,
    visibleColumns,
    toggleColumnVisibility,
}: {
    columns: Column[];
    visibleColumns: Record<string, boolean>;
    toggleColumnVisibility: (key: string) => void;
}) {
    return (
        <div className="w-48 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
            <div className="mb-2 text-sm font-medium">Toggle Columns</div>
            {columns.map((column) => (
                <div key={column.key} className="flex items-center gap-2 py-1">
                    <input
                        type="checkbox"
                        id={`column-${column.key}`}
                        checked={visibleColumns[column.key]}
                        onChange={() => toggleColumnVisibility(column.key)}
                        className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={`column-${column.key}`} className="text-sm">
                        {column.label}
                    </label>
                </div>
            ))}
        </div>
    );
}

const cx = (...classNames: (string | boolean | undefined)[]) =>
    classNames.filter(Boolean).join(" ");

export default function TablePage({ data }: { data: Data[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const columns: Column[] = [
        { key: "id", label: "ID" },
        { key: "name", label: "Nombre" },
        { key: "variable", label: "Variable" },
    ];

    const [search, setSearch] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
        id: true,
        name: true,
        variable: true,
    });
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Data;
        direction: "ascending" | "descending";
    } | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: number | null }>({
        show: false,
        id: null,
    });

    // Get query params
    const getQueryString = (key: string): string | null => {
        return searchParams.get(key);
    };

    // Update query params
    const pushQueryString = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, value);
        router.push(`${pathname}?${params.toString()}`);
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    // Toggle column visibility
    const toggleColumnVisibility = (key: string) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // Handle sorting
    const requestSort = (key: keyof Data) => {
        let direction: "ascending" | "descending" = "ascending";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    // Sort data
    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
            return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
    });

    // Filter data by search term
    const filteredData = sortedData.filter((row) =>
        Object.entries(row).some(
            ([key, value]) =>
                visibleColumns[key] && String(value).toLowerCase().includes(search.toLowerCase()),
        ),
    );

    // Pagination
    const itemsPerPage = Number(getQueryString("limit") || "10");
    const currentPage = Number(getQueryString("page") || "1");
    const pageCount = Math.ceil(filteredData.length / itemsPerPage);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    // Delete category
    const confirmDelete = async (id: number) => {
        const result = await handleDeleteCategoryAction(id);
        if (result.success) {
            router.refresh();
        } else {
            console.error(`Error al eliminar la categoría con ID: ${id}`, result.error);
        }
        setDeleteModal({ show: false, id: null });
    };

    return (
        <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md ">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Tabla de Categorías</h3>
                <div className="relative flex items-center gap-4">
                    
                        <CiSearch className="absolute left-3 text-gray-500" size={20} />
                        <Input
                            type="text"
                            placeholder="Buscar..."
                            className="input input-bordered input-primary rounded border border-slate-400 py-1 pl-10 text-left"
                            onChange={handleSearchChange}
                            value={search}
                        />
                    
                    <div className="relative">
                        <Button
                            className="relative rounded border border-slate-700 bg-slate-800 px-4 py-1 text-slate-100 hover:bg-slate-950"
                            onClick={() => setFilterOpen(!filterOpen)}
                        >
                            Filtrar
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
                    <Link href="/admin/incident/vars/cat/create">
                        <Button className="rounded border border-slate-700 bg-slate-800 px-4 py-1 text-slate-100 hover:bg-slate-950">
                            Agregar Categoría
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="relative max-h-[calc(100vh-200px)] w-full overflow-x-auto overflow-y-auto rounded-lg border border-slate-300">
                <Table className="w-full">
                    <TableHeader className="sticky top-0 z-10 bg-white shadow-md">
                        <TableRow>
                            {columns.map(
                                ({ label, key }, index) =>
                                    visibleColumns[key] && (
                                        <TableHead
                                            key={key}
                                            className={cx(
                                                "border-r-2 p-2.5 text-sm font-semibold text-slate-800",
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
                                className="sticky right-0 w-[60px] bg-white p-2.5 text-sm font-semibold text-slate-800"
                                style={{ boxShadow: "2px 0 0 #f1f5f9 inset" }}
                            >
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-slate-700">
                        {paginatedData.map((row, rowIndex) => (
                            <TableRow
                                key={row.id}
                                className={cx(rowIndex % 2 === 0 ? "bg-slate-100" : "bg-white")}
                            >
                                {columns.map(
                                    ({ key }) =>
                                        visibleColumns[key] && (
                                            <TableCell
                                                key={key}
                                                className="overflow-hidden truncate whitespace-nowrap border-r-2 px-2 py-2 text-sm"
                                                title={String(row[key])}
                                            >
                                                {row[key]}
                                            </TableCell>
                                        ),
                                )}
                                <TableCell
                                    className="sticky right-0 w-[100px] truncate bg-white px-3 py-1 text-sm"
                                    style={{
                                        boxShadow: `2px 0 0 ${rowIndex % 2 === 0 ? "white" : "#f1f5f9"} inset`,
                                    }}
                                >
                                    <div className="flex items-center justify-start gap-2 px-1">
                                        <Link href={`/admin/incident/vars/cat/update/${row.id}`}>
                                            <button className="flex w-full items-center justify-center">
                                                <FaRegEdit className="text-lg transition-transform hover:scale-110" />
                                            </button>
                                        </Link>
                                        <button
                                            className="flex w-full items-center justify-center"
                                            onClick={() =>
                                                setDeleteModal({ show: true, id: row.id })
                                            }
                                        >
                                            <RiDeleteBin7Line className="text-lg text-red-500 transition-transform hover:scale-110" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <label htmlFor="itemsPerPage" className="text-sm font-medium text-slate-700">
                        Filas:
                    </label>
                    <Select
                        value={getQueryString("limit") || "10"}
                        onValueChange={(value) => pushQueryString("limit", value)}
                    >
                        <SelectTrigger className="h-6 w-[70px] px-2 py-0 shadow-md">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                            <SelectItem value="200">200</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex">
                    {Array.from({ length: pageCount }).map((_, i) => (
                        <button
                            key={i + 1}
                            className={`flex h-6 w-6 items-center justify-center border border-gray-400 px-2 py-0 shadow-md ${
                                currentPage === i + 1 ?
                                    "rounded-sm border-slate-950 bg-slate-800 text-white"
                                :   "rounded bg-white text-gray-700"
                            }`}
                            onClick={() => pushQueryString("page", `${i + 1}`)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            {deleteModal.show && deleteModal.id !== null && (
                <DeleteModal
                    id={deleteModal.id}
                    onCancel={() => setDeleteModal({ show: false, id: null })}
                    onConfirm={async () => {
                        if (deleteModal.id) await confirmDelete(deleteModal.id);
                    }}
                />
            )}
        </div>
    );
}
