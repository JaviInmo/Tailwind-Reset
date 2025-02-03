"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { fetchVariables, registerAction } from "./cat.action";
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
    const [variables, setVariables] = useState<{ id: number; name: string }[]>([]);
    const [selectedVariableId, setSelectedVariableId] = useState<number | null>(null);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<FormSchemaData>({
        resolver: zodResolver(formSchema),
        mode: "onTouched",
    });

    useEffect(() => {
        const fetchData = async () => {
            const vars = await fetchVariables();
            setVariables(vars);
        };

        fetchData();
    }, []);

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

        setGlobalError(null);

        const categoriesArray = data.categories.split(",").map((name) => name.trim());
        let allSuccess = true;

        for (const category of categoriesArray) {
            const response = await registerAction({
                variableId: selectedVariableId,
                name: category,
            });

            if (!response.success) {
                setGlobalError(response.error || `Error al registrar la categoría "${category}"`);
                allSuccess = false;
                break;
            }
        }

        if (allSuccess) {
            setShowSuccessModal(true);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        form.reset({
            variable: "",
            categories: "",
        });
        setSelectedVariableId(null);
        setGlobalError(null);
    };

    return (
        <div className="flex justify-center py-2">
            <div className="w-7/12 space-y-7 rounded-sm bg-white py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold">Registro de Categorías</h1>
                    <p className="text-sm text-gray-500">
                        Seleccione una variable y rellene el campo del formulario para registrar las
                        categorías.
                    </p>
                </div>

                <div className="flex justify-center">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-full max-w-lg space-y-6"
                        >
                            {/* Select de Variables */}
                            <FormField
                                control={form.control}
                                name="variable"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Variable:</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                handleVariableChange(value);
                                            }}
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
                                                        value={variable.name}
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

                            {/* Mostrar error global */}
                            {globalError && (
                                <div className="text-center text-sm text-red-500">
                                    {globalError}
                                </div>
                            )}

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
                        <DialogTitle>Categorías Creadas</DialogTitle>
                    </DialogHeader>
                    <div>Categorías creadas con éxito.</div>
                    <DialogFooter>
                        <Button onClick={handleCloseSuccessModal}>Aceptar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
