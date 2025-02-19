"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { countSubCats } from "../readsubcat.action";
import { registerAction, updateSubCategoryAction } from "./subcat.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  subcategories: z
    .string({ required_error: "El nombre de la subcategoría es requerido" })
    .min(1, { message: "El nombre de la subcategoría es requerido" }),
});



interface SubCatFormProps {
  subcategoryData?: {
      id: number;
      name: string;
      variableId: number;
  };
  categoryId: number;
  onSuccess?: () => void;
}
type FormSchemaData = z.infer<typeof formSchema>;

export function SubCatForm({ subcategoryData, onSuccess }: SubCatFormProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<FormSchemaData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      subcategories: subcategoryData ? subcategoryData.name : "",
    },
  });

  async function onSubmit(data: FormSchemaData) {
    setGlobalError(null);

    if (subcategoryData?.id) {
      try {
        const response = await updateSubCategoryAction(subcategoryData.id, data.subcategories);
        if (!response.success) {
          form.setError("subcategories", { message: response.error });
          return;
        }
        setShowSuccessModal(true);
      } catch (error) {
        form.setError("subcategories", { message: `Error al actualizar: ${error}` });
      }
    } else {
      try {
        const response = await registerAction({
          name: data.subcategories,
          categoryId: 0
        });
        if (!response.success) {
          form.setError("subcategories", { message: response.error });
          return;
        }
        setShowSuccessModal(true);
      } catch (error) {
        form.setError("subcategories", { message: `Error al registrar: ${error}` });
      }
    }
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    form.reset({ subcategories: "" });
    setGlobalError(null);
    router.refresh();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="flex justify-center py-2">
      <div className="w-7/12 space-y-7 rounded-sm bg-white py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            {subcategoryData ? "Editar Subcategoría" : "Registro de Subcategoría"}
          </h1>
          <p className="text-sm text-gray-500">
            {subcategoryData
              ? "Modifique el nombre de la subcategoría."
              : "Complete el campo para registrar la subcategoría."}
          </p>
        </div>
        <div className="flex justify-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-lg space-y-6">
              <FormField
                control={form.control}
                name="subcategories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la Subcategoría:</FormLabel>
                    <Input {...field} placeholder="Ingrese el nombre de la subcategoría" />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {subcategoryData ? "Actualizar" : "Registrar"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <Dialog open={showSuccessModal} onOpenChange={handleCloseSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {subcategoryData ? "Subcategoría Actualizada" : "Subcategoría Creada"}
            </DialogTitle>
          </DialogHeader>
          <div>
            {subcategoryData
              ? "La subcategoría ha sido actualizada con éxito."
              : "Subcategoría creada con éxito."}
          </div>
          <DialogFooter>
            <Button onClick={handleCloseSuccessModal}>Aceptar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
