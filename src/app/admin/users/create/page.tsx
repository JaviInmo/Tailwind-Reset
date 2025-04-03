"use client";

import { LockKeyholeOpen, User, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { registerAction } from "./register.action";

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
      password: "", // Siempre se deja en blanco por seguridad
    },
  });

  const onSubmit = handleSubmit(async (data: FormSchemaData) => {
    // En este ejemplo, incluso en edición, se usa la misma acción
    // Si se desea diferenciar se podría condicionar según si existe initialData
    const response = await registerAction(data);
    if (!response) {
      return setError("root", { message: "Usuario ya registrado o error" });
    }
    router.push("/login");
  });

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-slate-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="mb-3 text-2xl font-semibold">
            {initialData ? "Editar Usuario" : "Registro de Usuarios"}
          </h1>
          <p className="text-black">
            {initialData
              ? "Modifica los datos del usuario"
              : "Inserte el nombre de usuario, la contraseña y seleccione el rol."}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="username"
                className="font-semibold flex items-center gap-2 text-black"
              >
                <User className="text-black" />
                Usuario
              </label>
              <input
                id="username"
                type="text"
                placeholder="Inserte nombre de usuario"
                className="border border-gray-300 rounded px-3 py-2"
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
                className="font-semibold flex items-center gap-2 text-black"
              >
                <LockKeyholeOpen className="text-black" />
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="Inserte la contraseña"
                className="border border-gray-300 rounded px-3 py-2"
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
                className="font-semibold flex items-center gap-2 text-black"
              >
                <ShieldCheck className="text-black" />
                Rol
              </label>
              <select
                id="role"
                className="border border-gray-300 rounded px-3 py-2"
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
              <div className="text-red-500 mt-3">{errors.root.message}</div>
            )}

            <button
              type="submit"
              className="mt-4 bg-black text-white py-2 rounded hover:bg-gray-800"
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
