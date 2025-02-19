"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { countSecondSubCats } from "../readsecondsubcat.action";
import {
  fetchSubCategories,
  registerAction,
  updateSecondSubCategoryAction,
} from "./subcat.action";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  // El campo "subcategory" solo se usará en modo creación
  subcategory: z.string({ required_error: "Subcategoría es requerida" }),
  secondSubcategories: z
    .string({ required_error: "El nombre es requerido" })
    .min(1, { message: "El campo no puede estar vacío" }),
});

type FormSchemaData = z.infer<typeof formSchema>;

interface SecondSubCatFormProps {
  secondSubcategoryData?: {
    id: number;
    name: string;
    subcategoryId: number;
  };
  onSuccess?: () => void;
}

export function SecondSubCatForm({
  secondSubcategoryData,
  onSuccess,
}: SecondSubCatFormProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [subcategories, setSubcategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
  const router = useRouter();

  const form = useForm<FormSchemaData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      // En modo edición no se requiere el valor para "subcategory"
      subcategory: "",
      secondSubcategories: secondSubcategoryData ? secondSubcategoryData.name : "",
    },
  });

  // Se cargan las subcategorías para obtener el nombre del padre en modo edición o para la creación
  useEffect(() => {
    const fetchData = async () => {
      const subs = await fetchSubCategories();
      setSubcategories(subs);

      if (secondSubcategoryData) {
        const parent = subs.find((s) => s.id === secondSubcategoryData.subcategoryId);
        if (parent) {
          form.setValue("subcategory", parent.name);
          setSelectedSubcategoryId(parent.id);
        }
      }
    };

    fetchData();
  }, [secondSubcategoryData, form]);

  const handleSubcategoryChange = (value: string) => {
    if (!secondSubcategoryData) {
      const selected = subcategories.find((s) => s.name === value);
      if (selected) {
        setSelectedSubcategoryId(selected.id);
      }
    }
  };

  const onSubmit: SubmitHandler<FormSchemaData> = async (data) => {
    if (secondSubcategoryData?.id) {
      // Modo edición: solo se actualiza el nombre de la segunda subcategoría
      try {
        const response = await updateSecondSubCategoryAction(
          secondSubcategoryData.id,
          data.secondSubcategories
        );
        if (!response.success) {
          form.setError("secondSubcategories", { message: response.error });
          return;
        }
        setShowSuccessModal(true);
      } catch (error) {
        form.setError("secondSubcategories", { message: `Error al actualizar: ${error}` });
      }
    } else {
      // Modo creación: se requiere seleccionar la subcategoría padre
      if (!selectedSubcategoryId) {
        form.setError("subcategory", { message: "Debe seleccionar una subcategoría válida" });
        return;
      }

      const secondSubcategoriesArray = data.secondSubcategories
        .split(",")
        .map((name) => name.trim());
      let allSuccess = true;

      for (const secondSubcategory of secondSubcategoriesArray) {
        const response = await registerAction({
          subcategoryId: selectedSubcategoryId,
          name: secondSubcategory,
        });
        if (!response.success) {
          form.setError("secondSubcategories", {
            message: `La segunda subcategoría "${secondSubcategory}" ya existe para esta subcategoría.`,
          });
          allSuccess = false;
        }
      }

      if (allSuccess) {
        setShowSuccessModal(true);
      }
    }
  };

  const handleModalAccept = () => {
    setShowSuccessModal(false);
    form.reset();
    if (secondSubcategoryData) {
      router.refresh();
      if (onSuccess) onSuccess();
    } else {
      router.push("/admin/incident/vars/secondsubcat");
    }
  };

  return (
    <div className="flex justify-center py-2">
      <div className="w-7/12 space-y-7 rounded-sm bg-white py-8">
        {/* Encabezado */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            {secondSubcategoryData
              ? "Editar Segunda Subcategoría"
              : "Registro de Segundas Subcategorías"}
          </h1>
          <p className="text-sm text-gray-500">
            {secondSubcategoryData
              ? "Modifique el nombre de la segunda subcategoría."
              : "Seleccione una subcategoría y complete el campo para registrar segundas subcategorías."}
          </p>
        </div>

        {/* Formulario */}
        <div className="flex justify-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-lg space-y-6">
              {/* El selector de subcategorías solo se muestra en modo creación */}
              {!secondSubcategoryData && (
                <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategoría:</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          handleSubcategoryChange(value);
                          field.onChange(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una subcategoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subcategories.map((subcategory) => (
                            <SelectItem key={subcategory.id} value={subcategory.name}>
                              {subcategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Campo para el nombre de la segunda subcategoría */}
              <FormField
                control={form.control}
                name="secondSubcategories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la Segunda Subcategoría:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese el nombre de la segunda subcategoría"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {secondSubcategoryData ? "Actualizar" : "Registrar"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Modal de éxito */}
      <Dialog open={showSuccessModal} onOpenChange={handleModalAccept}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {secondSubcategoryData
                ? "Segunda Subcategoría Actualizada"
                : "Segundas Subcategorías Creadas"}
            </DialogTitle>
          </DialogHeader>
          <div>
            {secondSubcategoryData
              ? "La segunda subcategoría ha sido actualizada con éxito."
              : "Segundas subcategorías creadas con éxito."}
          </div>
          <DialogFooter>
            <Button onClick={handleModalAccept}>Aceptar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
