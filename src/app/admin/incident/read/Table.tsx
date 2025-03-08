"use client";

import { ArrowDownUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/debounce-hook";

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
  pageCount: number;
  currentPage: number;
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

const initialVisibleColumns = columns.reduce((acc, { key }) => {
  acc[key] = true;
  return acc;
}, {} as Record<string, boolean>);

export default function TablePage({ data, pageCount, currentPage }: TableProps) {
  const { updateQuery, pushQueryString, getQueryString } = useQueryString();
  const [visibleColumns, setVisibleColumns] = useState(initialVisibleColumns);
  const [filterOpen, setFilterOpen] = useState(false);

  // Usamos estado local para la data
  const [tableData, setTableData] = useState<Data[]>(data);

  // Actualizamos el estado local cada vez que la prop "data" cambie
  useEffect(() => {
    setTableData(data);
  }, [data]);

  // Estado para la búsqueda
  const [search, setSearch] = useState(getQueryString("search") ?? "");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    pushQueryString("search", debouncedSearch);
  }, [debouncedSearch, pushQueryString]);

  // Estado para el modal de eliminación
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: number | null }>({
    show: false,
    id: null,
  });

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const requestSort = (columnKey: keyof Data) => {
    const currentSort = getQueryString("sort");
    const currentOrder = getQueryString("order");
    const defaultOrder = columnKey === "numberOfPeople" ? "desc" : "asc";
    const newOrder =
      currentSort === columnKey.toString() && currentOrder === defaultOrder
        ? defaultOrder === "asc"
          ? "desc"
          : "asc"
        : defaultOrder;
    updateQuery({ sort: columnKey.toString(), order: newOrder });
  };

  const router = useRouter();

  const confirmDelete = async (id: number) => {
    const result = await handleDeleteIncidentAction(id);
    if (result.success) {
      console.log(`Incidencia con ID: ${id} eliminada`);
      // Actualizamos la data local filtrando la incidencia eliminada
      setTableData((prev) => prev.filter((row) => row.id !== id));
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
          <Link href="/admin/incident/create" passHref>
            <Button className="rounded border border-slate-700 bg-slate-800 px-4 py-1 text-slate-100 hover:bg-slate-950">
              Agregar Incidencia
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto overflow-y-auto rounded-lg border border-slate-300">
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
                        key === "id"
                          ? "w-[15px] min-w-[15px]"
                          : key === "numberOfPeople" || key === "amount"
                          ? "w-[150px] min-w-[150px]"
                          : "w-[150px]",
                        label === "2° subcat" && "whitespace-nowrap",
                        index === columns.length - 1 && "border-r-0"
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
                  )
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
            {tableData.map((row, rowIndex) => (
              <TableRow key={row.id} className={cx(rowIndex % 2 === 0 ? "bg-slate-100" : "bg-white")}>
                {columns.map(
                  ({ key }) =>
                    visibleColumns[key] && (
                      <TableCell
                        key={key}
                        className="w-[200px] max-w-[200px] truncate overflow-hidden whitespace-nowrap border-r-2 px-2 py-2 text-sm"
                        title={String(row[key])}
                      >
                        {row[key]}
                      </TableCell>
                    )
                )}
                <TableCell
                  className="sticky right-0 w-[100px] truncate px-3 py-1 text-sm"
                  style={{
                    boxShadow: `2px 0 0 ${rowIndex % 2 === 0 ? "white" : "#f1f5f9"} inset`,
                  }}
                >
                  <div className="flex items-center justify-start gap-2 px-1">
                    <Link href={`/admin/incident/edit/${row.id}`}>
                      <button className="flex w-full items-center justify-center">
                        <FaRegEdit className="text-lg transition-transform hover:scale-110" />
                      </button>
                    </Link>
                    <button
                      className="flex w-full items-center justify-center"
                      onClick={() => setDeleteModal({ show: true, id: row.id })}
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
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i + 1}
              className={`border border-gray-400 px-2 py-0 shadow-md ${
                currentPage === i + 1
                  ? "border-slate-950 bg-slate-600 text-white"
                  : "bg-white text-gray-700"
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
