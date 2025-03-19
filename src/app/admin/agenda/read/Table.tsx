"use client";

import { ArrowDownUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DeleteModal from "@/app/admin/agenda/delete/page"; // Ajusta la ruta si es necesario
import { handleDeleteContactAction } from "@/app/admin/agenda/delete/delete.action"; // Ajusta la acción de borrado
import ColumnVisibilityFilter from "@/app/admin/agenda/read/ColumnVisibilityFilter.tsx";
import { CiSearch } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin7Line } from "react-icons/ri";
import { cx } from "@/util/cx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/debounce-hook";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function useQueryString() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    function updateQuery(newParams: Record<string, string>) {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === "") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        const newUrl = pathname + "?" + params.toString();
        router.push(newUrl);
    }

    function pushQueryString(name: string, value: string) {
        updateQuery({ [name]: value });
    }

    function getQueryString(name: string) {
        return searchParams.get(name);
    }

    return { updateQuery, pushQueryString, getQueryString };
}

interface Contact {
    id: number;
    name: string;
    province: string;
    municipality: string;
    personalPhone: string;
    statePhone: string;
    landlinePhone: string;
    jobTitle: string;
    workplace: string;
}

interface TableProps {
    data: Contact[];
    pageCount: number;
    currentPage: number;
}

const columns: { label: string; key: keyof Contact }[] = [
    { label: "Id", key: "id" },
    { label: "Nombre", key: "name" },
    { label: "Provincia", key: "province" },
    { label: "Municipio", key: "municipality" },
    { label: "Tel. Personal", key: "personalPhone" },
    { label: "Tel. Estatal", key: "statePhone" },
    { label: "Tel. Fijo", key: "landlinePhone" },
    { label: "Cargo", key: "jobTitle" },
    { label: "Lugar de trabajo", key: "workplace" },
];

const initialVisibleColumns = columns.reduce(
    (acc, { key }) => {
        acc[key] = true;
        return acc;
    },
    {} as Record<string, boolean>,
);

export default function ContactsTable({ data, pageCount, currentPage }: TableProps) {
    const { updateQuery, pushQueryString, getQueryString } = useQueryString();
    const [visibleColumns, setVisibleColumns] = useState(initialVisibleColumns);
    const [filterOpen, setFilterOpen] = useState(false);

    // Estado para la búsqueda con debounce
    const [search, setSearch] = useState(getQueryString("search") ?? "");
    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        pushQueryString("search", debouncedSearch);
    }, [debouncedSearch, pushQueryString]);

    // Estado para mantener los IDs de los contactos que se muestran
    const [contactIds, setContactIds] = useState<number[]>(data.map((item) => item.id));

    const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: number | null }>({
        show: false,
        id: null,
    });

    const toggleColumnVisibility = (key: string) => {
        setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const requestSort = (columnKey: keyof Contact) => {
        const currentSort = getQueryString("sort");
        const currentOrder = getQueryString("order");
        const defaultOrder = "asc"; // Puedes ajustar el orden por defecto según cada columna si es necesario
        const newOrder =
            currentSort === columnKey.toString() && currentOrder === defaultOrder ?
                defaultOrder === "asc" ?
                    "desc"
                :   "asc"
            :   defaultOrder;
        updateQuery({ sort: columnKey.toString(), order: newOrder });
    };

    const confirmDelete = async (id: number) => {
        // Se envía la lista actual de IDs (como string separado por comas)
        const result = await handleDeleteContactAction(id, contactIds.join(","));
        if (result.success) {
            console.log(`Contacto con ID: ${id} eliminado`);
            // Actualiza el estado eliminando el id borrado y actualiza la query string
            setContactIds((prev) => {
                const updated = prev.filter((itemId) => itemId !== id);
                pushQueryString("ids", updated.join(","));
                return updated;
            });
        } else {
            console.error(`Error al eliminar el contacto con ID: ${id}`, result.error);
        }
        setDeleteModal({ show: false, id: null });
    };

    return (
        <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Tabla de Contactos</h3>
                <div className="relative flex items-center gap-4">
                    <CiSearch className="absolute left-3 text-gray-500" size={20} />
                    <Input
                        type="text"
                        placeholder="Buscar..."
                        className="input input-bordered input-primary rounded border border-slate-400 py-1 pl-10 text-left"
                        onChange={(event) => setSearch(event.target.value)}
                        value={search}
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
                    <Link href="/admin/agenda/create" passHref>
                        <Button className="rounded border border-slate-700 bg-slate-800 px-4 py-1 text-slate-100 hover:bg-slate-950">
                            Agregar Contacto
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
                                            key={label}
                                            className={cx(
                                                "border-r-2 p-2.5 text-sm font-semibold text-slate-800",
                                                "w-[150px]",
                                                key === "id" ? "w-[15px] min-w-[15px]" : "w-[60px]",
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
                        {data
                            // Filtramos según los IDs actuales
                            .filter((row) => contactIds.includes(row.id))
                            .map((row, rowIndex) => (
                                <TableRow
                                    key={row.id}
                                    className={cx(rowIndex % 2 === 0 ? "bg-slate-100" : "bg-white")}
                                >
                                    {columns.map(
                                        ({ key }) =>
                                            visibleColumns[key] && (
                                                <TableCell
                                                    key={key}
                                                    className={cx(
                                                        key === "id" ? "w-[15px] min-w-[15px]" : (
                                                            "w-[200px] max-w-[200px]"
                                                        ),
                                                        "overflow-hidden truncate whitespace-nowrap border-r-2 px-2 py-2 text-sm",
                                                    )}
                                                    title={String(
                                                        key === "id" ? rowIndex + 1 : row[key],
                                                    )}
                                                >
                                                    {key === "id" ? rowIndex + 1 : row[key]}
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
                                            <Link href={`/admin/agenda/edit/${row.id}`}>
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
                                                <RiDeleteBin7Line className="text-lg transition-transform hover:scale-110" />
                                            </button>
                                            <Link href={`/admin/contact/view/${row.id}`}>
                                                <button className="flex w-full items-center justify-center">
                                                    {/* Aquí podrías agregar otro icono o acción si lo requieres */}
                                                </button>
                                            </Link>
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
                            <SelectValue placeholder="Selecciona" />
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
