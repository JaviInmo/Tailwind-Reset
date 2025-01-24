"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { countSecondSubCats } from "../readsecondsubcat.action";
import {
    fetchSecondSubCategoriesBySubCategory,
    fetchSubCategories,
    registerAction,
} from "./subcat.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

const formSchema = z.object({
    subcategory: z.string({ required_error: "Subcategoría es requerida" }),
    secondSubcategories: z
        .string({ required_error: "Segundas subcategorías no pueden estar vacías" })
        .min(1, { message: "Segundas subcategorías no pueden estar vacías" }),
});

type FormSchemaData = z.infer<typeof formSchema>;

export function SecondSubCatForm() {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [initialCount, setInitialCount] = useState<number | null>(null);
    const [subcategories, setSubcategories] = useState<{ id: number; name: string }[]>([]);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
    const [secondSubcategories, setSecondSubcategories] = useState<{ id: number; name: string }[]>(
        [],
    );
    const router = useRouter();

    const form = useForm<FormSchemaData>({
        resolver: zodResolver(formSchema),
        mode: "onTouched",
    });

    useEffect(() => {
        const fetchData = async () => {
            const subs = await fetchSubCategories();
            setSubcategories(subs);

            const count = await countSecondSubCats();
            setInitialCount(count);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedSubcategoryId) {
            const fetchSecondSubCategories = async () => {
                const secondSubs =
                    await fetchSecondSubCategoriesBySubCategory(selectedSubcategoryId);
                setSecondSubcategories(secondSubs);
            };

            fetchSecondSubCategories();
        } else {
            setSecondSubcategories([]);
        }
    }, [selectedSubcategoryId]);

    const handleSubcategoryChange = (value: string) => {
        const selectedSubcategory = subcategories.find((s) => s.name === value);
        if (selectedSubcategory) {
            setSelectedSubcategoryId(selectedSubcategory.id);
        }
    };

    const onSubmit: SubmitHandler<FormSchemaData> = async (data) => {
        if (!selectedSubcategoryId) {
            form.setError("subcategory", { message: "Debe seleccionar una subcategoría válida" });
            return;
        }

        const secondSubcategoriesArray = data.secondSubcategories
            .split(",")
            .map((name) => name.trim());
        let allSuccess = true;

        for (const secondSubcategory of secondSubcategoriesArray) {
            const response = await registerAction({
                subcategoryId: selectedSubcategoryId,
                name: secondSubcategory,
            });
            if (!response.success) {
                form.setError("root", {
                    message: `Segunda subcategoría "${secondSubcategory}" ya registrada`,
                });
                allSuccess = false;
            }
        }

        if (allSuccess) {
            const newCount = await countSecondSubCats();

            if (initialCount !== null && newCount > initialCount) {
                setShowSuccessModal(true);
            } else {
                console.error("Error al actualizar la tabla después de la inserción");
            }
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        form.reset();
    };

    const handleConfirmSuccessModal = () => {
        setShowSuccessModal(false);
        form.reset();
        router.push("/admin/incident/vars/secondsubcat");
    };

    return (
        <div className="flex flex-col items-center gap-6 py-8">
            {/* Encabezado */}
            <div className="text-center">
                <h1 className="text-2xl font-semibold">Registro de Segundas Subcategorías</h1>
                <p className="text-sm text-gray-500">
                    Seleccione una subcategoría y rellene el campo del formulario para registrar las
                    segundas subcategorías.
                </p>
            </div>

            {/* Formulario */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-lg space-y-6">
                    {/* Select de Subcategorías */}
                    <FormField
    control={form.control}
    name="subcategory"
    render={({ field }) => (
        <FormItem>
            <FormLabel>Subcategoría:</FormLabel>
            <Select
                onValueChange={(value) => {
                    handleSubcategoryChange(value); // Actualizar el estado del ID seleccionado
                    field.onChange(value); // Actualizar el valor del formulario
                }}
                value={field.value} // Asegurar que el valor del formulario se mantenga sincronizado
            >
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione una subcategoría" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.name}>
                            {subcategory.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <FormMessage />
        </FormItem>
    )}
/>


                    {/* Input de Segundas Subcategorías */}
                    <FormField
                        control={form.control}
                        name="secondSubcategories"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Nombre de las Segundas Subcategorías (separadas por comas):
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Introduzca los nombres de las segundas subcategorías separados por comas"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Botón de envío */}
                    <Button type="submit" className="w-full">
                        Registrar
                    </Button>
                </form>
            </Form>

            {/* Card de segundas subcategorías */}
            {secondSubcategories.length > 0 && (
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle>
                            Segundas Subcategorías de la Subcategoría Seleccionada
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {secondSubcategories.map((secondSubCat) => (
                                <div
                                    key={secondSubCat.id}
                                    className="rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-700"
                                >
                                    {secondSubCat.name}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Modal de éxito */}
            <Dialog open={showSuccessModal} onOpenChange={handleCloseSuccessModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Segundas Subcategorías Creadas</DialogTitle>
                    </DialogHeader>
                    <div>Segundas subcategorías creadas con éxito.</div>
                    <DialogFooter>
                        <Button onClick={handleConfirmSuccessModal}>Aceptar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
