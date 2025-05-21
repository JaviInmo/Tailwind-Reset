"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { handleDeleteItemAction } from "./delete.action"
import { Button } from "@/components/ui/button"

interface DeleteItemContentProps {
  id: number
  title: string
  variableName?: string
  categoryName?: string
}

export function DeleteItemContent({ id, title, variableName, categoryName }: DeleteItemContentProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    try {
      setIsDeleting(true)
      setError(null)

      const result = await handleDeleteItemAction(id)

      if (result.success) {
        router.back()
        router.refresh()
      } else {
        setError(result.error || "Error al eliminar el incidente")
      }
    } catch (error) {
      setError("Error al eliminar el incidente")
      console.error("Error al eliminar el incidente:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    router.back()
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
              ¿Estás seguro de que deseas eliminar el incidente <strong>"{title}"</strong>
              {variableName && categoryName ? (
                <span>
                  {" "}
                  de la variable <strong>"{variableName}"</strong> y categoría <strong>"{categoryName}"</strong>
                </span>
              ) : variableName ? (
                <span>
                  {" "}
                  de la variable <strong>"{variableName}"</strong>
                </span>
              ) : null}
              ?
            </p>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
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
