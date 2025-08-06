"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { handleDeleteItemAction } from "./delete.action" // Importa la acción simplificada
import { Button } from "@/components/ui/button"

interface DeleteItemContentProps {
  id: number
  productName: string // Cambiado de 'name' a 'productName' para ítems
}

export function DeleteItemContent({ id, productName }: DeleteItemContentProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    try {
      setIsDeleting(true)
      setError(null)
      const result = await handleDeleteItemAction(id) // Llama a la acción simplificada
      if (result.success) {
        router.back() // Vuelve a la página anterior (la tabla de ítems)
        router.refresh() // Refresca la página para mostrar los cambios
      } else {
        setError(result.error || "Error al eliminar el ítem")
      }
    } catch (error) {
      setError("Error al eliminar el ítem")
      console.error("Error al eliminar el ítem:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    router.back() // Vuelve a la página anterior sin eliminar
  }

  return (
    <div className="flex min-h-52 items-center justify-center bg-slate-100 px-4 py-12 sm:px-6 lg:px-8 text-black">
      <div className="w-full max-w-md">
        <div className="mb-4 text-center">
          <h1 className="mb-3 text-2xl font-semibold">Confirmar Eliminación</h1>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-6 text-center">
            <p className="text-black">
              ¿Estás seguro de que deseas eliminar el ítem{" "}
              <strong>&quot;{productName}&quot;</strong>? Esta acción no se puede deshacer.
            </p>
            {error && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={handleCancel} variant="outline" disabled={isDeleting}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} variant="destructive" disabled={isDeleting}>
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
