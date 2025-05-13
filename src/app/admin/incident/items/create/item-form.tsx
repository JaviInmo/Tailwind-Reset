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

import { fetchIncidents, fetchUnitMeasures, registerAction } from "./item.action"

const formSchema = z.object({
  productName: z
    .string({ required_error: "Nombre del producto es requerido" })
    .min(1, { message: "Nombre es requerido" }),
  quantity: z.coerce
    .number({ required_error: "Cantidad es requerida" })
    .min(0.01, { message: "La cantidad debe ser mayor a 0" }),
  unitMeasureId: z.string().optional(),
  incidentId: z.string({ required_error: "Incidente es requerido" }).min(1, { message: "Incidente es requerido" }),
})

type FormSchemaData = z.infer<typeof formSchema>

interface ItemFormProps {
  itemData?: {
    id: number
    productName: string
    quantity: number
    unitMeasureId: number | null
    incidentId: number
    unitMeasure?: {
      id: number
      name: string
    } | null
    incident: {
      id: number
      title: string
    }
  }
}

export function ItemForm({ itemData }: ItemFormProps) {
  const router = useRouter()
  const [incidents, setIncidents] = useState<{ id: number; title: string }[]>([])
  const [unitMeasures, setUnitMeasures] = useState<{ id: number; name: string }[]>([])
  const [globalError, setGlobalError] = useState<string | null>(null)

  const form = useForm<FormSchemaData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: itemData?.productName || "",
      quantity: itemData?.quantity || 0,
      unitMeasureId: itemData?.unitMeasureId?.toString() || undefined,
      incidentId: itemData?.incidentId.toString() || "",
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      const incidentsData = await fetchIncidents()
      setIncidents(incidentsData)

      const unitMeasuresData = await fetchUnitMeasures()
      setUnitMeasures(unitMeasuresData)
    }
    fetchData()
  }, [])

  const onSubmit = async (data: FormSchemaData) => {
    setGlobalError(null)

    try {
      const payload = itemData
        ? {
            id: itemData.id,
            productName: data.productName,
            quantity: data.quantity,
            unitMeasureId: data.unitMeasureId ? Number(data.unitMeasureId) : null,
            incidentId: Number(data.incidentId),
          }
        : {
            productName: data.productName,
            quantity: data.quantity,
            unitMeasureId: data.unitMeasureId ? Number(data.unitMeasureId) : null,
            incidentId: Number(data.incidentId),
          }

      const response = await registerAction(payload)

      if (!response.success) {
        setGlobalError(response.error || "Error al procesar el ítem")
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
          <h1 className="mb-3 text-2xl font-semibold">{itemData ? "Editar Ítem" : "Registro de Ítem"}</h1>
          <p className="text-black">
            {itemData ? "Modifica los datos del ítem" : "Inserte los datos del ítem y seleccione un incidente."}
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Producto</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del producto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Cantidad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitMeasureId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidad de Medida (Opcional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una unidad de medida" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {unitMeasures.map((unitMeasure) => (
                          <SelectItem key={unitMeasure.id} value={unitMeasure.id.toString()}>
                            {unitMeasure.name}
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
                name="incidentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incidente</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un incidente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {incidents.map((incident) => (
                          <SelectItem key={incident.id} value={incident.id.toString()}>
                            {incident.title}
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
                {itemData ? "Actualizar" : "Registrar"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
