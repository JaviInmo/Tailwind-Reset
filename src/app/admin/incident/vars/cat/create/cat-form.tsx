"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { fetchVariables, registerAction } from "./cat.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";

const formSchema = z.object({
    variableId: z
        .string({ required_error: "Variable es requerida" })
        .min(1, "Variable es requerida"),
    categories: z
        .string({ required_error: "Categorías no pueden estar vacías" })
        .min(1, { message: "Categorías no pueden estar vacías" }),
});

type FormSchemaData = z.infer<typeof formSchema>;

type CatFormProps = {
    initialVariables?: { id: number; name: string }[];
    initialCategories?: { id: number; name: string }[];
};

export function CatForm({ initialVariables = [], initialCategories = [] }: CatFormProps) {
    const router = useRouter();
    const [variables, setVariables] = useState<{ id: number; name: string }[]>(initialVariables);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormSchemaData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableId: "",
            categories: "",
        },
    });

    useEffect(() => {
        if (variables.length === 0) {
            const fetchVariablesData = async () => {
                const vars = await fetchVariables();
                setVariables(vars);
            };
            fetchVariablesData();
        }
    }, [variables.length]);

    const onSubmit = async (data: FormSchemaData) => {
        setIsLoading(true);
        setGlobalError(null);

        try {
            const variableId = Number.parseInt(data.variableId, 10);
            const categoriesArray = data.categories
                .split(",")
                .map((name) => name.trim())
                .filter(Boolean);

            if (categoriesArray.length === 0) {
                setGlobalError("Debe ingresar al menos una categoría válida");
                setIsLoading(false);
                return;
            }

            let allSuccess = true;
            for (const categoryName of categoriesArray) {
                const response = await registerAction({
                    variableId: variableId,
                    name: categoryName,
                });

                if (!response.success) {
                    setGlobalError(
                        response.error || `Error al registrar la categoría "${categoryName}"`,
                    );
                    allSuccess = false;
                    break;
                }
            }

            if (allSuccess) {
                setShowSuccessModal(true);
            }
        } catch (error) {
            setGlobalError(
                "Error al procesar el formulario: " +
                    (error instanceof Error ? error.message : String(error)),
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        form.reset();

        const fetchVariablesData = async () => {
            const vars = await fetchVariables();
            setVariables(vars);
        };

        fetchVariablesData().then(() => {
            router.back(); // Regresar a la página anterior
        });
    };

    return (
        <div className="flex justify-center py-2">
            <div className="w-full space-y-7 rounded-sm bg-white py-8">
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
                            <FormField
                                control={form.control}
                                name="variableId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Variable:</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
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

                            {globalError && (
                                <div className="rounded-md bg-red-50 p-3 text-center text-sm text-red-500">
                                    {globalError}
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Procesando..." : "Registrar"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>

            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
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
