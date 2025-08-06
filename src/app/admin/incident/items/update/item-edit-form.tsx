"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { updateItemAction } from "./update.action" // Ruta corregida

// Definir el esquema de Zod para la validación del formulario
const formSchema = z.object({
  productName: z.string().min(1, "El nombre es requerido"),
  variableId: z.coerce.number().min(1, "Variable es requerida"),
  categoryId: z.coerce.number().min(1, "Categoría es requerida"),
  subcategoryId: z.coerce.number().min(1, "Subcategoría es requerida"),
  secondSubcategoryId: z.coerce.number().optional().nullable(), // Puede ser opcional y nulo
  unitMeasureIds: z.array(z.coerce.number()).min(1, "Debe seleccionar al menos una unidad de medida"),
})

type FormSchemaData = z.infer<typeof formSchema>

// Tipos de datos para las props del componente
type Props = {
  itemData: {
    id: number
    productName: string
    variableId: number
    categoryId: number
    subcategoryId: number
    secondSubcategoryId: number | null
    availableUnitMeasures: Array<{
      unitMeasure: {
        id: number
        name: string
      }
    }>
  }
  unitMeasures: { id: number; name: string }[]
  variableData: Array<{
      id: number
      name: string
      categories: Array<{
          id: number
          name: string
          subcategories: Array<{
              id: number
              name: string
              secondSubcategories: Array<{
                  id: number
                  name: string
              }>
          }>
      }>
  }>
}

export function ItemEditForm({ itemData, unitMeasures, variableData }: Props) {
  const router = useRouter()
  const [globalError, setGlobalError] = useState<string | null>(null)

  const form = useForm<FormSchemaData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
          productName: itemData.productName,
          variableId: itemData.variableId,
          categoryId: itemData.categoryId,
          subcategoryId: itemData.subcategoryId,
          secondSubcategoryId: itemData.secondSubcategoryId,
          unitMeasureIds: itemData.availableUnitMeasures.map(ium => ium.unitMeasure.id),
      },
  })

  const watchedVariable = useWatch({ control: form.control, name: "variableId" })
  const watchedCategory = useWatch({ control: form.control, name: "categoryId" })
  const watchedSubcategory = useWatch({ control: form.control, name: "subcategoryId" })

  // Efectos para resetear los campos de profundidad si la selección superior cambia
  useEffect(() => {
      if (watchedVariable) {
          const categoryExists = variableData
              .find((v) => v.id === Number(watchedVariable))
              ?.categories.some((c) => c.id === Number(form.getValues("categoryId")))
          if (!categoryExists) {
              form.setValue("categoryId", 0)
              form.setValue("subcategoryId", 0)
              form.setValue("secondSubcategoryId", 0)
          }
      }
  }, [watchedVariable, variableData, form])

  useEffect(() => {
      if (watchedCategory) {
          const variable = variableData.find((v) => v.id === Number(watchedVariable))
          const subcategoryExists = variable?.categories
              .find((c) => c.id === Number(watchedCategory))
              ?.subcategories.some((sc) => sc.id === Number(form.getValues("subcategoryId")))
          if (!subcategoryExists) {
              form.setValue("subcategoryId", 0)
              form.setValue("secondSubcategoryId", 0)
          }
      }
  }, [watchedCategory, watchedVariable, variableData, form])

  useEffect(() => {
      if (watchedSubcategory) {
          const variable = variableData.find((v) => v.id === Number(watchedVariable))
          const category = variable?.categories.find((c) => c.id === Number(watchedCategory))
          const secondSubcategoryExists = category?.subcategories
              .find((sc) => sc.id === Number(watchedSubcategory))
              ?.secondSubcategories.some((ssc) => ssc.id === Number(form.getValues("secondSubcategoryId")))
          if (!secondSubcategoryExists) {
              form.setValue("secondSubcategoryId", 0)
          }
      }
  }, [watchedSubcategory, watchedCategory, watchedVariable, variableData, form])

  // Opciones para los selects de profundidad
  const categoryOptions = watchedVariable
      ? variableData.find((v) => v.id === Number(watchedVariable))?.categories || []
      : []

  const subcategoryOptions = watchedCategory && watchedVariable
      ? variableData
          .find((v) => v.id === Number(watchedVariable))
          ?.categories.find((c) => c.id === Number(watchedCategory))?.subcategories || []
      : []

  const secondSubcategoryOptions = watchedSubcategory && watchedCategory && watchedVariable
      ? variableData
          .find((v) => v.id === Number(watchedVariable))
          ?.categories.find((c) => c.id === Number(watchedCategory))
          ?.subcategories.find((sc) => sc.id === Number(watchedSubcategory))?.secondSubcategories || []
      : []

  const onSubmit = async (data: FormSchemaData) => {
      setGlobalError(null)
      const result = await updateItemAction({
          id: itemData.id, // Pasa el ID del ítem a actualizar
          ...data,
          secondSubcategoryId: data.secondSubcategoryId || null,
          unitMeasureIds: data.unitMeasureIds,
      })

      if (!result.success) {
          setGlobalError(result.error || "Error al actualizar el ítem")
          return
      }

      router.push("/admin/inncident/items") // Redirige a la lista de ítems
      router.refresh() // Recarga los datos de la lista
  }

  return (
      <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Editar Ítem</h1>
          
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                      <h3 className="text-lg font-medium mb-4">Asociar a profundidad</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                              control={form.control}
                              name="variableId"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Variable</FormLabel>
                                      <Select
                                          onValueChange={(value) => field.onChange(Number(value))}
                                          value={field.value.toString()}
                                      >
                                          <FormControl>
                                              <SelectTrigger>
                                                  <SelectValue placeholder="Seleccione una variable" />
                                              </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                              {variableData.map((variable) => (
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

                          <FormField
                              control={form.control}
                              name="categoryId"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Categoría</FormLabel>
                                      <Select
                                          onValueChange={(value) => field.onChange(Number(value))}
                                          value={field.value.toString()}
                                          disabled={!watchedVariable || categoryOptions.length === 0}
                                      >
                                          <FormControl>
                                              <SelectTrigger>
                                                  <SelectValue placeholder="Seleccione una categoría" />
                                              </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                              {categoryOptions.map((category) => (
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

                          <FormField
                              control={form.control}
                              name="subcategoryId"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Subcategoría</FormLabel>
                                      <Select
                                          onValueChange={(value) => field.onChange(Number(value))}
                                          value={field.value.toString()}
                                          disabled={!watchedCategory || subcategoryOptions.length === 0}
                                      >
                                          <FormControl>
                                              <SelectTrigger>
                                                  <SelectValue placeholder="Seleccione una subcategoría" />
                                              </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                              {subcategoryOptions.map((subcategory) => (
                                                  <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                                                      {subcategory.name}
                                                  </SelectItem>
                                              ))}
                                          </SelectContent>
                                      </Select>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />

                          <FormField
                              control={form.control}
                              name="secondSubcategoryId"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Segunda Subcategoría (Opcional)</FormLabel>
                                      <Select
                                          onValueChange={(value) => field.onChange(value === "none" ? null : Number(value))}
                                          value={field.value?.toString() || "none"}
                                          disabled={!watchedSubcategory || secondSubcategoryOptions.length === 0}
                                      >
                                          <FormControl>
                                              <SelectTrigger>
                                                  <SelectValue placeholder="Seleccione segunda subcategoría" />
                                              </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                              <SelectItem value="none">Sin segunda subcategoría</SelectItem>
                                              {secondSubcategoryOptions.map((secondSubcategory) => (
                                                  <SelectItem key={secondSubcategory.id} value={secondSubcategory.id.toString()}>
                                                      {secondSubcategory.name}
                                                  </SelectItem>
                                              ))}
                                          </SelectContent>
                                      </Select>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                      </div>
                  </div>

                  <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-4">Datos del ítem</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                              control={form.control}
                              name="productName"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Nombre del producto</FormLabel>
                                      <FormControl>
                                          <Input placeholder="Ej: Arroz, Agua" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />

                          <FormField
                              control={form.control}
                              name="unitMeasureIds"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Unidades de medida disponibles</FormLabel>
                                      <div className="grid grid-cols-2 gap-2">
                                          {unitMeasures.map((unit) => (
                                              <div key={unit.id} className="flex items-center space-x-2">
                                                  <Checkbox
                                                      id={`unit-${unit.id}`}
                                                      checked={field.value.includes(unit.id)}
                                                      onCheckedChange={(checked) => {
                                                          return checked
                                                              ? field.onChange([...field.value, unit.id])
                                                              : field.onChange(
                                                                    field.value.filter(
                                                                        (value) => value !== unit.id
                                                                    )
                                                                )
                                                      }}
                                                  />
                                                  <Label htmlFor={`unit-${unit.id}`}>{unit.name}</Label>
                                              </div>
                                          ))}
                                      </div>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                      </div>
                  </div>

                  {globalError && <p className="text-red-500">{globalError}</p>}

                  <Button type="submit" className="w-full">
                      Actualizar Ítem
                  </Button>
              </form>
          </Form>
      </div>
  )
}
