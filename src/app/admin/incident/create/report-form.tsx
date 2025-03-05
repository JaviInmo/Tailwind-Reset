"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { registerAction } from "./form.action";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    fecha: z.string().date("Fecha es requerido"),
    provincia: z
        .string({ required_error: "Provincia es requerido" })
        .min(1, { message: "Provincia es requerido" }),
    municipio: z
        .string({ required_error: "Municipio es requerido" })
        .min(1, { message: "Municipio es requerido" }),
    variable: z.coerce.number({ required_error: "Variable es requerido" }),
    categoria: z.coerce.number({ required_error: "Categoría es requerido" }),
    subcategoria: z.coerce.number({ required_error: "Subcategoría es requerido" }),
    segundasubcategoria: z.coerce.number().optional(),
    amount: z.coerce.number().min(0.01, { message: "Toneladas debe ser mayor a 0.01" }),
    numberOfPeople: z.coerce
        .number()
        .min(0, { message: "El número de personas no puede ser negativo" }), // Nuevo campo
    description: z
        .string({ required_error: "Descripción es requerido" })
        .min(1, { message: "Descripción es requerido" }),
});

type FormSchemaData = z.infer<typeof formSchema>;

type ReportFormProps = {
    incidentData?: Prisma.IncidentGetPayload<true> & { numberOfPeople?: number };
    provinceData: Array<Prisma.ProvinceGetPayload<{ include: { municipalities: true } }>>;
    variableData: Array<
        Prisma.VariableGetPayload<{
            include: {
                categories: {
                    include: {
                        subcategories: {
                            include: { secondSubcategories: true };
                        };
                    };
                };
            };
        }>
    >;
};

export function ReportForm({ incidentData, variableData, provinceData }: ReportFormProps) {
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setError,
        reset,
        control,
        formState: { errors },
    } = useForm<FormSchemaData>({
        resolver: zodResolver(formSchema),
        mode: "onTouched",
        defaultValues: {
            fecha:
                incidentData ? new Date(incidentData.date).toISOString().split("T")[0] : undefined,
            amount: incidentData?.amount ?? undefined,
            numberOfPeople: incidentData?.numberOfPeople ?? 0, // Valor por defecto para número de personas
            categoria: incidentData?.categoryId ?? undefined,
            subcategoria: incidentData?.subcategoryId ?? undefined,
            segundasubcategoria: incidentData?.secondSubcategoryId ?? undefined,
            variable: incidentData?.variableId,
            provincia: incidentData?.provinceId,
            municipio: incidentData?.municipalityId,
            description: incidentData?.description,
        },
    });

    console.log("errors", errors);

    async function onSubmit(data: FormSchemaData) {
        console.log("Datos enviados:", data);
        const response = await registerAction({
            categoryId: data.categoria,
            subcategoryId: data.subcategoria,
            secondSubcategoryId: data.segundasubcategoria,
            variableId: data.variable,
            amount: data.amount,
            date: new Date(data.fecha),
            numberOfPeople: data.numberOfPeople, // Se envía el número de personas
            description: data.description,
            municipalityId: data.municipio,
            provinceId: data.provincia,
        });
        if (!response.success) {
            return setError("root", { message: "Incidencia ya registrada" });
        }
        reset();
        setShowSuccessModal(true);
    }

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
    };
    const watchedProvince = watch("provincia");
    const variableId = watch("variable");
    const categoryId = watch("categoria");
    const subcategoryId = watch("subcategoria");

    const variableOptions = variableData.find((v) => v.id === +variableId);
    const municipalityOptions = provinceData.find((p) => p.id === watchedProvince)?.municipalities;
    const subcategoriesOptions = variableOptions?.categories?.find(
        (c) => c.id === +categoryId,
    )?.subcategories;
    const secondSubcategoriesOptions = subcategoriesOptions?.find(
        (sc) => sc.id === +subcategoryId,
    )?.secondSubcategories;

    const [provinceId, setProvinceId] = useState("");

    console.log("watchedProvince", watchedProvince);

    useEffect(() => {
        setProvinceId(watchedProvince);
    }, [watchedProvince]);

    return (
        <div className="flex h-full w-full items-center justify-center overflow-y-auto py-0">
            <div className="flex h-full w-full flex-col items-center justify-center rounded bg-white py-2  shadow-sm">
                <div className="text-center pb-4">
                    <p className="font-semibold">Formulario de Incidencias</p>
                    <p className="font-semibold">
                        Rellene los campos del formulario para registrar la incidencia.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex max-h-[calc(100vh-150px)] w-full flex-col gap-2 overflow-y-auto px-4 pt-2 lg:w-11/12"
                >
                    <div className="pb-4">
                        <Label className="block pb-2">Fecha:</Label>
                        <Input
                            type="date"
                            {...register("fecha")}
                            className="w-full rounded border border-gray-300 bg-white p-2"
                        />
                        {errors.fecha && <p className="text-red-600">{errors.fecha.message}</p>}
                    </div>

                    <div className="flex gap-4 pb-2">
                        <div className="w-full">
                            <Label className="block pb-2">Provincia:</Label>
                            <Controller
                                control={control}
                                name="provincia"
                                render={({ field: { onChange, value } }) => (
                                    <Select onValueChange={onChange} value={value}>
                                        <SelectTrigger className="w-full rounded border border-gray-300 bg-white p-2">
                                            <SelectValue placeholder="Seleccionar provincia" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {provinceData.map((opt) => (
                                                    <SelectItem key={opt.id} value={opt.id}>
                                                        {opt.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.provincia && (
                                <p className="text-red-600">{errors.provincia.message}</p>
                            )}
                        </div>
                        <div className="w-full">
                            <Label className="block pb-2">Municipio:</Label>
                            <Controller
                                control={control}
                                name="municipio"
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        onValueChange={onChange}
                                        value={value}
                                        disabled={!provinceId}
                                    >
                                        <SelectTrigger className="w-full rounded border border-gray-300 bg-white p-2 disabled:bg-slate-300">
                                            <SelectValue placeholder="Seleccionar Municipio" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {municipalityOptions?.map((opt) => (
                                                    <SelectItem key={opt.id} value={opt.id}>
                                                        {opt.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.municipio && (
                                <p className="text-red-600">{errors.municipio.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 pb-2">
                        <div className="w-full">
                            <Label className="block pb-2">Variable:</Label>
                            <Controller
                                control={control}
                                name="variable"
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        onValueChange={onChange}
                                        value={value ? value.toString() : ""}
                                    >
                                        <SelectTrigger className="w-full rounded border border-gray-300 bg-white p-2">
                                            <SelectValue placeholder="Seleccionar variable" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {variableData.map((opt) => (
                                                    <SelectItem
                                                        key={opt.id}
                                                        value={opt.id.toString()}
                                                    >
                                                        {opt.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.variable && (
                                <p className="text-red-600">{errors.variable.message}</p>
                            )}
                        </div>

                        <div className="w-full">
                            <Label className="block pb-2">Categoría:</Label>
                            <Controller
                                control={control}
                                name="categoria"
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        onValueChange={onChange}
                                        value={value ? value.toString() : ""}
                                        disabled={!variableId}
                                    >
                                        <SelectTrigger className="w-full rounded border border-gray-300 bg-white p-2 text-black disabled:bg-slate-300">
                                            <SelectValue placeholder="Seleccionar categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {variableOptions?.categories?.map((opt) => (
                                                    <SelectItem
                                                        key={opt.id}
                                                        value={opt.id.toString()}
                                                    >
                                                        {opt.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.categoria && (
                                <p className="text-red-600">{errors.categoria.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 pb-2">
                        <div className="w-full">
                            <Label className="block pb-2">Subcategoría:</Label>
                            <Controller
                                control={control}
                                name="subcategoria"
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        onValueChange={onChange}
                                        value={value ? value.toString() : ""}
                                        disabled={!categoryId}
                                    >
                                        <SelectTrigger className="w-full rounded border border-gray-300 bg-white p-2 text-black disabled:bg-slate-300">
                                            <SelectValue placeholder="Seleccionar subcategoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {subcategoriesOptions?.map((opt) => (
                                                    <SelectItem
                                                        key={opt.id}
                                                        value={opt.id.toString()}
                                                    >
                                                        {opt.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.subcategoria && (
                                <p className="text-red-600">{errors.subcategoria.message}</p>
                            )}
                        </div>

                        <div className="w-full">
                            <Label className="block pb-2">Segunda Subcategoría:</Label>
                            <Controller
                                control={control}
                                name="segundasubcategoria"
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        onValueChange={onChange}
                                        value={value ? value.toString() : ""}
                                        disabled={!categoryId}
                                    >
                                        <SelectTrigger className="w-full rounded border border-gray-300 bg-white p-2 text-black disabled:bg-slate-300">
                                            <SelectValue placeholder="Seleccionar segundasubcategoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {secondSubcategoriesOptions?.map((opt) => (
                                                    <SelectItem
                                                        key={opt.id}
                                                        value={opt.id.toString()}
                                                    >
                                                        {opt.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.segundasubcategoria && (
                                <p className="text-red-600">{errors.segundasubcategoria.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 pb-2">
                        <div className="w-full">
                            <Label className="block pb-2">Toneladas:</Label>
                            <Input
                                type="number"
                                step="0.01"
                                {...register("amount")}
                                className="w-full rounded border border-gray-300 bg-white p-2"
                            />
                            {errors.amount && (
                                <p className="text-red-600">{errors.amount.message}</p>
                            )}
                        </div>

                        <div className="w-full">
                            <Label className="block pb-2">No de Personas:</Label>
                            <Input
                                type="number"
                                {...register("numberOfPeople")}
                                className="w-full rounded border border-gray-300 bg-white p-2"
                                min={0}
                            />
                            {errors.numberOfPeople && (
                                <p className="text-red-600">{errors.numberOfPeople.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="pb-4">
                        <Label className="block pb-2">Descripción:</Label>
                        <Textarea
                            {...register("description")}
                            className="w-full rounded border border-gray-300 bg-white p-2"
                        ></Textarea>
                        {errors.description && (
                            <p className="text-red-600">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            className="w-1/4 rounded border-slate-700 bg-slate-800 py-2 text-slate-100 hover:bg-slate-950"
                        >
                            Crear Incidencia
                        </Button>
                    </div>
                </form>

                {showSuccessModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="mx-auto w-11/12 max-w-md rounded-lg bg-white p-4 shadow-lg">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="text-xl font-semibold">Incidencia Creada</h3>
                                <button
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={handleCloseSuccessModal}
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="py-4">
                                <p>Incidencia creada con éxito.</p>
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button
                                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                    onClick={handleCloseSuccessModal}
                                >
                                    Aceptar
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
