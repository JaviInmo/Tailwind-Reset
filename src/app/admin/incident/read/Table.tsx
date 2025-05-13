"use client"

import { ArrowDownUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import DeleteModal from "@/app/admin/incident/delete/page"
import { handleDeleteIncidentAction } from "@/app/admin/incident/delete/delete.action"
import ColumnVisibilityFilter from "@/app/admin/incident/read/ColumnVisibilityFilter.tsx"
import { CiSearch } from "react-icons/ci"
import { FaRegEdit } from "react-icons/fa"
import { RiDeleteBin7Line } from "react-icons/ri"
import { cx } from "@/util/cx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/hooks/debounce-hook"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GrStatusInfo } from "react-icons/gr"

function useQueryString() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  function updateQuery(newParams: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    const newUrl = pathname + "?" + params.toString()
    router.push(newUrl)
  }

  function pushQueryString(name: string, value: string) {
    updateQuery({ [name]: value })
  }

  function getQueryString(name: string) {
    return searchParams.get(name)
  }

  return { updateQuery, pushQueryString, getQueryString }
}

interface Data {
  id: number
  variable: string
  categoria: string
  subcategoria: string
  segundasubcategoria: string
  amount: number
  numberOfPeople: number
  descripcion: string
  provincia: string
  municipio: string
  fecha: string
  titulo: string
}

interface TableProps {
  data: Data[]
  pageCount: number
  currentPage: number
}

const columns: { label: string; key: keyof Data }[] = [
  { label: "Id", key: "id" },
  { label: "Var", key: "variable" },
  { label: "Cat", key: "categoria" },
  { label: "Subcat", key: "subcategoria" },
  { label: "2° subcat", key: "segundasubcategoria" },
  { label: "Cant.", key: "amount" },
  { label: "Pers", key: "numberOfPeople" },
  { label: "Titulo", key: "titulo" },
  { label: "Prov.", key: "provincia" },
  { label: "Munic.", key: "municipio" },
  { label: "Fecha", key: "fecha" },
]

const initialVisibleColumns = columns.reduce(
  (acc, { key }) => {
    acc[key] = true
    return acc
  },
  {} as Record<string, boolean>,
)

export default function TablePage({ data, pageCount, currentPage }: TableProps) {
  const { updateQuery, pushQueryString, getQueryString } = useQueryString()
  const [visibleColumns, setVisibleColumns] = useState(initialVisibleColumns)
  const [filterOpen, setFilterOpen] = useState(false)

  // Estado para la búsqueda (con debounce)
  const [search, setSearch] = useState(getQueryString("search") ?? "")
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    pushQueryString("search", debouncedSearch)
  }, [debouncedSearch, pushQueryString])

  // Estado para mantener los IDs de las incidencias mostradas
  const [incidentIds, setIncidentIds] = useState<number[]>(data.map((item) => item.id))

  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: number | null }>({
    show: false,
    id: null,
  })

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const requestSort = (columnKey: keyof Data) => {
    const currentSort = getQueryString("sort")
    const currentOrder = getQueryString("order")
    const defaultOrder = columnKey === "numberOfPeople" ? "desc" : "asc"
    const newOrder =
      currentSort === columnKey.toString() && currentOrder === defaultOrder
        ? defaultOrder === "asc"
          ? "desc"
          : "asc"
        : defaultOrder
    updateQuery({ sort: columnKey.toString(), order: newOrder })
  }

  const confirmDelete = async (id: number) => {
    // Se pasa el listado actual de IDs (como string separado por comas)
    const result = await handleDeleteIncidentAction(id, incidentIds.join(","))
    if (result.success) {
      console.log(`Incidencia con ID: ${id} eliminada`)
      // Actualiza el estado eliminando el id borrado y actualiza la query string con el nuevo listado
      setIncidentIds((prev) => {
        const updated = prev.filter((itemId) => itemId !== id)
        pushQueryString("ids", updated.join(","))
        return updated
      })
    } else {
      console.error(`Error al eliminar la incidencia con ID: ${id}`, result.error)
    }
    setDeleteModal({ show: false, id: null })
  }

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
                        key === "id"
                          ? "w-[15px] min-w-[15px]"
                          : key === "numberOfPeople" || key === "amount"
                            ? "w-[60px] min-w-[60px]"
                            : "w-[60px]",
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
                className="sticky right-0 w-[60px] bg-white p-2.5 text-sm font-semibold text-slate-800"
                style={{ boxShadow: "2px 0 0 #f1f5f9 inset" }}
              >
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-slate-700">
            {data
              // Filtramos según el estado incidentIds
              .filter((row) => incidentIds.includes(row.id))
              .map((row, rowIndex) => (
                <TableRow key={row.id} className={cx(rowIndex % 2 === 0 ? "bg-slate-100" : "bg-white")}>
                  {columns.map(
                    ({ key }) =>
                      visibleColumns[key] && (
                        <TableCell
                          key={key}
                          className="w-[200px] max-w-[200px] overflow-hidden truncate whitespace-nowrap border-r-2 px-2 py-2 text-sm"
                          title={String(key === "id" ? rowIndex + 1 : row[key])}
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
                      <Link href={`/admin/incident/view/${row.id}`}>
                        <button className="flex w-full items-center justify-center">
                          <GrStatusInfo className="text-lg transition-transform hover:scale-110" />
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
          <Select value={getQueryString("limit") || "10"} onValueChange={(value) => pushQueryString("limit", value)}>
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
            if (deleteModal.id) await confirmDelete(deleteModal.id)
          }}
        />
      )}
    </div>
  )
}
