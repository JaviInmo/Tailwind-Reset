"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { handleDeleteSecondSubCategoryAction } from "./delete.action"

interface DeleteSecondSubCatContentProps {
  id: number
  SecondSubcatName?: string
  SubCategoryName?: string
}

export function DeleteSecondSubCatContent({
  id,
  SecondSubcatName,
  SubCategoryName,
}: DeleteSecondSubCatContentProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    try {
      setIsDeleting(true)
      const result = await handleDeleteSecondSubCategoryAction(id)
      if (result.success) {
        router.back()
        router.refresh()
      } else {
        console.error(`Error al eliminar la segunda subcategoría con ID: ${id}`, result.error)
      }
    } catch (error) {
      console.error("Error al eliminar la segunda subcategoría:", error)
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
              ¿Estás seguro de que deseas eliminar la segunda subcategoría{" "}
              {SecondSubcatName ? <strong>"{SecondSubcatName}"</strong> : null}
              {SubCategoryName ? (
                <span>
                  {" "}
                  de la subcategoría <strong>"{SubCategoryName}"</strong>
                </span>
              ) : null}
              ?
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleCancel}
              className="rounded bg-slate-600 px-4 py-2 text-white hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className={`rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500 ${
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}