"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { countSubCats } from "../readsubcat.action";
import { fetchCategory, fetchSubCategoriesByCategory, registerAction } from "./subcat.action";
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
    category: z.string({ required_error: "Categoría es requerida" }),
    subcategories: z
        .string({ required_error: "Subcategorías no pueden estar vacías" })
        .min(1, { message: "Subcategorías no pueden estar vacías" }),
});

type FormSchemaData = z.infer<typeof formSchema>;

export function SubCatForm() {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [initialCount, setInitialCount] = useState<number | null>(null);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [subcategories, setSubcategories] = useState<{ id: number; name: string }[]>([]);
    const router = useRouter();
    const [globalError, setGlobalError] = useState<string | null>(null);

    const form = useForm<FormSchemaData>({
        resolver: zodResolver(formSchema),
        mode: "onTouched",
    });

    useEffect(() => {
        const fetchData = async () => {
            const cats = await fetchCategory();
            setCategories(cats);
            const count = await countSubCats();
            setInitialCount(count);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCategoryId) {
            const fetchSubCategories = async () => {
                const subCats = await fetchSubCategoriesByCategory(selectedCategoryId);
                setSubcategories(subCats);
            };
            fetchSubCategories();
        } else {
            setSubcategories([]);
        }
    }, [selectedCategoryId]);

    const handleCategoryChange = (value: string) => {
        const selectedCategory = categories.find((c) => c.name === value);
        if (selectedCategory) {
            setSelectedCategoryId(selectedCategory.id);
        }
    };

    const onSubmit: SubmitHandler<FormSchemaData> = async (data) => {
        if (!selectedCategoryId) {
            form.setError("category", { message: "Debe seleccionar una categoría válida" });
            return;
        }

        const subcategoriesArray = data.subcategories.split(",").map((name) => name.trim());
        let allSuccess = true;

        for (const subcategory of subcategoriesArray) {
            const response = await registerAction({
                categoryId: selectedCategoryId,
                name: subcategory,
            });

            if (!response.success) {
                form.setError("subcategories", { message: response.error ?? "Error desconocido" });
                allSuccess = false;
            }
        }

        if (allSuccess) {
            const newCount = await countSubCats();
            if (initialCount !== null && newCount > initialCount) {
                setShowSuccessModal(true);
            } else {
                console.error("Error al actualizar la tabla después de la inserción");
            }
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        form.reset({
            category: "",
            subcategories: "",
        });
        setSelectedCategoryId(null);
        setGlobalError(null);
    };

    return (
        <div className="flex justify-center py-2">
            <div className="w-7/12 space-y-7 rounded-sm bg-white py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold">Registro de Subcategorías</h1>
                    <p className="text-sm text-gray-500">
                        Seleccione una categoría y rellene el campo del formulario para registrar
                        las subcategorías.
                    </p>
                </div>
                <div className="flex justify-center">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-full max-w-lg space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Categoría:</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                handleCategoryChange(value);
                                            }}
                                            value={field.value}
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
                                                        value={category.name}
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
                            {/* Input de SubCategorías */}
                            <FormField
                                control={form.control}
                                name="subcategories"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subcategorías:</FormLabel>
                                        <Input
                                            {...field}
                                            placeholder="Escriba las subcategorías separadas por coma"
                                            type="text"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">
                                Registrar
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
            <Dialog open={showSuccessModal} onOpenChange={handleCloseSuccessModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Subcategorías Creadas</DialogTitle>
                    </DialogHeader>
                    <div>Subcategorías creadas con éxito.</div>
                    <DialogFooter>
                        <Button onClick={handleCloseSuccessModal}>Aceptar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
