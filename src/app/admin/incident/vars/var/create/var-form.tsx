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
import { registerAction, updateVariableAction } from "./var.action";

const formSchema = z.object({
  names: z
    .string({ required_error: "Nombre de la variable es requerido" })
    .min(1, { message: "Nombre de la variable es requerido" }),
});

interface VariableFormProps {
  variableData?: {
    id: number;
    name: string;
    categories: {
      id: number;
      name: string;
      variableId: number;
      subcategories: {
        id: number;
        name: string;
        categoryId: number;
      }[];
    }[];
  };
  // Prop opcional para notificar al componente padre y cerrar el modal de edición
  onSuccess?: () => void;
}

type FormSchemaData = z.infer<typeof formSchema>;

export function VariableForm({ variableData, onSuccess }: VariableFormProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<FormSchemaData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      names: variableData?.name || "",
    },
  });

  useEffect(() => {
    if (variableData) {
      form.reset({ names: variableData.name });
    }
  }, [variableData, form]);

  async function onSubmit(data: FormSchemaData) {
    setGlobalError(null);

    if (variableData?.id) {
      // Actualizar variable existente
      try {
        const response = await updateVariableAction(variableData.id, data.names);

        if (!response.success) {
          form.setError("names", { message: response.error });
          return;
        }
        setShowSuccessModal(true);
      } catch (error) {
        form.setError("names", { message: `Error al actualizar: ${error}` });
      }
    } else {
      // Crear nueva variable
      const namesArray = data.names.split(",").map((name) => name.trim());
      let allSuccess = true;

      for (const name of namesArray) {
        try {
          const response = await registerAction({ name });

          if (!response.success) {
            form.setError("names", { message: response.error });
            allSuccess = false;
            break;
          }
        } catch (error) {
          form.setError("names", { message: `Error al registrar: ${error}` });
          allSuccess = false;
        }
      }

      if (allSuccess) {
        setShowSuccessModal(true);
      }
    }
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    form.reset({ names: "" });
    setGlobalError(null);
    router.refresh(); // Refresca la tabla tras la edición o creación
    if (onSuccess) onSuccess(); // Notifica al componente padre para cerrar el modal de edición
  };

  return (
    <div className="flex justify-center py-2">
      <div className="w-7/12 bg-white space-y-7 py-8 rounded-sm">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            {variableData?.id ? "Editar Variable" : "Registro de Variable"}
          </h1>
          <p className="text-sm text-gray-500">
            {variableData?.id
              ? "Modifique el nombre de la variable."
              : "Rellene el campo del formulario para registrar la variable."}
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
                    <FormLabel>Nombre de la Variable:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Introduzca el nombre de la variable"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {globalError && (
                <div className="text-red-500 text-sm text-center">
                  {globalError}
                </div>
              )}
              <Button type="submit" className="w-full">
                {variableData?.id ? "Actualizar" : "Registrar"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Modal de Éxito */}
      <Dialog open={showSuccessModal} onOpenChange={handleCloseSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {variableData?.id ? "Variable Actualizada" : "Variable Creada"}
            </DialogTitle>
            <DialogDescription>
              {variableData?.id
                ? "La variable ha sido actualizada con éxito."
                : "Variable creada con éxito."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCloseSuccessModal}>Aceptar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
