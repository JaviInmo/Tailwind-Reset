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

import { countVariables } from "../readvar.action";
import { registerAction, updateAction } from "./var.action";

const formSchema = z.object({
  names: z
    .string({ required_error: "Nombre de la variable es requerido" })
    .min(1, { message: "Nombre de la variable es requerido" }),
});

type FormSchemaData = z.infer<typeof formSchema>;

interface VariableFormProps {
  variableData?: {
    id: number;
    name: string;
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
  const [globalError, setGlobalError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormSchemaData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      names: variableData?.name ?? "",
    },
  });

  // Para el modal de creación múltiple
  useEffect(() => {
    const fetchInitialCount = async () => {
      const count = await countVariables();
      setInitialCount(count);
    };
    fetchInitialCount();
  }, []);

  async function onSubmit(data: FormSchemaData) {
    const raw = data.names.trim();
    setGlobalError(null);

    if (variableData) {
      // ——— MODO EDICIÓN ———
      try {
        const resp = await updateAction({ id: variableData.id, name: raw });
        if (!resp.success) {
          form.setError("names", { message: resp.error });
          return;
        }
        setShowSuccessModal(true);
      } catch (error) {
        form.setError("names", { message: `Error al actualizar: ${error}` });
      }
    } else {
      // ——— MODO CREACIÓN ———
      const namesArray = raw.split(",").map((n) => n.trim()).filter(Boolean);
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
          break;
        }
      }
      if (allSuccess) {
        const newCount = await countVariables();
        if (initialCount !== null && newCount > initialCount) {
          setShowSuccessModal(true);
        } else {
          console.error(
            "Error al actualizar la tabla después de la inserción"
          );
        }
      }
    }
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    if (variableData) {
      // Después de editar, redirige al listado
      router.push("/admin/incident/vars/var");
    } else {
      // Después de crear, limpia el formulario
      form.reset({ names: "" });
      setGlobalError(null);
    }
  };

  return (
    <div className="flex justify-center py-2 text-black">
      <div className="w-7/12 bg-white space-y-7 py-8 rounded-sm">
        <div className="text-center">
          <h1 className=" text-2xl font-semibold ">
            {variableData ? "Editar Variable" : "Registro de Variable"}
          </h1>
          <p className=" text-sm text-gray-500">
            {variableData
              ? "Modifique el nombre de la variable y guarde los cambios."
              : "Rellene el campo del formulario a continuación para registrar la variable."}
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
                      {variableData
                        ? "Nombre de la Variable:"
                        : "Nombre de las Variables (separadas por comas):"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          variableData
                            ? "Introduzca el nuevo nombre"
                            : "Introduzca los nombres de las variables separados por comas"
                        }
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
                {variableData
                  ? "Actualizar Variable"
                  : "Registrar Variable"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <Dialog open={showSuccessModal} onOpenChange={handleCloseSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {variableData ? "Variable Actualizada" : "Variable Creada"}
            </DialogTitle>
            <DialogDescription>
              {variableData
                ? "La variable se ha actualizado con éxito."
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
