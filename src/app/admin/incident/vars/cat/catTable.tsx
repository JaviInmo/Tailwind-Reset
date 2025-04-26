"use client"

import { ArrowDownUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RiDeleteBin7Line } from "react-icons/ri"
import { FaRegEdit } from "react-icons/fa"
import { useRouter } from "next/navigation"
import { handleDeleteCategoryAction } from "./delete/delete.action" // Asegúrate de importar la acción de eliminación
import DeleteModal from "./delete/page"

interface Data {
  id: number
  name: string
  variable: string
  variableId: number
}

export default function TablePage({ data }: { data: Data[] }) {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: number | null }>({
    show: false,
    id: null,
  })

  // Filtro por búsqueda
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) => String(value).toLowerCase().includes(search.toLowerCase())),
  )

  const handleDelete = (id: number) => setDeleteModal({ show: true, id })

  const confirmDelete = async (id: number) => {
    // Aquí se maneja la eliminación de la categoría
    const result = await handleDeleteCategoryAction(id)
    if (result.success) {
      // Si la eliminación es exitosa, actualizamos la tabla
      router.refresh() // Esto recarga la página para reflejar los cambios
    } else {
      console.error(`Error al eliminar la categoría con ID: ${id}`, result.error)
    }
    setDeleteModal({ show: false, id: null })
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Tabla de Categorías</h3>
        <Input
          type="text"
          placeholder="Buscar..."
          className="input input-bordered input-primary rounded border border-slate-400 py-1"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <Link href="/admin/incident/vars/cat/create">
          <Button className="rounded border border-slate-700 bg-slate-800 px-4 py-1 text-slate-100 hover:bg-slate-950">
            Agregar Categoría
          </Button>
        </Link>
      </div>

      <Table className="w-full">
        <TableHeader className="sticky top-0 z-10 bg-white shadow-md">
          <TableRow>
            <TableHead className="border-r-2 p-2.5 text-sm font-semibold text-slate-800">
              ID
              <ArrowDownUp
                size={12}
                className="ml-2 cursor-pointer text-slate-800 transition-transform hover:scale-125"
              />
            </TableHead>
            <TableHead className="border-r-2 p-2.5 text-sm font-semibold text-slate-800">
              Nombre
              <ArrowDownUp
                size={12}
                className="ml-2 cursor-pointer text-slate-800 transition-transform hover:scale-125"
              />
            </TableHead>
            <TableHead className="border-r-2 p-2.5 text-sm font-semibold text-slate-800">
              Variable
              <ArrowDownUp
                size={12}
                className="ml-2 cursor-pointer text-slate-800 transition-transform hover:scale-125"
              />
            </TableHead>
            <TableHead className="sticky right-0 w-[100px] bg-white p-2.5 text-sm font-semibold text-slate-800">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-slate-700">
          {filteredData.map((row, rowIndex) => (
            <TableRow key={row.id} className={rowIndex % 2 === 0 ? "bg-slate-100" : "bg-white"}>
              <TableCell className="border-r-2 px-2 py-2 text-sm">{row.id}</TableCell>
              <TableCell className="border-r-2 px-2 py-2 text-sm">{row.name}</TableCell>
              <TableCell className="border-r-2 px-2 py-2 text-sm">{row.variable}</TableCell>
              <TableCell className="sticky right-0 w-[100px] truncate bg-white px-3 py-1 text-sm">
                <div className="flex items-center justify-start gap-2">
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
      {deleteModal.show && deleteModal.id && (
        <DeleteModal
          id={deleteModal.id}
          onCancel={() => setDeleteModal({ show: false, id: null })}
          onConfirm={() => confirmDelete(deleteModal.id!)}
        />
      )}
    </div>
  )
}
