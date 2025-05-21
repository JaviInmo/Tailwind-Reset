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
import { Checkbox } from "@/components/ui/checkbox"

import { fetchVariables, registerAction } from "./item.action"

const formSchema = z.object({
  title: z.string({ required_error: "Nombre del incidente es requerido" }).min(1, { message: "Nombre es requerido" }),
  description: z.string({ required_error: "Descripción es requerida" }).min(1, { message: "Descripción es requerida" }),
  variableId: z.string({ required_error: "Variable es requerida" }).min(1, { message: "Variable es requerida" }),
  categoryId: z.string({ required_error: "Categoría es requerida" }).min(1, { message: "Categoría es requerida" }),
  subcategoryId: z.string().optional(),
  secondSubcategoryId: z.string().optional(),
  unitMeasureIds: z.array(z.string()).optional(),
  provinceId: z.string({ required_error: "Provincia es requerida" }).min(1, { message: "Provincia es requerida" }),
  municipalityId: z.string({ required_error: "Municipio es requerido" }).min(1, { message: "Municipio es requerido" }),
  numberOfPeople: z.coerce.number().optional(),
  date: z.string().min(1, { message: "Fecha es requerida" }),
})

type FormSchemaData = z.infer<typeof formSchema>

export function ItemForm() {
  const router = useRouter()
  const [variables, setVariables] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [secondSubcategories, setSecondSubcategories] = useState<any[]>([])
  const [unitMeasures, setUnitMeasures] = useState<{ id: number; name: string }[]>([])
  const [provinces, setProvinces] = useState<any[]>([])
  const [municipalities, setMunicipalities] = useState<any[]>([])
  const [globalError, setGlobalError] = useState<string | null>(null)

  const form = useForm<FormSchemaData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      variableId: "",
      categoryId: "",
      subcategoryId: "",
      secondSubcategoryId: "",
      unitMeasureIds: [],
      provinceId: "",
      municipalityId: "",
      numberOfPeople: undefined,
      date: new Date().toISOString().split("T")[0],
    },
  })

  const watchVariableId = form.watch("variableId")
  const watchCategoryId = form.watch("categoryId")
  const watchSubcategoryId = form.watch("subcategoryId")
  const watchProvinceId = form.watch("provinceId")

  useEffect(() => {
    const fetchData = async () => {
      const { variables, unitMeasures, provinces } = await fetchVariables()
      setVariables(variables)
      setUnitMeasures(unitMeasures)
      setProvinces(provinces)
    }
    fetchData()
  }, [])

  // Update categories when variable changes
  useEffect(() => {
    if (watchVariableId) {
      const variable = variables.find((v) => v.id.toString() === watchVariableId)
      if (variable && variable.categories) {
        setCategories(variable.categories)
        form.setValue("categoryId", "")
        form.setValue("subcategoryId", "")
        form.setValue("secondSubcategoryId", "")
      } else {
        setCategories([])
      }
    } else {
      setCategories([])
    }
  }, [watchVariableId, variables, form])

  // Update subcategories when category changes
  useEffect(() => {
    if (watchCategoryId) {
      const category = categories.find((c) => c.id.toString() === watchCategoryId)
      if (category && category.subcategories) {
        setSubcategories(category.subcategories)
        form.setValue("subcategoryId", "")
        form.setValue("secondSubcategoryId", "")
      } else {
        setSubcategories([])
      }
    } else {
      setSubcategories([])
    }
  }, [watchCategoryId, categories, form])

  // Update second subcategories when subcategory changes
  useEffect(() => {
    if (watchSubcategoryId) {
      const subcategory = subcategories.find((s) => s.id.toString() === watchSubcategoryId)
      if (subcategory && subcategory.secondSubcategories) {
        setSecondSubcategories(subcategory.secondSubcategories)
        form.setValue("secondSubcategoryId", "")
      } else {
        setSecondSubcategories([])
      }
    } else {
      setSecondSubcategories([])
    }
  }, [watchSubcategoryId, subcategories, form])

  // Update municipalities when province changes
  useEffect(() => {
    if (watchProvinceId) {
      const province = provinces.find((p) => p.id === watchProvinceId)
      if (province && province.municipalities) {
        setMunicipalities(province.municipalities)
        form.setValue("municipalityId", "")
      } else {
        setMunicipalities([])
      }
    } else {
      setMunicipalities([])
    }
  }, [watchProvinceId, provinces, form])

  const onSubmit = async (data: FormSchemaData) => {
    setGlobalError(null)

    try {
      const payload = {
        title: data.title,
        description: data.description,
        variableId: Number(data.variableId),
        categoryId: Number(data.categoryId),
        subcategoryId: data.subcategoryId ? Number(data.subcategoryId) : undefined,
        secondSubcategoryId: data.secondSubcategoryId ? Number(data.secondSubcategoryId) : undefined,
        unitMeasureIds: data.unitMeasureIds ? data.unitMeasureIds.map((id) => Number(id)) : [],
        provinceId: data.provinceId,
        municipalityId: data.municipalityId,
        numberOfPeople: data.numberOfPeople,
        date: new Date(data.date),
      }

      const response = await registerAction(payload)

      if (!response.success) {
        setGlobalError(response.error || "Error al procesar el incidente")
        return
      }

      router.back()
      router.refresh()
    } catch (error) {
      setGlobalError(`Error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return (
    <div className="flex w-full items-center justify-center overflow-y-auto bg-slate-100 py-0 text-black">
      <div className="flex h-full w-full flex-col items-center justify-center rounded bg-white py-2 shadow-sm text-black">
        <div className="w-full max-w-4xl">
          <div className="mb-4 text-center">
            <h1 className="mb-3 text-2xl font-semibold">Registro de Incidente</h1>
            <p className="text-black">Complete los datos del incidente y seleccione la categorización.</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-h-[calc(100vh-150px)] space-y-4 pt-2 overflow-y-auto"
              >
                <div className="space-y-4">
                  <h2 className="border-b pb-2 text-lg font-medium">Datos del Incidente</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Incidente</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre del incidente" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Input placeholder="Descripción del incidente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="provinceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provincia</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una provincia" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {provinces.map((province) => (
                                <SelectItem key={province.id} value={province.id}>
                                  {province.name}
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
                      name="municipalityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Municipio</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={municipalities.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione un municipio" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {municipalities.map((municipality) => (
                                <SelectItem key={municipality.id} value={municipality.id}>
                                  {municipality.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="numberOfPeople"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Personas (Opcional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Número de personas afectadas"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value
                              field.onChange(value === "" ? undefined : Number.parseInt(value, 10))
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4 space-y-4">
                  <h2 className="border-b pb-2 text-lg font-medium">Categorización</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={categories.length === 0}>
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="subcategoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subcategoría (Opcional)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            disabled={subcategories.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una subcategoría" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subcategories.map((subcategory) => (
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
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            disabled={secondSubcategories.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una segunda subcategoría" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {secondSubcategories.map((secondSubcategory) => (
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

                <div className="mt-4 space-y-4">
                  <h2 className="border-b pb-2 text-lg font-medium">Unidades de Medida</h2>
                  <FormField
                    control={form.control}
                    name="unitMeasureIds"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">
                            Seleccione las unidades de medida aplicables (Opcional)
                          </FormLabel>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {unitMeasures.map((unitMeasure) => (
                            <FormField
                              key={unitMeasure.id}
                              control={form.control}
                              name="unitMeasureIds"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={unitMeasure.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(unitMeasure.id.toString())}
                                        onCheckedChange={(checked) => {
                                          const value = unitMeasure.id.toString()
                                          return checked
                                            ? field.onChange([...(field.value || []), value])
                                            : field.onChange(field.value?.filter((val) => val !== value))
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">{unitMeasure.name}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {globalError && <div className="text-center text-sm text-red-500">{globalError}</div>}

                <Button type="submit" className="w-full">
                  Registrar Incidente
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
