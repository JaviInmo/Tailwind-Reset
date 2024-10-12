"use client";

import { LockKeyholeOpen, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { registerAction } from "./register.action";

type FormSchemaData = {
  name: string;
  password: string;
};

function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormSchemaData>();

  const onSubmit = handleSubmit(async (data: FormSchemaData) => {
    const response = await registerAction(data);

    if (!response) {
      return setError("root", { message: "Usuario ya registrado" });
    }

    router.push("/login");
  });

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="mb-3 text-2xl font-semibold">Registro de Usuarios</h1>
          <p className="text-white">
            Inserte el nombre de usuario y la contraseña.
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
                    value: true,
                    message: "Tiene que insertar la contraseña",
                  },
                })}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>

            {errors.root && (
              <div className="text-red-500 mt-3">{errors.root.message}</div>
            )}

            <button
              type="submit"
              className="mt-4 bg-black text-white py-2 rounded hover:bg-gray-800"
            >
              Registrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
