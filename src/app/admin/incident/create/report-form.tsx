"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { Prisma } from "@prisma/client"
import { useEffect, useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { registerAction } from "./form.action"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2 } from "lucide-react"


const formSchema = z.object({
  fecha: z.string().date("Fecha es requerido"),
  provincia: z.string({ required_error: "Provincia es requerido" }).min(1, { message: "Provincia es requerido" }),
  municipio: z.string({ required_error: "Municipio es requerido" }).min(1, { message: "Municipio es requerido" }),
  variable: z.coerce.number({ required_error: "Variable es requerido" }),
  categoria: z.coerce.number({ required_error: "Categoría es requerido" }),
  subcategoria: z.coerce.number({ required_error: "Subcategoría es requerido" }),
  segundasubcategoria: z.coerce.number().optional(),
 
  numberOfPeople: z.coerce.number().min(0, { message: "El número de personas no puede ser negativo" }),
  description: z.string({ required_error: "Descripción es requerido" }).min(1, { message: "Descripción es requerido" }),
  titulo: z.string({ required_error: "Título es requerido" }).min(1, { message: "Título es requerido" }),
  items: z
    .array(
      z.object({
        productName: z.string().min(1, { message: "Nombre del producto es requerido" }),
        quantity: z.coerce.number().min(0.01, { message: "La cantidad debe ser mayor a 0" }),
        unitMeasureId: z.string().optional(),
      }),
    )
    .optional(),
})
type FormSchemaData = z.infer<typeof formSchema>

type ReportFormProps = {
  incidentData?: Prisma.IncidentGetPayload<{
    include: {
      items: {
        include: {
          unitMeasure: true
        }
      }
    }
  }> & { numberOfPeople?: number }
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
  readOnly?: boolean
}

export function ReportForm({ incidentData, variableData, provinceData, readOnly = false }: ReportFormProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [unitMeasures, setUnitMeasures] = useState<{ id: number; name: string }[]>([])

  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormSchemaData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      fecha: incidentData ? new Date(incidentData.date).toISOString().split("T")[0] : undefined,
     
      numberOfPeople: incidentData?.numberOfPeople ?? 0,
      categoria: incidentData?.categoryId ?? undefined,
      subcategoria: incidentData?.subcategoryId ?? undefined,
      segundasubcategoria: incidentData?.secondSubcategoryId ?? undefined,
      variable: incidentData?.variableId,
      provincia: incidentData?.provinceId,
      municipio: incidentData?.municipalityId,
      description: incidentData?.description,
      titulo: incidentData?.title,
      items:
        incidentData?.items?.map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
          unitMeasureId: item.unitMeasureId?.toString() || undefined,
        })) || [],
    },
  })

  // Setup field array for items
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  // Fetch unit measures for the dropdown


  async function onSubmit(data: FormSchemaData) {
    if (readOnly) return // En modo solo lectura no se procesa el envío
    setIsSubmitting(true)
    try {
      const response = await registerAction({
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
        items:
          data.items?.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
            unitMeasureId: item.unitMeasureId ? Number(item.unitMeasureId) : null,
          })) || [],
      })
      if (!response.success) {
        setError("root", { message: "Incidencia ya registrada" })
        return
      }
      reset()
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      setError("root", { message: "Error al enviar el formulario" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
  }

  // Watch form values
  const watchedProvince = watch("provincia")
  const watchedVariable = watch("variable")
  const watchedCategory = watch("categoria")
  const watchedSubcategory = watch("subcategoria")

  // Debug logging
  useEffect(() => {
    console.log("Form values changed:", {
      province: watchedProvince,
      variable: watchedVariable,
      category: watchedCategory,
      subcategory: watchedSubcategory,
    })
  }, [watchedProvince, watchedVariable, watchedCategory, watchedSubcategory])

  // Reset dependent fields when parent field changes
  useEffect(() => {
    if (watchedProvince) {
      // If province changes, reset municipality
      const municipalityExists = provinceData
        .find((p) => p.id === watchedProvince)
        ?.municipalities.some((m) => m.id === watch("municipio"))

      if (!municipalityExists) {
        setValue("municipio", "")
      }
    }
  }, [watchedProvince, provinceData, setValue, watch])

  useEffect(() => {
    if (watchedVariable) {
      // If variable changes, reset category, subcategory, and second subcategory
      const categoryExists = variableData
        .find((v) => v.id === Number(watchedVariable))
        ?.categories.some((c) => c.id === Number(watch("categoria")))

      if (!categoryExists) {
        setValue("categoria", 0)
        setValue("subcategoria", 0)
        setValue("segundasubcategoria", 0)
      }
    }
  }, [watchedVariable, variableData, setValue, watch])

  useEffect(() => {
    if (watchedCategory) {
      // If category changes, reset subcategory and second subcategory
      const variable = variableData.find((v) => v.id === Number(watchedVariable))
      const subcategoryExists = variable?.categories
        .find((c) => c.id === Number(watchedCategory))
        ?.subcategories.some((sc) => sc.id === Number(watch("subcategoria")))

      if (!subcategoryExists) {
        setValue("subcategoria", 0)
        setValue("subcategoria", 0)
      }
    }
  }, [watchedCategory, watchedVariable, variableData, setValue, watch])

  useEffect(() => {
    if (watchedSubcategory) {
      // If subcategory changes, reset second subcategory
      const variable = variableData.find((v) => v.id === Number(watchedVariable))
      const category = variable?.categories.find((c) => c.id === Number(watchedCategory))
      const secondSubcategoryExists = category?.subcategories
        .find((sc) => sc.id === Number(watchedSubcategory))
        ?.secondSubcategories.some((ssc) => ssc.id === Number(watch("segundasubcategoria")))

      if (!secondSubcategoryExists) {
        setValue("segundasubcategoria", 0)
      }
    }
  }, [watchedSubcategory, watchedCategory, watchedVariable, variableData, setValue, watch])

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
          <p className="font-semibold">Formulario de Incidencias</p>
          <p className="font-semibold">
            {readOnly
              ? "Visualización de incidencia "
              : "Rellene los campos del formulario para registrar la incidencia."}
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
                disabled={readOnly}
              />
              {errors.fecha && <p className="text-red-600">{errors.fecha.message}</p>}
            </div>
            <div className="w-full">
              <Label className="block pb-2">Título:</Label>
              <Input
                type="text"
                {...register("titulo")}
                className="w-full rounded border border-gray-300 bg-white p-2"
                disabled={readOnly}
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
                  <Select onValueChange={onChange} value={value} disabled={readOnly}>
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
                    disabled={readOnly || !watchedProvince || municipalityOptions.length === 0}
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
                    disabled={readOnly}
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
                    disabled={readOnly || !watchedVariable || categoryOptions.length === 0}
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
                    disabled={readOnly || !watchedCategory || subcategoryOptions.length === 0}
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
                    onValueChange={(val) => onChange(Number(val))}
                    value={value ? value.toString() : ""}
                    disabled={readOnly || !watchedSubcategory || secondSubcategoryOptions.length === 0}
                  >
                    <SelectTrigger className="w-full rounded border border-gray-300 bg-white p-2 text-black disabled:bg-slate-300">
                      <SelectValue placeholder="Seleccionar segundasubcategoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
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
                disabled={readOnly}
              />
              {errors.numberOfPeople && <p className="text-red-600">{errors.numberOfPeople.message}</p>}
            </div>
          </div>

          <div className="pb-4">
            <Label className="block pb-2">Descripción:</Label>
            <Textarea
              {...register("description")}
              className="w-full rounded border border-gray-300 bg-white p-2"
              disabled={readOnly}
            ></Textarea>
            {errors.description && <p className="text-red-600">{errors.description.message}</p>}
          </div>

          {/* Items Section */}
          <div className="border rounded-md p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Ítems del Incidente</h3>
              {!readOnly && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ productName: "", quantity: 0, unitMeasureId: undefined })}
                  className="flex items-center gap-1"
                >
                  <PlusCircle size={16} /> Agregar Ítem
                </Button>
              )}
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {readOnly ? "No hay ítems registrados para este incidente." : "Agregue ítems para este incidente."}
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="border rounded-md p-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Ítem #{index + 1}</h4>
                      {!readOnly && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="block pb-1">Producto:</Label>
                        <Input
                          {...register(`items.${index}.productName` as const)}
                          placeholder="Nombre del producto"
                          className="w-full"
                          disabled={readOnly}
                        />
                        {errors.items?.[index]?.productName && (
                          <p className="text-red-600 text-sm">{errors.items[index]?.productName?.message}</p>
                        )}
                      </div>
                      <div>
                        <Label className="block pb-1">Cantidad:</Label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                          placeholder="Cantidad"
                          className="w-full"
                          disabled={readOnly}
                        />
                        {errors.items?.[index]?.quantity && (
                          <p className="text-red-600 text-sm">{errors.items[index]?.quantity?.message}</p>
                        )}
                      </div>
                      <div>
                        <Label className="block pb-1">Unidad de Medida:</Label>
                        <Controller
                          control={control}
                          name={`items.${index}.unitMeasureId` as const}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value} disabled={readOnly}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar unidad" />
                              </SelectTrigger>
                              <SelectContent>
                                {unitMeasures.map((measure) => (
                                  <SelectItem key={measure.id} value={measure.id.toString()}>
                                    {measure.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!readOnly && (
            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-1/3 rounded border-slate-700 bg-slate-800 py-2 text-slate-100 hover:bg-slate-950"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Crear Incidencia"}
              </Button>
            </div>
          )}
        </form>

        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-auto w-11/12 max-w-md rounded-lg bg-white p-4 shadow-lg">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xl font-semibold">Incidencia Creada</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={handleCloseSuccessModal}>
                  &times;
                </button>
              </div>
              <div className="py-4">
                <p>Incidencia creada con éxito.</p>
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  onClick={handleCloseSuccessModal}
                >
                  Aceptar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
