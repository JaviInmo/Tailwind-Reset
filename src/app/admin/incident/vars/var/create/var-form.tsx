"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { countVariables } from "../readvar.action";
import { registerAction } from "./var.action";

const formSchema = z.object({
    names: z
        .string({ required_error: "Nombre de la variable es requerido" })
        .min(1, { message: "Nombre de la variable es requerido" }),
});

type FormSchemaData = z.infer<typeof formSchema>;

interface VariableFormProps {
    variableData: {
        name: string;
        id: number;
        categories: {
            name: string;
            id: number;
            variableId: number;
            subcategories: {
                name: string;
                id: number;
                categoryId: number;
            }[];
        }[];
    };
}



export function VariableForm({ variableData }: VariableFormProps) {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [initialCount, setInitialCount] = useState<number | null>(null);
    const router = useRouter();
    const [globalError, setGlobalError] = useState<string | null>(null);

    const form = useForm<FormSchemaData>({
        resolver: zodResolver(formSchema),
        mode: "onTouched",
    });

    useEffect(() => {
        const fetchInitialCount = async () => {
            const count = await countVariables();
            setInitialCount(count);
        };

        fetchInitialCount();
    }, []);

    

    async function onSubmit(data: FormSchemaData) {
        const namesArray = data.names.split(",").map((name) => name.trim());
        let allSuccess = true;

        // Limpiamos el error global antes de intentar registrar las variables
        setGlobalError(null);
    
        for (const name of namesArray) {
            try {
                const response = await registerAction({ name });

                // Verificamos si hubo error en la respuesta
                if (!response.success) {
                    form.setError("names", { message: response.error });
                    allSuccess = false;
                    break; // Salimos del bucle si hay un error
                }
            } catch (error) {
                form.setError("names", { message: `Error al registrar: ${error}` });
                allSuccess = false;
            }
        }
    
        if (allSuccess) {
            const newCount = await countVariables();
    
            if (initialCount !== null && newCount > initialCount) {
                setShowSuccessModal(true);
            } else {
                console.error("Error al actualizar la tabla después de la inserción");
            }
        }
    }

   

  const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        form.reset({
            names: "",

        });
       
        setGlobalError(null);
    };

    return (
        <div className="flex justify-center py-2 text-black">
            <div className="w-7/12 bg-white space-y-7 py-8 rounded-sm">
                <div className="text-center">
                    <h1 className=" text-2xl font-semibold ">Registro de Variable</h1>
                   
                    <p className=" text-sm text-gray-500">
                        Rellene el campo del formulario a continuación para registrar la variable.
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
                                name="names"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Nombre de las Variables (separadas por comas):
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Introduzca los nombres de las variables separados por comas"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Mostrar error global */}
                            {globalError && (
                                <div className="text-red-500 text-sm text-center">{globalError}</div>
                            )}
                            <Button type="submit" className="w-full">
                                Registrar
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>

            {/* Modal de Éxito */}
            <Dialog open={showSuccessModal} onOpenChange={handleCloseSuccessModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Variable Creada</DialogTitle>
                        <DialogDescription>Variable creada con éxito.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleCloseSuccessModal}>Aceptar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}