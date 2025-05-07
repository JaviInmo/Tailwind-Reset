"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { set, z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

import { fetchSubcategories, updateSecondSubcategoryAction } from "./update.action"

const formSchema = z.object({
    name: z
        .string({ required_error: "Nombre de la segunda subcategoría es requerido" })
        .min(1, { message: "Nombre es requerido" }),
    subcategoryId: z
        .string({ required_error: "Subcategoría es requerida" })
        .min(1, { message: "Subcategoría es requerida" }),
    })

    type FormSchemaData = z.infer<typeof formSchema>

    interface SecondSubCategoryFormProps {
        secondSubcategoryData: {
            id: number
            name: string
            subcategoryId: number
            subcategory: {
                id: number
                name: string
            }
        }
    }

    export function SecondSubcategoryUpdateForm({ secondSubcategoryData }: SecondSubCategoryFormProps) {
        const [showSuccessModal, setShowSuccessModal] = useState(false)
        const [subcategories, setSubcategories] = useState<{ id: number; name: string }[]>([])
        const [globalError, setGlobalError] = useState<string | null>(null)
        const router = useRouter()

        const form = useForm<FormSchemaData>({
            resolver: zodResolver(formSchema),
            mode: "onTouched",
            defaultValues: {
                name: secondSubcategoryData.name,
                subcategoryId: secondSubcategoryData.subcategoryId.toString(),
            },
        })

        useEffect(() => {
            const fetchData = async () => {
                const subs = await fetchSubcategories()
                setSubcategories(subs)
            }
            fetchData()
        }, [])

        async function onSubmit(data: FormSchemaData) {
            setGlobalError(null)

            try {
                const response = await updateSecondSubcategoryAction({
                    id: secondSubcategoryData.id,
                    name: data.name,
                    subcategoryId: parseInt(data.subcategoryId),
                })
                if (!response.success) {
                    setGlobalError(response.error || "Error al actualizar la segundasubcategoría")
                    return
                }

                router.back()
                router.refresh()
            }
            catch (error) {
                setGlobalError(`Error al actualizar: ${error}`)
            }
        }

        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {globalError && <div className="text-red-500">{globalError}</div>}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre de la segunda subcategoría</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nombre" {...field} />
                                </FormControl>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Seleccionar subcategoría" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {subcategories.map((subcategory) => (
                                            <SelectItem key={subcategory.id} value={subcategory.id.toString()}>{subcategory.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Actualizar</Button>
                </form>
            </Form>
        )
    }
                   
        