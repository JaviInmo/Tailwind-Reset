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

export function VariableForm() {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [initialCount, setInitialCount] = useState<number | null>(null);
    const router = useRouter();

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

        for (const name of namesArray) {
            const response = await registerAction({ name });
            if (!response.success) {
                form.setError("root", { message: `Variable "${name}" ya registrada` });
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
        form.reset();
    };

    const handleConfirmSuccessModal = () => {
        setShowSuccessModal(false);
        form.reset();
        router.push("/admin/variables/createVars"); // Redirige a la ruta especificada
    };

    return (
        <div className="flex w-full flex-col items-center gap-4 py-4">
            <div className="text-center">
                <h1 className="hidden text-2xl font-semibold sm:block">Registro de Variable</h1>
                <h2 className="block text-xl font-semibold sm:hidden">Registro de Variable</h2>
                <p className="hidden text-lg text-muted-foreground sm:block">
                    Rellene el campo del formulario a continuación para registrar la variable.
                </p>
                <p className="block text-sm text-muted-foreground sm:hidden">
                    Rellene el campo del formulario a continuación para registrar la variable.
                </p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex w-full max-w-lg flex-col gap-4"
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

                    <Button type="submit" className="w-full">
                        Submit
                    </Button>
                </form>
            </Form>

            {/* Modal de Éxito */}
            <Dialog open={showSuccessModal} onOpenChange={handleCloseSuccessModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Variable Creada</DialogTitle>
                        <DialogDescription>Variable creada con éxito.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleConfirmSuccessModal}>Aceptar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
