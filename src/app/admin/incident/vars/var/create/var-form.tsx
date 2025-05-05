"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { registerAction } from "./var.action"

const formSchema = z.object({
  name: z
    .string({ required_error: "Nombre de la variable es requerido" })
    .min(1, { message: "Nombre de la variable es requerido" }),
})

type FormSchemaData = z.infer<typeof formSchema>

interface VariableFormProps {
  variableData?: {
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

export function VariableForm({ variableData }: VariableFormProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormSchemaData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: variableData?.name || "",
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    const payload = variableData ? { id: variableData.id, ...data } : data

    const response = await registerAction(payload)
    if (!response.success) {
      setError("root", {
        message: variableData ? "Error al actualizar la variable o el nombre ya existe" : "Variable ya registrada",
      })
      return
    }

    router.back()
  })

  return (
    <div className="flex min-h-52 items-center justify-center bg-slate-100 px-4 py-12 text-black sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-4 text-center">
          <h1 className="mb-3 text-2xl font-semibold">{variableData ? "Editar Variable" : "Registro de Variables"}</h1>
          <p className="text-black">
            {variableData ? "Modifica los datos de la variable" : "Inserte el nombre de la variable."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input type="text" placeholder="Nombre de la variable" {...register("name")} />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          {errors.root && <p className="text-red-500 text-center">{errors.root.message}</p>}

          <Button type="submit" className="w-full" variant="immo">
            Guardar
          </Button>
        </form>
      </div>
    </div>
  )
}
