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

import { fetchCategories, registerAction } from "./subcat.action"

const formSchema = z.object({
  name: z
    .string({ required_error: "Nombre de la subcategoría es requerido" })
    .min(1, { message: "Nombre es requerido" }),
  categoryId: z.string({ required_error: "Categoría es requerida" }).min(1, { message: "Categoría es requerida" }),
})

type FormSchemaData = z.infer<typeof formSchema>

interface SubCategoryFormProps {
  subcategoryData?: {
    id: number
    name: string
    categoryId: number
    category: {
      id: number
      name: string
    }
  }
}

export function SubCatForm({ subcategoryData }: SubCategoryFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [globalError, setGlobalError] = useState<string | null>(null)

  const form = useForm<FormSchemaData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subcategoryData?.name || "",
      categoryId: subcategoryData?.categoryId.toString() || "",
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      const cats = await fetchCategories()
      setCategories(cats)
    }
    fetchData()
  }, [])

  const onSubmit = async (data: FormSchemaData) => {
    setGlobalError(null)

    try {
      const payload = subcategoryData
        ? { id: subcategoryData.id, name: data.name, categoryId: Number(data.categoryId) }
        : { name: data.name, categoryId: Number(data.categoryId) }

      const response = await registerAction(payload)

      if (!response.success) {
        setGlobalError(response.error || "Error al procesar la subcategoría")
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
          <h1 className="mb-3 text-2xl font-semibold">
            {subcategoryData ? "Editar Subcategoría" : "Registro de Subcategoría"}
          </h1>
          <p className="text-black">
            {subcategoryData
              ? "Modifica los datos de la subcategoría"
              : "Inserte el nombre de la subcategoría y seleccione una categoría."}
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
                    <FormLabel>Nombre de la Subcategoría</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de la subcategoría" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
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
                {subcategoryData ? "Actualizar" : "Registrar"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
