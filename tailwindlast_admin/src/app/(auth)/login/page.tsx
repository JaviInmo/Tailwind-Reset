"use client";

import { LockKeyholeOpen, User } from "lucide-react";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type FormSchemaData = {
  name: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const session = useSession();

  console.log("session", session);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormSchemaData>();

  const onSubmit = handleSubmit(async (data: FormSchemaData) => {
    const response = await signIn("credentials", {
      name: data.name,
      password: data.password,
      redirect: false,
    });

    if (!response?.ok) {
      return setError("root", { message: "Error al iniciar sesión" });
    }

    router.push("/admin");
  });

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md ">
        <div className="text-center mb-4">
          <h1 className="mb-3 text-2xl font-semibold">Inicio de Sesión</h1>
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
                    message: "El campo nombre de usuario no puede estar vacío",
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
                    message: "El campo contraseña no puede estar vacío",
                  },
                })}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>

            {errors.root && (
              <span className="text-red-500">{errors.root.message}</span>
            )}

            <button
              type="submit"
              className="mt-4 bg-black text-white py-2 rounded hover:bg-gray-800"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
