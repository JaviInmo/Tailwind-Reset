"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { Prisma } from "@prisma/client"
import { useEffect, useState, useCallback } from "react"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { updateIncidentAction } from "./update.action" // Importar la nueva acción de actualización
import { getItemsByDepthAction } from "@/app/admin/incident/create/get-items-by-depth.action" // Reutilizar la acción de ítems
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2 } from 'lucide-react'
import { useRouter } from "next/navigation"

// Definir el esquema de Zod para la validación del formulario
const formSchema = z.object({
  fecha: z.string().date("Fecha es requerido"),
  provincia: z.string({ required_error: "Provincia es requerido" }).min(1, { message: "Provincia es requerido" }),
  municipio: z.string({ required_error: "Municipio es requerido" }).min(1, { message: "Municipio es requerido" }),
  variable: z.coerce.number({ required_error: "Variable es requerido" }),
  categoria: z.coerce.number({ required_error: "Categoría es requerido" }),
  subcategoria: z.coerce.number({ required_error: "Subcategoría es requerido" }),
  segundasubcategoria: z.coerce.number().optional().nullable(),

  numberOfPeople: z.coerce.number().min(0, { message: "El número de personas no puede ser negativo" }),
  description: z.string({ required_error: "Descripción es requerido" }).min(1, { message: "Descripción es requerido" }),
  titulo: z.string({ required_error: "Título es requerido" }).min(1, { message: "Título es requerido" }),
  items: z
    .array(
      z.object({
        id: z.number().optional(), // ID del IncidentItem, opcional para nuevos ítems
        itemId: z.coerce.number().min(1, { message: "Ítem es requerido" }),
        quantityUsed: z.coerce.number().min(0.01, { message: "La cantidad debe ser mayor a 0" }),
        unitMeasureId: z.coerce.number().min(1, { message: "Unidad de medida es requerida" }),
      }),
    )
    .optional(),
})

type FormSchemaData = z.infer<typeof formSchema>

// Tipos de datos para las props del componente
type IncidentEditFormProps = {
  incidentData: Prisma.IncidentGetPayload<{
    include: {
      province: true
      municipality: true
      variable: true
      category: true
      subcategory: true
      secondSubcategory: true
      items: {
        include: {
          item: {
            include: {
              availableUnitMeasures: {
                include: {
                  unitMeasure: true
                }
              }
            }
          }
          unitMeasure: true
        }
      }
    }
  }>
  provinceData: Array<Prisma.ProvinceGetPayload<{ include: { municipalities: true } }>>
  variableData: Array<
    Prisma.VariableGetPayload<{
      include: {
        categories: {
          include: {
            subcategories: {
              include: { secondSubcategories: true }
            }
          }
        }
      }
    }>
  >
}

export function IncidentEditForm({ incidentData, variableData, provinceData }: IncidentEditFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableItems, setAvailableItems] = useState<Array<Prisma.ItemGetPayload<{
    include: {
      availableUnitMeasures: {
        include: {
          unitMeasure: true
        }
      }
    }
  }>>>([])
  const [fetchingItems, setFetchingItems] = useState(false)

  const form = useForm<FormSchemaData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      fecha: incidentData ? new Date(incidentData.date).toISOString().split("T")[0] : undefined,
      numberOfPeople: incidentData?.numberOfPeople ?? 0,
      categoria: incidentData?.categoryId ?? undefined,
      subcategoria: incidentData?.subcategoryId ?? undefined,
      segundasubcategoria: incidentData?.secondSubcategoryId ?? null,
      variable: incidentData?.variableId,
      provincia: incidentData?.provinceId,
      municipio: incidentData?.municipalityId,
      description: incidentData?.description,
      titulo: incidentData?.title,
      items:
        incidentData?.items?.map((incidentItem) => ({
          id: incidentItem.id, // Incluir el ID del IncidentItem
          itemId: incidentItem.itemId,
          quantityUsed: incidentItem.quantityUsed ?? 0,
          unitMeasureId: incidentItem.unitMeasureId ?? 0,
        })) || [],
    },
  })

  const { register, handleSubmit, setError, control, setValue, formState: { errors }, getValues } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  // Usar useWatch para los campos que controlan las opciones dependientes
  const watchedProvince = useWatch({ control, name: "provincia" })
  const watchedVariable = useWatch({ control, name: "variable" })
  const watchedCategory = useWatch({ control, name: "categoria" })
  const watchedSubcategory = useWatch({ control, name: "subcategoria" })
  const watchedSecondSubcategory = useWatch({ control, name: "segundasubcategoria" })

  // Watch the entire items array to get current values for each item in the field array
  const watchedItemsArray = useWatch({ control, name: "items" });


  async function onSubmit(data: FormSchemaData) {
    setIsSubmitting(true)
    try {
      const response = await updateIncidentAction({
        id: incidentData.id, // Pasar el ID del incidente a actualizar
        categoryId: data.categoria,
        subcategoryId: data.subcategoria,
        secondSubcategoryId: data.segundasubcategoria,
        variableId: data.variable,
        date: new Date(data.fecha),
        numberOfPeople: data.numberOfPeople,
        description: data.description,
        title: data.titulo,
        municipalityId: data.municipio,
        provinceId: data.provincia,
        items: data.items || [], // Asegurarse de pasar el array de ítems
      })
      if (!response.success) {
        setError("root", { message: response.error || "Error al actualizar la incidencia" })
        return
      }
      router.push("/admin/incident/read") // Redirigir a la tabla de incidentes
      router.refresh()
    } catch (error) {
      console.error("Error submitting form:", error)
      setError("root", { message: "Error al enviar el formulario" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fetch items based on selected depth
  const fetchItems = useCallback(async () => {
    const variable = watchedVariable
    const category = watchedCategory
    const subcategory = watchedSubcategory
    const secondSubcategory = watchedSecondSubcategory

    if (variable && category && subcategory) {
      setFetchingItems(true)
      const result = await getItemsByDepthAction({
        variableId: Number(variable),
        categoryId: Number(category),
        subcategoryId: Number(subcategory),
        secondSubcategoryId: secondSubcategory ? Number(secondSubcategory) : null,
      })
      if (result.success) {
        setAvailableItems(result.items || [])
      } else {
        console.error("Error fetching items:", result.error)
        setAvailableItems([])
      }
      setFetchingItems(false)
    } else {
      setAvailableItems([])
    }
  }, [watchedVariable, watchedCategory, watchedSubcategory, watchedSecondSubcategory])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  // Reset dependent fields when parent field changes
  useEffect(() => {
    if (watchedProvince) {
      const municipalityExists = provinceData
        .find((p) => p.id === watchedProvince)
        ?.municipalities.some((m) => m.id === getValues("municipio"))
      if (!municipalityExists) {
        setValue("municipio", "")
      }
    }
  }, [watchedProvince, provinceData, setValue, getValues])

  useEffect(() => {
    if (watchedVariable) {
      const categoryExists = variableData
        .find((v) => v.id === Number(watchedVariable))
        ?.categories.some((c) => c.id === getValues("categoria"))
      if (!categoryExists) {
        setValue("categoria", 0)
        setValue("subcategoria", 0)
        setValue("segundasubcategoria", null)
      }
    }
  }, [watchedVariable, variableData, setValue, getValues])

  useEffect(() => {
    if (watchedCategory) {
      const variable = variableData.find((v) => v.id === Number(watchedVariable))
      const subcategoryExists = variable?.categories
        .find((c) => c.id === Number(watchedCategory))
        ?.subcategories.some((sc) => sc.id === getValues("subcategoria"))
      if (!subcategoryExists) {
        setValue("subcategoria", 0)
        setValue("segundasubcategoria", null)
      }
    }
  }, [watchedCategory, watchedVariable, variableData, setValue, getValues])

  useEffect(() => {
    if (watchedSubcategory) {
      const variable = variableData.find((v) => v.id === Number(watchedVariable))
      const category = variable?.categories.find((c) => c.id === Number(watchedCategory))
      const secondSubcategoryExists = category?.subcategories
        .find((sc) => sc.id === Number(watchedSubcategory))
        ?.secondSubcategories.some((ssc) => ssc.id === getValues("segundasubcategoria"))
      if (!secondSubcategoryExists) {
        setValue("segundasubcategoria", null)
      }
    }
  }, [watchedSubcategory, watchedCategory, watchedVariable, variableData, setValue, getValues])

  // Get options for select fields
  const variableOptions = variableData
  const municipalityOptions = watchedProvince
    ? provinceData.find((p) => p.id === watchedProvince)?.municipalities || []
    : []
  const categoryOptions = watchedVariable
    ? variableData.find((v) => v.id === Number(watchedVariable))?.categories || []
    : []
  const subcategoryOptions =
    watchedCategory && watchedVariable
      ? variableData
          .find((v) => v.id === Number(watchedVariable))
          ?.categories.find((c) => c.id === Number(watchedCategory))?.subcategories || []
      : []
  const secondSubcategoryOptions =
    watchedSubcategory && watchedCategory && watchedVariable
      ? variableData
          .find((v) => v.id === Number(watchedVariable))
          ?.categories.find((c) => c.id === Number(watchedCategory))
          ?.subcategories.find((sc) => sc.id === Number(watchedSubcategory))?.secondSubcategories || []
      : []

  return (
    <div className="flex h-full w-full items-center justify-center overflow-y-auto py-0">
      <div className="flex h-full w-full flex-col items-center justify-center rounded bg-white py-2 shadow-sm text-black">
        <div className="text-center pb-4">
          <p className="font-semibold">Formulario de Edición de Incidencias</p>
          <p className="font-semibold">
            Edite los campos del formulario para actualizar la incidencia.
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[calc(100vh-150px)] w-full flex-col gap-2 overflow-y-auto px-4 pt-2 lg:w-11/12"
        >
          {errors.root && <div className="mb-4 rounded bg-red-100 p-2 text-red-600">{errors.root.message}</div>}
          <div className="flex gap-4 pb-2">
            <div className="w-full">
              <Label className="block pb-2">Fecha:</Label>
              <Input
                type="date"
                {...register("fecha")}
                className="w-full rounded border border-gray-300 bg-white p-2"
              />
              {errors.fecha && <p className="text-red-600">{errors.fecha.message}</p>}
            </div>
            <div className="w-full">
              <Label className="block pb-2">Título:</Label>
              <Input
                type="text"
                {...register("titulo")}
                className="w-full rounded border border-gray-300 bg-white p-2"
              />
              {errors.titulo && <p className="text-red-600">{errors.titulo.message}</p>}
            </div>
          </div>
          <div className="flex gap-4 pb-2">
            <div className="w-full">
              <Label className="block pb-2">Provincia:</Label>
              <Controller
                control={control}
                name="provincia"
                render={({ field: { onChange, value } }) => (
                  <Select onValueChange={onChange} value={value}>
                    <SelectTrigger className="w-full rounded border border-gray-300 bg-white p-2">
                      <SelectValue placeholder="Seleccionar provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {provinceData.map((opt) => (
                          <SelectItem key={opt.id} value={opt.id}>
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.provincia && <p className="text-red-600">{errors.provincia.message}</p>}
            </div>
            <div className="w-full">
              <Label className="block pb-2">Municipio:</Label>
              <Controller
                control={control}
                name="municipio"
                render={({ field: { onChange, value } }) => (
                  <Select
                    onValueChange={onChange}
                    value={value}
                    disabled={!watchedProvince || municipalityOptions.length === 0}
                  >
                    <SelectTrigger className="w-full rounded border border-gray-300 bg-white p-2 disabled:bg-slate-300">
                      <SelectValue placeholder="Seleccionar Municipio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {municipalityOptions.map((opt) => (
                          <SelectItem key={opt.id} value={opt.id}>
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.municipio && <p className="text-red-600">{errors.municipio.message}</p>}
            </div>
          </div>
          <div className="flex gap-4 pb-2">
            <div className="w-full">
              <Label className="block pb-2">Variable:</Label>
              <Controller
                control={control}
                name="variable"
                render={({ field: { onChange, value } }) => (
                  <Select
                    onValueChange={(val) => onChange(Number(val))}
                    value={value ? value.toString() : ""}
                  >
                    <SelectTrigger className="w-full rounded border border-gray-300 bg-white p-2">
                      <SelectValue placeholder="Seleccionar variable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {variableOptions.map((opt) => (
                          <SelectItem key={opt.id} value={opt.id.toString()}>
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.variable && <p className="text-red-600">{errors.variable.message}</p>}
            </div>
            <div className="w-full">
              <Label className="block pb-2">Categoría:</Label>
              <Controller
                control={control}
                name="categoria"
                render={({ field: { onChange, value } }) => (
                  <Select
                    onValueChange={(val) => onChange(Number(val))}
                    value={value ? value.toString() : ""}
                    disabled={!watchedVariable || categoryOptions.length === 0}
                  >
                    <SelectTrigger className="w-full rounded border border-gray-300 bg-white p-2 text-black disabled:bg-slate-300">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categoryOptions.map((opt) => (
                          <SelectItem key={opt.id} value={opt.id.toString()}>
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoria && <p className="text-red-600">{errors.categoria.message}</p>}
            </div>
          </div>
          <div className="flex gap-4 pb-2">
            <div className="w-full">
              <Label className="block pb-2">Subcategoría:</Label>
              <Controller
                control={control}
                name="subcategoria"
                render={({ field: { onChange, value } }) => (
                  <Select
                    onValueChange={(val) => onChange(Number(val))}
                    value={value ? value.toString() : ""}
                    disabled={!watchedCategory || subcategoryOptions.length === 0}
                  >
                    <SelectTrigger className="w-full rounded border border-gray-300 bg-white p-2 text-black disabled:bg-slate-300">
                      <SelectValue placeholder="Seleccionar subcategoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {subcategoryOptions.map((opt) => (
                          <SelectItem key={opt.id} value={opt.id.toString()}>
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subcategoria && <p className="text-red-600">{errors.subcategoria.message}</p>}
            </div>
            <div className="w-full">
              <Label className="block pb-2">Segunda Subcategoría:</Label>
              <Controller
                control={control}
                name="segundasubcategoria"
                render={({ field: { onChange, value } }) => (
                  <Select
                    onValueChange={(val) => onChange(val === "none" ? null : Number(val))}
                    value={value === null ? "none" : value?.toString() || ""}
                    disabled={!watchedSubcategory || secondSubcategoryOptions.length === 0}
                  >
                    <SelectTrigger className="w-full rounded border border-gray-300 bg-white p-2 text-black disabled:bg-slate-300">
                      <SelectValue placeholder="Seleccionar segundasubcategoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="none">Sin segunda subcategoría</SelectItem>
                        {secondSubcategoryOptions.map((opt) => (
                          <SelectItem key={opt.id} value={opt.id.toString()}>
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.segundasubcategoria && <p className="text-red-600">{errors.segundasubcategoria.message}</p>}
            </div>
          </div>
          <div className="flex gap-4 pb-2">
            <div className="w-full">
              <Label className="block pb-2">No de Personas:</Label>
              <Input
                type="number"
                {...register("numberOfPeople")}
                className="w-full rounded border border-gray-300 bg-white p-2"
                min={0}
              />
              {errors.numberOfPeople && <p className="text-red-600">{errors.numberOfPeople.message}</p>}
            </div>
          </div>
          <div className="pb-4">
            <Label className="block pb-2">Descripción:</Label>
            <Textarea
              {...register("description")}
              className="w-full rounded border border-gray-300 bg-white p-2"
            ></Textarea>
            {errors.description && <p className="text-red-600">{errors.description.message}</p>}
          </div>
          {/* Items Section */}
          <div className="mb-4 rounded-md border p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Ítems del Incidente</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ itemId: 0, quantityUsed: 0, unitMeasureId: 0 })} // Usar quantityUsed
                className="flex items-center gap-1"
                disabled={fetchingItems || availableItems.length === 0}
              >
                <PlusCircle size={16} /> Agregar Ítem
              </Button>
            </div>
            {fetchingItems ? (
              <div className="py-4 text-center text-gray-500">Cargando ítems...</div>
            ) : availableItems.length === 0 && fields.length === 0 ? (
              <div className="py-4 text-center text-gray-500">
                Seleccione una profundidad válida para ver ítems disponibles o agregue ítems.
              </div>
            ) : fields.length === 0 ? (
              <div className="py-4 text-center text-gray-500">
                Agregue ítems para este incidente.
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => {
                  // Acceder al itemId del array watchedItemsArray
                  const currentItemId = watchedItemsArray?.[index]?.itemId;
                  const selectedItem = availableItems.find(item => item.id === currentItemId);
                  const availableUnitsForSelectedItem = selectedItem?.availableUnitMeasures.map(ium => ium.unitMeasure) || [];

                  return (
                    <div key={field.id} className="rounded-md border bg-gray-50 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium">Ítem #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div>
                          <Label className="block pb-1">Ítem:</Label>
                          <Controller
                            control={control}
                            name={`items.${index}.itemId` as const}
                            render={({ field: itemField }) => (
                              <Select
                                onValueChange={(val) => {
                                  itemField.onChange(Number(val));
                                  setValue(`items.${index}.unitMeasureId`, 0); // Reset unitMeasureId when item changes
                                }}
                                value={itemField.value ? itemField.value.toString() : ""}
                                disabled={availableItems.length === 0}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Seleccionar ítem" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {availableItems.map((itemOpt) => (
                                      <SelectItem key={itemOpt.id} value={itemOpt.id.toString()}>
                                        {itemOpt.productName}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.items?.[index]?.itemId && (
                            <p className="text-sm text-red-600">{errors.items[index]?.itemId?.message}</p>
                          )}
                        </div>
                        <div>
                          <Label className="block pb-1">Cantidad:</Label>
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`items.${index}.quantityUsed` as const, { valueAsNumber: true })} // Usar quantityUsed
                            placeholder="Cantidad"
                            className="w-full"
                            disabled={!currentItemId} // Deshabilitar si no hay ítem seleccionado
                          />
                          {errors.items?.[index]?.quantityUsed && ( // Usar quantityUsed
                            <p className="text-sm text-red-600">{errors.items[index]?.quantityUsed?.message}</p>
                          )}
                        </div>
                        <div>
                          <Label className="block pb-1">Unidad de Medida:</Label>
                          <Controller
                            control={control}
                            name={`items.${index}.unitMeasureId` as const}
                            render={({ field: unitField }) => (
                              <Select
                                onValueChange={(val) => unitField.onChange(Number(val))}
                                value={unitField.value ? unitField.value.toString() : ""}
                                disabled={!selectedItem || availableUnitsForSelectedItem.length === 0}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Seleccionar unidad" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {availableUnitsForSelectedItem.map((measure) => (
                                      <SelectItem key={measure.id} value={measure.id.toString()}>
                                        {measure.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.items?.[index]?.unitMeasureId && (
                            <p className="text-sm text-red-600">{errors.items[index]?.unitMeasureId?.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-1/3 rounded border-slate-700 bg-slate-800 py-2 text-slate-100 hover:bg-slate-950"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Actualizando..." : "Actualizar Incidencia"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
