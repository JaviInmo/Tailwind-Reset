"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

import { updateUnitAction } from "./update.action"

const formSchema = z.object({
  name: z.string({ required_error: "Nombre de la unidad es requerido" }).min(1, { message: "Nombre es requerido" }),
})

type FormSchemaData = z.infer<typeof formSchema>

interface UnitFormProps {
  unitData: {
    id: number
    name: string
  }
}

export function UnitUpdateForm({ unitData }: UnitFormProps) {
  const router = useRouter()
  const [globalError, setGlobalError] = useState<string | null>(null)

  const form = useForm<FormSchemaData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: unitData.name,
    },
  })

  const onSubmit = async (data: FormSchemaData) => {
    setGlobalError(null)

    try {
      const response = await updateUnitAction({
        id: unitData.id,
        name: data.name,
      })

      if (!response.success) {
        setGlobalError(response.error || "Error al actualizar la unidad de medida")
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
        <div className="w-full max-w-md">
          <div className="mb-4 text-center">
            <h1 className="mb-3 text-2xl font-semibold">Editar Unidad de Medida</h1>
            <p className="text-black">Modifique el nombre de la unidad de medida.</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la Unidad</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Kilogramos, Litros, Unidades" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {globalError && <div className="text-center text-sm text-red-500">{globalError}</div>}

                <Button type="submit" className="w-full">
                  Actualizar Unidad
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
