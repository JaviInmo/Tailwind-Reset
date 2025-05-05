"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { registerAction } from "../create/var.action"

const formSchema = z.object({
  name: z
    .string({ required_error: "Nombre de la variable es requerido" })
    .min(1, { message: "Nombre de la variable es requerido" }),
})

type FormSchemaData = z.infer<typeof formSchema>

type EditVarFormProps = {
  variableData: {
    id: number
    name: string
    categories: {
      name: string
      id: number
      variableId: number
      subcategories: {
        name: string
        id: number
        categoryId: number
      }[]
    }[]
  }
}

export function EditVarForm({ variableData }: EditVarFormProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormSchemaData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: variableData.name,
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    const payload = { id: variableData.id, ...data }

    const response = await registerAction(payload)
    if (!response.success) {
      return setError("root", {
        message: "Error al actualizar la variable o el nombre ya existe",
      })
    }

    router.back()
  })

  return (
    <div className="flex min-h-52 items-center justify-center bg-slate-100 px-4 py-12 text-black sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-4 text-center">
          <h1 className="mb-3 text-2xl font-semibold">Editar Variable</h1>
          <p className="text-black">Modifica los datos de la variable</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-semibold text-black">
                Nombre de la Variable
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Nombre de la variable"
                className="rounded border border-gray-300 px-3 py-2"
                {...register("name")}
              />
              {errors.name && <span className="text-red-500">{errors.name.message}</span>}
            </div>

            {errors.root && <div className="mt-3 text-red-500">{errors.root.message}</div>}

            <button type="submit" className="mt-4 rounded bg-black py-2 text-white hover:bg-gray-800">
              Actualizar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
