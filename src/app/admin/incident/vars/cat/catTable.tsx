"use client"

import { ArrowDownUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import DeleteModal from "@/app/admin/incident/vars/cat/delete/page"
import { handleDeleteCategoryAction } from "./delete/delete.action"
import { cx } from "@/util/cx"
import { CiSearch } from "react-icons/ci"
import { FaRegEdit } from "react-icons/fa"
import { RiDeleteBin7Line } from "react-icons/ri"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/hooks/debounce-hook"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  name: string
  variable: string
  variableId: number
}

interface TableProps {
  data: Data[]
}

export default function TablePage({ data }: TableProps) {
  const { updateQuery, pushQueryString, getQueryString } = useQueryString()
  const router = useRouter()

  const [search, setSearch] = useState(getQueryString("search") ?? "")
  const debouncedSearch = useDebounce(search, 300)
  const [currentPage, setCurrentPage] = useState(Number(getQueryString("page") ?? "1"))
  const [categoryIds, setCategoryIds] = useState<number[]>(data.map((item) => item.id))
  const itemsPerPage = Number(getQueryString("limit") ?? "10")

  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: number | null }>({
    show: false,
    id: null,
  })

  useEffect(() => {
    pushQueryString("search", debouncedSearch)
  }, [debouncedSearch, pushQueryString])

  useEffect(() => {
    pushQueryString("page", currentPage.toString())
  }, [currentPage, pushQueryString])

  // Filter data based on search
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) => String(value).toLowerCase().includes(debouncedSearch.toLowerCase())),
  )

  // Sort data based on URL parameters
  const sortColumn = getQueryString("sort") as keyof Data | null
  const sortDirection = getQueryString("order") as "asc" | "desc" | null

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0
    if (a[sortColumn]! < b[sortColumn]!) return sortDirection === "asc" ? -1 : 1
    if (a[sortColumn]! > b[sortColumn]!) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Pagination
  const lastItem = currentPage * itemsPerPage
  const firstItem = lastItem - itemsPerPage
  const currentItems = sortedData.slice(firstItem, lastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const requestSort = (columnKey: keyof Data) => {
    const currentSort = getQueryString("sort")
    const currentOrder = getQueryString("order")

    const defaultOrder = "asc"
    const newOrder =
      currentSort === columnKey.toString() && currentOrder === defaultOrder
        ? defaultOrder === "asc"
          ? "desc"
          : "asc"
        : defaultOrder
    updateQuery({ sort: columnKey.toString(), order: newOrder })
  }

  const handleDelete = (id: number) => setDeleteModal({ show: true, id })

  const confirmDelete = async (id: number) => {
    const result = await handleDeleteCategoryAction(id)
    if (result.success) {
      console.log(`Categoría con ID: ${id} eliminada`)

      setCategoryIds((prev) => {
        const updated = prev.filter((itemId) => itemId !== id)
        return updated
      })

      // Add router refresh to update the data
      router.refresh()
    } else {
      console.error(`Error al eliminar la categoría con ID: ${id}`, result.error)
    }
    setDeleteModal({ show: false, id: null })
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Tabla de Categorías</h3>
        <div className="relative flex items-center gap-4">
          <CiSearch className="absolute left-3 text-gray-500" size={20} />
          <Input
            type="text"
            placeholder="Buscar..."
            className="input input-bordered input-primary rounded border border-slate-400 py-1 pl-10 text-left"
            onChange={(event) => setSearch(event.target.value)}
            value={search}
          />

          <Link href="/admin/incident/vars/cat/create" passHref>
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
              <TableHead
                className="border-r-2 p-2.5 text-sm font-semibold text-slate-800 w-[15px] min-w-[15px]"
                onClick={() => requestSort("id")}
              >
                <div className="flex items-center justify-between">
                  ID
                  <ArrowDownUp
                    size={12}
                    className="ml-2 cursor-pointer text-slate-800 transition-transform hover:scale-125"
                  />
                </div>
              </TableHead>

              <TableHead
                className="border-r-2 p-2.5 text-sm font-semibold text-slate-800 w-[200px] max-w-[200px] cursor-pointer"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center justify-between">
                  Nombre
                  <ArrowDownUp
                    size={12}
                    className="ml-2 cursor-pointer text-slate-800 transition-transform hover:scale-125"
                  />
                </div>
              </TableHead>

              <TableHead
                className="border-r-2 p-2.5 text-sm font-semibold text-slate-800 w-[200px] max-w-[200px] cursor-pointer"
                onClick={() => requestSort("variable")}
              >
                <div className="flex items-center justify-between">
                  Variable
                  <ArrowDownUp
                    size={12}
                    className="ml-2 cursor-pointer text-slate-800 transition-transform hover:scale-125"
                  />
                </div>
              </TableHead>

              <TableHead
                className="sticky right-0 w-[100px] bg-white p-2.5 text-sm font-semibold text-slate-800"
                style={{ boxShadow: "2px 0 0 #f1f5f9 inset" }}
              >
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-slate-700">
            {currentItems
              .filter((row) => categoryIds.includes(row.id))
              .map((row, rowIndex) => (
                <TableRow key={row.id} className={cx(rowIndex % 2 === 0 ? "bg-slate-100" : "bg-white")}>
                  <TableCell className="border-r-2 px-2 py-2 text-sm" title={String(firstItem + rowIndex + 1)}>
                    {firstItem + rowIndex + 1}
                  </TableCell>
                  <TableCell
                    className="w-[200px] max-w-[200px] overflow-hidden truncate whitespace-nowrap border-r-2 px-2 py-2 text-sm"
                    title={row.name}
                  >
                    {row.name}
                  </TableCell>
                  <TableCell
                    className="w-[200px] max-w-[200px] overflow-hidden truncate whitespace-nowrap border-r-2 px-2 py-2 text-sm"
                    title={row.variable}
                  >
                    {row.variable}
                  </TableCell>
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
                      <button className="flex w-full items-center justify-center" onClick={() => handleDelete(row.id)}>
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
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`flex h-6 w-6 items-center justify-center border border-gray-400 px-2 py-0 shadow-md ${
                currentPage === i + 1
                  ? "rounded-sm border-slate-950 bg-slate-800 text-white"
                  : "rounded bg-white text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modal de eliminación */}
      {deleteModal.show && deleteModal.id !== null && (
        <DeleteModal
          id={deleteModal.id}
          onCancel={() => setDeleteModal({ show: false, id: null })}
          onConfirm={async () => {
            if (deleteModal.id) await confirmDelete(deleteModal.id)
          }}
        />
      )}
    </div>
  )
}
