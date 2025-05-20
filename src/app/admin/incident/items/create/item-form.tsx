"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

import { fetchVariables, registerAction } from "./item.action";

const formSchema = z.object({
    productName: z
        .string({ required_error: "Nombre del producto es requerido" })
        .min(1, { message: "Nombre es requerido" }),
    quantity: z.coerce
        .number({ required_error: "Cantidad es requerida" })
        .min(0.01, { message: "La cantidad debe ser mayor a 0" }),
    unitMeasureId: z.string().optional(),
    variableId: z
        .string({ required_error: "Variable es requerida" })
        .min(1, { message: "Variable es requerida" }),
    categoryId: z
        .string({ required_error: "Categoría es requerida" })
        .min(1, { message: "Categoría es requerida" }),
    subcategoryId: z.string().optional(),
    secondSubcategoryId: z.string().optional(),
});

type FormSchemaData = z.infer<typeof formSchema>;

export function ItemForm() {
    const router = useRouter();
    const [variables, setVariables] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [secondSubcategories, setSecondSubcategories] = useState<any[]>([]);
    const [unitMeasures, setUnitMeasures] = useState<{ id: number; name: string }[]>([]);
    const [globalError, setGlobalError] = useState<string | null>(null);

    const form = useForm<FormSchemaData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: "",
            quantity: 0,
            unitMeasureId: undefined,
            variableId: "",
            categoryId: "",
            subcategoryId: "",
            secondSubcategoryId: "",
        },
    });

    const watchVariableId = form.watch("variableId");
    const watchCategoryId = form.watch("categoryId");
    const watchSubcategoryId = form.watch("subcategoryId");

    useEffect(() => {
        const fetchData = async () => {
            const { variables, unitMeasures } = await fetchVariables();
            setVariables(variables);
            setUnitMeasures(unitMeasures);
        };
        fetchData();
    }, []);

    // Update categories when variable changes
    useEffect(() => {
        if (watchVariableId) {
            const variable = variables.find((v) => v.id.toString() === watchVariableId);
            if (variable && variable.categories) {
                setCategories(variable.categories);
                form.setValue("categoryId", "");
                form.setValue("subcategoryId", "");
                form.setValue("secondSubcategoryId", "");
            } else {
                setCategories([]);
            }
        } else {
            setCategories([]);
        }
    }, [watchVariableId, variables, form]);

    // Update subcategories when category changes
    useEffect(() => {
        if (watchCategoryId) {
            const category = categories.find((c) => c.id.toString() === watchCategoryId);
            if (category && category.subcategories) {
                setSubcategories(category.subcategories);
                form.setValue("subcategoryId", "");
                form.setValue("secondSubcategoryId", "");
            } else {
                setSubcategories([]);
            }
        } else {
            setSubcategories([]);
        }
    }, [watchCategoryId, categories, form]);

    // Update second subcategories when subcategory changes
    useEffect(() => {
        if (watchSubcategoryId) {
            const subcategory = subcategories.find((s) => s.id.toString() === watchSubcategoryId);
            if (subcategory && subcategory.secondSubcategories) {
                setSecondSubcategories(subcategory.secondSubcategories);
                form.setValue("secondSubcategoryId", "");
            } else {
                setSecondSubcategories([]);
            }
        } else {
            setSecondSubcategories([]);
        }
    }, [watchSubcategoryId, subcategories, form]);

    const onSubmit = async (data: FormSchemaData) => {
        setGlobalError(null);

        try {
            const payload = {
                productName: data.productName,
                quantity: data.quantity,
                unitMeasureId: data.unitMeasureId ? Number(data.unitMeasureId) : null,
                variableId: Number(data.variableId),
                categoryId: Number(data.categoryId),
                subcategoryId: data.subcategoryId ? Number(data.subcategoryId) : undefined,
                secondSubcategoryId:
                    data.secondSubcategoryId ? Number(data.secondSubcategoryId) : undefined,
            };

            const response = await registerAction(payload);

            if (!response.success) {
                setGlobalError(response.error || "Error al procesar el ítem");
                return;
            }

            router.back();
            router.refresh();
        } catch (error) {
            setGlobalError(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    return (
        <div className="flex w-full items-center justify-center overflow-y-auto bg-slate-100  py-0 text-black ">
            <div className="flex h-full w-full flex-col items-center justify-center rounded bg-white py-2 shadow-sm text-black">
            <div className="w-full max-w-md">
                <div className="mb-4 text-center">
                    <h1 className="mb-3 text-2xl font-semibold">Registro de Ítem</h1>
                    <p className="text-black">
                        Complete los datos del ítem y seleccione la categorización.
                    </p>
                </div>

                <div className="rounded-lg bg-white p-6 shadow">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="max-h-[calc(100vh-150px)] space-y-4 pt-2"
                        >
                            <div className="space-y-4">
                                <h2 className="border-b pb-2 text-lg font-medium">
                                    Datos del Ítem
                                </h2>

                                <FormField
                                    control={form.control}
                                    name="productName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre del Producto</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nombre del producto"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-4">
                                    <FormField
                                        control={form.control}
                                        name="quantity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cantidad</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="Cantidad"
                                                        {...field}
                                                    />
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
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione una unidad de medida" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {unitMeasures.map((unitMeasure) => (
                                                            <SelectItem
                                                                key={unitMeasure.id}
                                                                value={unitMeasure.id.toString()}
                                                            >
                                                                {unitMeasure.name}
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
                                <h2 className="border-b pb-2 text-lg font-medium">
                                    Categorización
                                </h2>
                                <div className="flex gap-4">
                                    <FormField
                                        control={form.control}
                                        name="variableId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Variable</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione una variable" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {variables.map((variable) => (
                                                            <SelectItem
                                                                key={variable.id}
                                                                value={variable.id.toString()}
                                                            >
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
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    disabled={categories.length === 0}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione una categoría" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories.map((category) => (
                                                            <SelectItem
                                                                key={category.id}
                                                                value={category.id.toString()}
                                                            >
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
                                                            <SelectItem
                                                                key={subcategory.id}
                                                                value={subcategory.id.toString()}
                                                            >
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
                                                <FormLabel>
                                                    Segunda Subcategoría (Opcional)
                                                </FormLabel>
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
                                                        {secondSubcategories.map(
                                                            (secondSubcategory) => (
                                                                <SelectItem
                                                                    key={secondSubcategory.id}
                                                                    value={secondSubcategory.id.toString()}
                                                                >
                                                                    {secondSubcategory.name}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                
                            </div>

                            {globalError && (
                                <div className="text-center text-sm text-red-500">
                                    {globalError}
                                </div>
                            )}

                            <Button type="submit" className="w-full">
                                Registrar Ítem
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
            </div>
        </div>
    );
}
