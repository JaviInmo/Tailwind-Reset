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
import { useState } from "react";



// Definición del esquema del formulario
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

// Definición de los tipos para las provincias y municipios (según tu BD)
type Municipality = {
    id: string;
    name: string;
};

type Province = {
    id: string;
    name: string;
    municipalities: Municipality[];
};

interface ContactFormProps {
    contactData: {
        id: number;
        name: string;
        provinceId: string;
        municipalityId: string;
        personalPhone: string;
        statePhone: string;
        landlinePhone: string;
        jobTitle: string;
        workplace: string;
        province: {
            id: string;
            name: string;
        };
        municipality: {
            id: string;
            name: string;
            provinceId: string;
        };
    };
    provinceData: Province[];
}
export function ContactForm({ provinceData }: ContactFormProps) {
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors },
    } = useForm<FormSchemaData>({
        resolver: zodResolver(formSchema),
        mode: "onTouched",
    });

    // Obtenemos la provincia seleccionada para filtrar los municipios correspondientes
    const watchedProvince = watch("province");
    const municipalityOptions =
        provinceData.find((p) => p.id === watchedProvince)?.municipalities || [];

    async function onSubmit(data: FormSchemaData) {
        console.log("Data submitted:", data);
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
        if (response.success) {
            reset();
            setShowSuccessModal(true);
        } else {
            alert("Error creating contact: " + response.error);
        }
    }

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h2 className="mb-4 text-xl font-semibold">
                Rellene el formulario para crear el contacto
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4">
                <div>
                    <Label htmlFor="name">Nombre Completo:</Label>
                    <Input
                        id="name"
                        {...register("name")}
                        placeholder="Insertar el nombre completo"
                    className="bg-white"/>
                    {errors.name && <p className="text-red-600">{errors.name.message}</p>}
                </div>

                <div className="flex gap-4 pb-2">
                    <div className="w-full">
                        <Label htmlFor="province">Provincia:</Label>
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
                        <Label htmlFor="municipality">Municipios:</Label>
                        <Controller
                            control={control}
                            name="municipality"
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    onValueChange={onChange}
                                    value={value}
                                    disabled={!watchedProvince}
                                >
                                    <SelectTrigger className="w-full rounded border border-gray-300 bg-white p-2 disabled:bg-slate-300">
                                        <SelectValue placeholder="Seleccionar municipio" />
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
                    <div>
                        <Label htmlFor="personalPhone">Movil personal:</Label>
                        <Input
                            id="personalPhone"
                            {...register("personalPhone")}
                            placeholder="Número personal"
                            className="bg-white"/>
                        {errors.personalPhone && (
                            <p className="text-red-600">{errors.personalPhone.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="statePhone">Movil Estatal:</Label>
                        <Input
                            id="statePhone"
                            {...register("statePhone")}
                            placeholder="Número estatal"
                            className="bg-white"/>
                        {errors.statePhone && (
                            <p className="text-red-600">{errors.statePhone.message}</p>
                        )}
                    </div>
                </div>
                <div >
                    <Label htmlFor="landlinePhone">Telefono fijo:</Label>
                    <Input
                        id="landlinePhone"
                        {...register("landlinePhone")}
                        placeholder="Número fijo"
                        className="bg-white"/>
                    {errors.landlinePhone && (
                        <p className="text-red-600">{errors.landlinePhone.message}</p>
                    )}
                </div>
                <div className="flex  gap-4 pb-2">
                    <div className="w-full">
                        <Label htmlFor="">Lugar de Trabajo:</Label>
                        <Input
                            id=""
                            {...register("workplace")}
                            placeholder="Lugar de Trabajo"
                            className="bg-white" />
                        {errors.workplace && (
                            <p className="text-red-600">{errors.workplace.message}</p>
                        )}
                    </div>
                    <div className="w-full">
                        <Label htmlFor="jobTitle">Cargo:</Label>
                        <Input
                            id="jobTitle"
                            {...register("jobTitle")}
                            placeholder="Enter job title"
                        />
                        {errors.jobTitle && (
                            <p className="text-red-600">{errors.jobTitle.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-center">
                    <Button type="submit" className="px-4 py-2">
                        Crear Contacto
                    </Button>
                </div>
            </form>

            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-11/12 max-w-md rounded-lg bg-white p-4 shadow-lg">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="text-xl font-semibold">Contact Created</h3>
                            <button
                                onClick={handleCloseSuccessModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="py-4">
                            <p>The contact was created successfully.</p>
                        </div>
                        <div className="flex justify-end pt-2">
                            <Button
                                onClick={handleCloseSuccessModal}
                                className="bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                            >
                                Accept
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
