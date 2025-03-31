"use client";

import { ArrowDownUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DeleteModal from "@/app/admin/user/delete/page"; // Ajusta la ruta según corresponda
import { handleDeleteUserAction } from "@/app/admin/user/delete/delete.action"; // Ajusta la acción de borrado
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

interface User {
  id: string;
  name: string;
  role: string;
}

interface TableProps {
  data: User[];
  pageCount: number;
  currentPage: number;
}

const columns: { label: string; key: "index" | keyof User }[] = [
  { label: "Id", key: "index" }, // Mostrará el número consecutivo (índice + 1)
  { label: "Nombre", key: "name" },
  { label: "Rol", key: "role" },
];

export default function UsersTable({ data, pageCount, currentPage }: TableProps) {
  const { updateQuery, pushQueryString, getQueryString } = useQueryString();
  const [search, setSearch] = useState(getQueryString("search") ?? "");
  const debouncedSearch = useDebounce(search, 300);

  // Estado para el modal de eliminación
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: string | null }>({
    show: false,
    id: null,
  });

  const requestSort = (columnKey: "index" | keyof User) => {
    // Se implementa la lógica de ordenamiento para los campos (no para el índice)
    if (columnKey === "index") return;
    const currentSort = getQueryString("sort");
    const currentOrder = getQueryString("order");
    const defaultOrder = "asc";
    const newOrder =
      currentSort === columnKey && currentOrder === defaultOrder ? "desc" : defaultOrder;
    updateQuery({ sort: columnKey, order: newOrder });
  };

  const confirmDelete = async (id: string) => {
    const result = await handleDeleteUserAction(id);
    if (result.success) {
      console.log(`Usuario con ID: ${id} eliminado`);
      // Aquí podrías actualizar el estado o forzar un re-fetch
    } else {
      console.error(`Error al eliminar el usuario con ID: ${id}`, result.error);
    }
    setDeleteModal({ show: false, id: null });
  };

  // Actualizar la query para búsqueda (si se usa en el backend)
  // Se ejecuta cuando debouncedSearch cambia
  // useEffect(() => { pushQueryString("search", debouncedSearch); }, [debouncedSearch, pushQueryString]);

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Tabla de Usuarios</h3>
        <div className="relative flex items-center gap-4">
          <CiSearch className="absolute left-3 text-gray-500" size={20} />
          <Input
            type="text"
            placeholder="Buscar..."
            className="input input-bordered input-primary rounded border border-slate-400 py-1 pl-10 text-left"
            onChange={(event) => setSearch(event.target.value)}
            value={search}
          />
          <Link href="/admin/user/create" passHref>
            <Button className="rounded border border-slate-700 bg-slate-800 px-4 py-1 text-slate-100 hover:bg-slate-950">
              Agregar Usuario
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative max-h-[calc(100vh-200px)] w-full overflow-x-auto overflow-y-auto rounded-lg border border-slate-300">
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-10 bg-white shadow-md">
            <TableRow>
              {columns.map(({ label, key }, index) => (
                <TableHead
                  key={label}
                  className={cx(
                    "border-r-2 p-2.5 text-sm font-semibold text-slate-800",
                    index === columns.length - 1 && "border-r-0"
                  )}
                >
                  <div className="flex items-center justify-between">
                    {label}
                    {key !== "index" && (
                      <ArrowDownUp
                        size={12}
                        className="ml-2 cursor-pointer text-slate-800 transition-transform hover:scale-125"
                        onClick={() => requestSort(key)}
                      />
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead
                className="sticky right-0 w-[60px] bg-white p-2.5 text-sm font-semibold text-slate-800"
                style={{ boxShadow: "2px 0 0 #f1f5f9 inset" }}
              >
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-slate-700">
            {data.map((row, rowIndex) => (
              <TableRow
                key={row.id}
                className={cx(rowIndex % 2 === 0 ? "bg-slate-100" : "bg-white")}
              >
                {columns.map(({ key }) => {
                  let cellContent;
                  if (key === "index") {
                    cellContent = rowIndex + 1;
                  } else {
                    cellContent = row[key as keyof User];
                  }
                  return (
                    <TableCell
                      key={key}
                      className={cx(
                        "overflow-hidden truncate whitespace-nowrap border-r-2 px-2 py-2 text-sm"
                      )}
                      title={String(cellContent)}
                    >
                      {cellContent}
                    </TableCell>
                  );
                })}
                <TableCell
                  className="sticky right-0 w-[100px] truncate bg-white px-3 py-1 text-sm"
                  style={{
                    boxShadow: `2px 0 0 ${rowIndex % 2 === 0 ? "white" : "#f1f5f9"} inset`,
                  }}
                >
                  <div className="flex items-center justify-start gap-2 px-1">
                    <Link href={`/admin/user/edit/${row.id}`}>
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
                currentPage === i + 1
                  ? "rounded-sm border-slate-950 bg-slate-800 text-white"
                  : "rounded bg-white text-gray-700"
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
