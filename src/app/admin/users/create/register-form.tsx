"use client";

import { LockKeyholeOpen, User, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { registerOrUpdateAction } from "./register.action";
import { revalidatePath } from "next/cache";

type FormSchemaData = {
    name: string;
    password: string;
    role: "SIMPLE" | "ADVANCED" | "ADMIN";
};

type RegisterPageProps = {
    initialData?: {
        id: string;
        name: string;
        role: "SIMPLE" | "ADVANCED" | "ADMIN";
    };
  
};

function RegisterPage({ initialData }: RegisterPageProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<FormSchemaData>({
        defaultValues: {
            name: initialData?.name || "",
            role: initialData?.role || "SIMPLE",
            password: "", 
        },
    });

    const onSubmit = handleSubmit(async (data: FormSchemaData) => {
       
        const payload = initialData ? { id: initialData.id, ...data } : data;
        const response = await registerOrUpdateAction(payload);
        if (!response) {
            return setError("root", {
                message:
                    initialData ?
                        "Error al actualizar el usuario o el nombre ya existe"
                    :   "Usuario ya registrado ",
                    
            });
           
        }
        router.refresh();
        
      
    });

    return (
        <div className="flex min-h-52 items-center justify-center bg-slate-100 px-4 py-12 sm:px-6 lg:px-8 text-black">
            <div className="w-full max-w-md">
                <div className="mb-4 text-center">
                    <h1 className="mb-3 text-2xl font-semibold">
                        {initialData ? "Editar Usuario" : "Registro de Usuarios"}
                    </h1>
                    <p className="text-black">
                        {initialData ?
                            "Modifica los datos del usuario"
                        :   "Inserte el nombre de usuario, la contraseña y seleccione el rol."}
                    </p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow">
                    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="username"
                                className="flex items-center gap-2 font-semibold text-black"
                            >
                                <User className="text-black" />
                                Usuario
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Inserte nombre de usuario"
                                className="rounded border border-gray-300 px-3 py-2"
                                {...register("name", {
                                    required: {
                                        value: true,
                                        message: "Tiene que insertar el nombre de usuario",
                                    },
                                })}
                            />
                            {errors.name && (
                                <span className="text-red-500">{errors.name.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="password"
                                className="flex items-center gap-2 font-semibold text-black"
                            >
                                <LockKeyholeOpen className="text-black" />
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Inserte la contraseña"
                                className="rounded border border-gray-300 px-3 py-2"
                                {...register("password", {
                                    required: {
                                        value: !initialData, // En edición, la contraseña puede no ser obligatoria
                                        message: "Tiene que insertar la contraseña",
                                    },
                                })}
                            />
                            {errors.password && (
                                <span className="text-red-500">{errors.password.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="role"
                                className="flex items-center gap-2 font-semibold text-black"
                            >
                                <ShieldCheck className="text-black" />
                                Rol
                            </label>
                            <select
                                id="role"
                                className="rounded border border-gray-300 px-3 py-2"
                                {...register("role", {
                                    required: {
                                        value: true,
                                        message: "Debe seleccionar un rol",
                                    },
                                })}
                            >
                                <option value="SIMPLE">Simple</option>
                                <option value="ADVANCED">Avanzado</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                            {errors.role && (
                                <span className="text-red-500">{errors.role.message}</span>
                            )}
                        </div>

                        {errors.root && (
                            <div className="mt-3 text-red-500">{errors.root.message}</div>
                        )}

                        <button
                            type="submit"
                            className="mt-4 rounded bg-black py-2 text-white hover:bg-gray-800"
                        >
                            {initialData ? "Actualizar" : "Registrar"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
