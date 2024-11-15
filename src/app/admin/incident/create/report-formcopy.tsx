/* eslint-disable @typescript-eslint/ban-types */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerAction } from "./form.action";

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
    description: z
        .string({ required_error: "Descripción es requerido" })
        .min(1, { message: "Descripción es requerido" }),
});

type FormSchemaData = z.infer<typeof formSchema>;

type ReportFormProps = {
    incidentData?: Prisma.IncidentGetPayload<{}>;
    provinceData: Array<Prisma.ProvinceGetPayload<{ include: { municipalities: true } }>>;
    variableData: Array<
        Prisma.VariableGetPayload<{
            include: {
                categories: {
                    include: {
                        subcategories: {
                            include: { secondSubcategories: true }; // Agregar segunda subcategoría aquí
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
        formState: { errors },
    } = useForm<FormSchemaData>({
        resolver: zodResolver(formSchema),
        mode: "onTouched",
        defaultValues: {
            fecha:
                incidentData ? new Date(incidentData.date).toISOString().split("T")[0] : undefined,
            amount: incidentData?.amount ?? undefined,
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

    const provinceId = watch("provincia");
    const variableId = watch("variable");
    const categoryId = watch("categoria");
    const subcategoryId = watch("subcategoria");

    const variableOptions = variableData.find((v) => v.id === +variableId);
    const municipalityOptions = provinceData.find((p) => p.id === provinceId)?.municipalities;
    const subcategoriesOptions = variableOptions?.categories?.find(
        (c) => c.id === +categoryId,
    )?.subcategories;
    const secondSubcategoriesOptions = subcategoriesOptions?.find(
        (sc) => sc.id === +subcategoryId,
    )?.secondSubcategories;

    return (
        <div className="flex h-full flex-col items-center justify-center p-4 shadow-lg">
            <div className="text-center">
                <p className="font-semibold">Formulario de Incidencias</p>
                <p className="font-semibold">
                    Rellene los campos del formulario para registrar la incidencia.
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex h-full w-full flex-col gap-2 overflow-y-auto px-2 py-2 lg:h-auto lg:w-8/12"
            >
                <div className="pb-4">
                    <label className="block">Fecha:</label>
                    <input
                        type="date"
                        {...register("fecha")}
                        className="w-full rounded border border-gray-300 p-2"
                    />
                    {errors.fecha && <p className="text-red-600">{errors.fecha.message}</p>}
                </div>

                <div className="flex gap-4 pb-4">
                    <div className="w-full">
                        <label className="block">Provincia:</label>
                        <select
                            {...register("provincia")}
                            className="w-full rounded border border-gray-300 p-2"
                        >
                            <option value="">Seleccionar provincia</option>
                            {provinceData.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.name}
                                </option>
                            ))}
                        </select>
                        {errors.provincia && (
                            <p className="text-red-600">{errors.provincia.message}</p>
                        )}
                    </div>

                    <div className="w-full">
                        <label className="block">Municipio:</label>
                        <select
                            {...register("municipio")}
                            disabled={!provinceId}
                            className="w-full rounded border border-gray-300 p-2 text-black disabled:bg-slate-300"
                        >
                            <option value="">Seleccionar municipio</option>
                            {municipalityOptions?.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.name}
                                </option>
                            ))}
                        </select>
                        {errors.municipio && (
                            <p className="text-red-600">{errors.municipio.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex gap-4 pb-4">
                    <div className="w-full">
                        <label className="block">Variable:</label>
                        <select
                            {...register("variable")}
                            className="w-full rounded border border-gray-300 p-2"
                        >
                            <option value="">Seleccionar variable</option>
                            {variableData.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.name}
                                </option>
                            ))}
                        </select>
                        {errors.variable && (
                            <p className="text-red-600">{errors.variable.message}</p>
                        )}
                    </div>

                    <div className="w-full">
                        <label className="block">Categoría:</label>
                        <select
                            {...register("categoria")}
                            disabled={!variableId}
                            className="w-full rounded border border-gray-300 p-2 text-black disabled:bg-slate-300"
                        >
                            <option value="">Seleccionar categoría</option>
                            {variableOptions?.categories?.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoria && (
                            <p className="text-red-600">{errors.categoria.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex gap-4 pb-4">
                    <div className="w-full">
                        <label className="block">Subcategoría:</label>
                        <select
                            {...register("subcategoria")}
                            disabled={!categoryId}
                            className="w-full rounded border border-gray-300 p-2 text-black disabled:bg-slate-300"
                        >
                            <option value="">Seleccionar subcategoría</option>
                            {subcategoriesOptions?.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.name}
                                </option>
                            ))}
                        </select>
                        {errors.subcategoria && (
                            <p className="text-red-600">{errors.subcategoria.message}</p>
                        )}
                    </div>

                    <div className="w-full">
                        <label className="block">Segunda Subcategoría:</label>
                        <select
                            {...register("segundasubcategoria")}
                            disabled={!subcategoryId}
                            className="w-full rounded border border-gray-300 p-2 text-black disabled:bg-slate-300"
                        >
                            <option value="">Seleccionar segunda subcategoría</option>
                            {secondSubcategoriesOptions?.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.name}
                                </option>
                            ))}
                        </select>
                        {errors.segundasubcategoria && (
                            <p className="text-red-600">{errors.segundasubcategoria.message}</p>
                        )}
                    </div>
                </div>

                <div className="pb-4">
                    <label className="block">Toneladas:</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register("amount")}
                        className="w-full rounded border border-gray-300 p-2"
                    />
                    {errors.amount && <p className="text-red-600">{errors.amount.message}</p>}
                </div>

                <div className="pb-4">
                    <label className="block">Descripción:</label>
                    <textarea
                        {...register("description")}
                        className="w-full rounded border border-gray-300 p-2"
                    ></textarea>
                    {errors.description && (
                        <p className="text-red-600">{errors.description.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="rounded border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 hover:bg-slate-950"
                >
                    Crear Incidencia
                </button>
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
                            <button
                                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                onClick={handleCloseSuccessModal}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
