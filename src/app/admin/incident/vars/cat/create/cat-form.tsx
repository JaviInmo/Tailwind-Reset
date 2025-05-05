"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

import { fetchVariables, registerAction } from "./cat.action"

const formSchema = z.object({
  name: z.string({ required_error: "Nombre de la categoría es requerido" }).min(1, { message: "Nombre es requerido" }),
  variableId: z.string({ required_error: "Variable es requerida" }).min(1, { message: "Variable es requerida" }),
})

type FormSchemaData = z.infer<typeof formSchema>

interface CategoryFormProps {
  categoryData?: {
    id: number
    name: string
    variableId: number
    variable: {
      id: number
      name: string
    }
  }
}

export function CatForm({ categoryData }: CategoryFormProps) {
  const router = useRouter()
  const [variables, setVariables] = useState<{ id: number; name: string }[]>([])
  const [globalError, setGlobalError] = useState<string | null>(null)

  const form = useForm<FormSchemaData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: categoryData?.name || "",
      variableId: categoryData?.variableId.toString() || "",
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      const vars = await fetchVariables()
      setVariables(vars)
    }
    fetchData()
  }, [])

  const onSubmit = async (data: FormSchemaData) => {
    setGlobalError(null)

    try {
      const payload = categoryData
        ? { id: categoryData.id, name: data.name, variableId: Number(data.variableId) }
        : { name: data.name, variableId: Number(data.variableId) }

      const response = await registerAction(payload)

      if (!response.success) {
        setGlobalError(response.error || "Error al procesar la categoría")
        return
      }

      router.back()
      router.refresh()
    } catch (error) {
      setGlobalError(`Error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return (
    <div className="flex min-h-52 items-center justify-center bg-slate-100 px-4 py-12 text-black sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-4 text-center">
          <h1 className="mb-3 text-2xl font-semibold">{categoryData ? "Editar Categoría" : "Registro de Categoría"}</h1>
          <p className="text-black">
            {categoryData
              ? "Modifica los datos de la categoría"
              : "Inserte el nombre de la categoría y seleccione una variable."}
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la Categoría</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de la categoría" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="variableId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variable</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una variable" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {variables.map((variable) => (
                          <SelectItem key={variable.id} value={variable.id.toString()}>
                            {variable.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {globalError && <div className="text-red-500 text-sm text-center">{globalError}</div>}

              <Button type="submit" className="w-full">
                {categoryData ? "Actualizar" : "Registrar"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
