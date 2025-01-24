"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { countCats } from "../readcat.action";
import { fetchCategoriesByVariable, fetchVariables, registerAction } from "./cat.action";
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
    variable: z.string({ required_error: "Variable es requerida" }),
    categories: z
        .string({ required_error: "Categorías no pueden estar vacías" })
        .min(1, { message: "Categorías no pueden estar vacías" }),
});

type FormSchemaData = z.infer<typeof formSchema>;

export function CatForm() {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [initialCount, setInitialCount] = useState<number | null>(null);
    const [variables, setVariables] = useState<{ id: number; name: string }[]>([]);
    const [selectedVariableId, setSelectedVariableId] = useState<number | null>(null);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const router = useRouter();

    const form = useForm<FormSchemaData>({
        resolver: zodResolver(formSchema),
        mode: "onTouched",
    });

    useEffect(() => {
        const fetchData = async () => {
            const vars = await fetchVariables();
            setVariables(vars);

            const count = await countCats();
            setInitialCount(count);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedVariableId) {
            const fetchCategories = async () => {
                const cats = await fetchCategoriesByVariable(selectedVariableId);
                setCategories(cats);
            };

            fetchCategories();
        } else {
            setCategories([]);
        }
    }, [selectedVariableId]);

    const handleVariableChange = (value: string) => {
        const selectedVariable = variables.find((v) => v.name === value);
        if (selectedVariable) {
            setSelectedVariableId(selectedVariable.id);
        }
    };

    const onSubmit: SubmitHandler<FormSchemaData> = async (data) => {
        if (!selectedVariableId) {
            form.setError("variable", { message: "Debe seleccionar una variable válida" });
            return;
        }

        const categoriesArray = data.categories.split(",").map((name) => name.trim());
        let allSuccess = true;

        for (const category of categoriesArray) {
            const response = await registerAction({
                variableId: selectedVariableId,
                name: category,
            });
            if (!response.success) {
                form.setError("root", { message: `Categoría "${category}" ya registrada` });
                allSuccess = false;
            }
        }

        if (allSuccess) {
            const newCount = await countCats();

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
        router.push("/admin/incident/vars/cat");
    };

    return (
        
        <div className="flex justify-center gap-6 py-8">
            {/* Encabezado */}
            <div className="w-7/12 bg-white space-y-6 py-8 rounded-sm">            
                <div className="text-center">
                    <h1 className="text-2xl font-semibold">Registro de Categorías</h1>
                    <p className="text-sm text-gray-500">
                        Seleccione una variable y rellene el campo del formulario para registrar las
                        categorías.
                    </p>
                </div>

                <div className="flex justify-center">
                    {/* Formulario */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-lg space-y-6">
                            {/* Select de Variables */}
                            <FormField
                                control={form.control}
                                name="variable"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Variable:</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value); // Actualiza el estado en React Hook Form
                                                handleVariableChange(value); // Actualiza el estado local si es necesario
                                            }}
                                            value={field.value}> {/* Asegura que el valor sea controlado */}
                                            
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione una variable" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {variables.map((variable) => (
                                                    <SelectItem key={variable.id} value={variable.name}>
                                                        {variable.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            {/* Input de Categorías */}
                            <FormField
                                control={form.control}
                                name="categories"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Nombre de las Categorías (separadas por comas):
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Introduzca las categorías separadas por comas"
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
                </div>

                {/* Card de categorías */}
{/*                 {categories.length > 0 && (
                    <Card className="w-full max-w-lg">
                        <CardHeader>
                            <CardTitle>Categorías de la Variable Seleccionada</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        className="rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-700"
                                    >
                                        {cat.name}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )} */}
            </div>

            {/* Modal de éxito */}
            <Dialog open={showSuccessModal} onOpenChange={handleCloseSuccessModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Categorías Creadas</DialogTitle>
                    </DialogHeader>
                    <div>Categorías creadas con éxito.</div>
                    <DialogFooter>
                        <Button onClick={handleConfirmSuccessModal}>Aceptar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
