"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { customSubmit } from "./form.action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

// Esquema del formulario utilizando zod
const formSchema = z.object({
    name: z.string().min(1, { message: "El nombre es obligatorio" }),
    province: z.string().min(1, { message: "La provincia es obligatoria" }),
    municipality: z.string().min(1, { message: "El municipio es obligatorio" }),
    personalPhone: z.string().min(1, { message: "El teléfono personal es obligatorio" }),
    statePhone: z.string().min(1, { message: "El teléfono estatal es obligatorio" }),
    landlinePhone: z.string().min(1, { message: "El teléfono fijo es obligatorio" }),
    jobTitle: z.string().min(1, { message: "El cargo es obligatorio" }),
    workplace: z.string().min(1, { message: "El lugar de trabajo es obligatorio" }),
});

type FormSchemaData = z.infer<typeof formSchema>;

// Tipo para las provincias y municipios (según la BD)
type Municipality = {
    id: string;
    name: string;
};

type Province = {
    id: string;
    name: string;
    municipalities: Municipality[];
};

type ContactFormProps = {
    contactData?: {
        id: number;
        name: string;
        provinceId: string;
        municipalityId: string;
        personalPhone: string;
        statePhone: string;
        landlinePhone: string;
        jobTitle: string;
        workplace: string;
    };
    provinceData: Province[];
};

export function ContactForm({ contactData, provinceData }: ContactFormProps) {
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
            name: contactData?.name,
            province: contactData?.provinceId,
            municipality: contactData?.municipalityId,
            personalPhone: contactData?.personalPhone,
            statePhone: contactData?.statePhone,
            landlinePhone: contactData?.landlinePhone,
            jobTitle: contactData?.jobTitle,
            workplace: contactData?.workplace,
        },
    });

    async function onSubmit(data: FormSchemaData) {
        const response = await customSubmit({
            name: data.name,
            provinceId: data.province,
            municipalityId: data.municipality,
            personalPhone: data.personalPhone,
            statePhone: data.statePhone,
            landlinePhone: data.landlinePhone,
            jobTitle: data.jobTitle,
            workplace: data.workplace,
        });
        if (!response.success) {
            return setError("root", { message: "Contacto ya registrado" });
        }
        reset();
        setShowSuccessModal(true);
    }

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
    };

    const watchedProvince = watch("province");
    const municipalityOptions =
        provinceData.find((p) => p.id === watchedProvince)?.municipalities || [];

    const [provinceId, setProvinceId] = useState("");

    useEffect(() => {
        setProvinceId(watchedProvince);
    }, [watchedProvince]);

    return (
        <div className="flex h-full w-full items-center justify-center overflow-y-auto py-0 ">
            <div className="flex h-full w-full flex-col items-center pt-24 rounded bg-white py-2 shadow-sm">
                <div className="pb-4 text-center">
                    <p className="font-semibold">Formulario de Contacto</p>
                    <p className="font-semibold">
                        Rellene los campos del formulario para registrar el contacto.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex max-h-[calc(100vh-150px)] w-full flex-col gap-2 overflow-y-auto px-4 pt-2 lg:w-8/12"
                >
                    <div className="flex gap-4 pb-2">
                        <div className="w-full">
                            <Label className="block pb-2">Nombre Completo:</Label>
                            <Input
                                type="text"
                                {...register("name")}
                                className="w-full rounded border border-gray-300 bg-white p-2"
                            />
                            {errors.name && <p className="text-red-600">{errors.name.message}</p>}
                        </div>
                        <div className="w-full">
                            <Label className="block pb-2">Teléfono Fijo:</Label>
                            <Input
                                type="text"
                                {...register("landlinePhone")}
                                className="w-full rounded border border-gray-300 bg-white p-2"
                            />
                            {errors.landlinePhone && (
                                <p className="text-red-600">{errors.landlinePhone.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 pb-2">
                        <div className="w-full">
                            <Label className="block pb-2">Provincia:</Label>
                            <Controller
                                control={control}
                                name="province"
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
                            {errors.province && (
                                <p className="text-red-600">{errors.province.message}</p>
                            )}
                        </div>

                        <div className="w-full">
                            <Label className="block pb-2">Municipio:</Label>
                            <Controller
                                control={control}
                                name="municipality"
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
                                                {municipalityOptions.map((opt) => (
                                                    <SelectItem key={opt.id} value={opt.id}>
                                                        {opt.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.municipality && (
                                <p className="text-red-600">{errors.municipality.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 pb-2">
                        <div className="w-full">
                            <Label className="block pb-2">Teléfono Personal:</Label>
                            <Input
                                type="text"
                                {...register("personalPhone")}
                                className="w-full rounded border border-gray-300 bg-white p-2"
                            />
                            {errors.personalPhone && (
                                <p className="text-red-600">{errors.personalPhone.message}</p>
                            )}
                        </div>
                        <div className="w-full">
                            <Label className="block pb-2">Teléfono Estatal:</Label>
                            <Input
                                type="text"
                                {...register("statePhone")}
                                className="w-full rounded border border-gray-300 bg-white p-2"
                            />
                            {errors.statePhone && (
                                <p className="text-red-600">{errors.statePhone.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 pb-2">
                        <div className="w-full">
                            <Label className="block pb-2">Cargo:</Label>
                            <Input
                                type="text"
                                {...register("jobTitle")}
                                className="w-full rounded border border-gray-300 bg-white p-2"
                            />
                            {errors.jobTitle && (
                                <p className="text-red-600">{errors.jobTitle.message}</p>
                            )}
                        </div>
                        <div className="w-full">
                            <Label className="block pb-2">Lugar de Trabajo:</Label>
                            <Input
                                type="text"
                                {...register("workplace")}
                                className="w-full rounded border border-gray-300 bg-white p-2"
                            />
                            {errors.workplace && (
                                <p className="text-red-600">{errors.workplace.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            className="w-1/4 rounded border-slate-700 bg-slate-800 py-2 text-slate-100 hover:bg-slate-950"
                        >
                            Crear Contacto
                        </Button>
                    </div>
                </form>

                {showSuccessModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="mx-auto w-11/12 max-w-md rounded-lg bg-white p-4 shadow-lg">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="text-xl font-semibold">Contacto Creado</h3>
                                <button
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={handleCloseSuccessModal}
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="py-4">
                                <p>Contacto creado con éxito.</p>
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button
                                    onClick={handleCloseSuccessModal}
                                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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
