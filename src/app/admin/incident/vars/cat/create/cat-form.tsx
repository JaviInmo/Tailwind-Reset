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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { registerAction, updateCategoryAction } from "./cat.action";

const formSchema = z.object({
  name: z
    .string({ required_error: "El nombre de la categoría es requerido" })
    .min(1, { message: "El nombre de la categoría es requerido" }),
});

interface CategoryFormProps {
  categoryData?: {
    id: number;
    name: string;
    variableId: number;
  };
  variableId: number;
  // Prop opcional que se ejecuta al cerrar el modal de éxito.
  onSuccess?: () => void;
}

type FormSchemaData = z.infer<typeof formSchema>;

export function CategoryForm({ categoryData, variableId, onSuccess }: CategoryFormProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<FormSchemaData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      name: categoryData?.name || "",
    },
  });

  useEffect(() => {
    if (categoryData) {
      form.reset({ name: categoryData.name });
    }
  }, [categoryData, form]);

  async function onSubmit(data: FormSchemaData) {
    setGlobalError(null);

    if (categoryData?.id) {
      try {
        const response = await updateCategoryAction(categoryData.id, data.name);
        if (!response.success) {
          form.setError("name", { message: response.error });
          return;
        }
        setShowSuccessModal(true);
      } catch (error) {
        form.setError("name", { message: `Error al actualizar: ${error}` });
      }
    } else {
      try {
        const response = await registerAction({ name: data.name, variableId });
        if (!response.success) {
          form.setError("name", { message: response.error });
          return;
        }
        setShowSuccessModal(true);
      } catch (error) {
        form.setError("name", { message: `Error al registrar: ${error}` });
      }
    }
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    form.reset({ name: "" });
    setGlobalError(null);
    router.refresh();
    // Llamamos a onSuccess para que el componente padre cierre el modal de edición.
    if (onSuccess) onSuccess();
  };

  return (
    <div className="flex justify-center py-2">
      <div className="w-7/12 bg-white space-y-7 py-8 rounded-sm">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            {categoryData?.id ? "Editar Categoría" : "Registro de Categoría"}
          </h1>
          <p className="text-sm text-gray-500">
            {categoryData?.id
              ? "Modifique el nombre de la categoría."
              : "Rellene el campo del formulario para registrar la categoría."}
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la Categoría:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Introduzca el nombre de la categoría"
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
                {categoryData?.id ? "Actualizar" : "Registrar"}
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
              {categoryData?.id ? "Categoría Actualizada" : "Categoría Creada"}
            </DialogTitle>
            <DialogDescription>
              {categoryData?.id
                ? "La categoría ha sido actualizada con éxito."
                : "Categoría creada con éxito."}
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
