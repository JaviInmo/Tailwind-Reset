"use client"

import { LockKeyholeOpen, User, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { registerOrUpdateAction } from "../create/register.action"

type FormSchemaData = {
  name: string
  password: string
  role: "SIMPLE" | "ADVANCED" | "ADMIN"
}

type EditUserFormProps = {
  userData: {
    id: string
    name: string
    role: "SIMPLE" | "ADVANCED" | "ADMIN"
  }
}

export function EditUserForm({ userData }: EditUserFormProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormSchemaData>({
    defaultValues: {
      name: userData.name,
      role: userData.role,
      password: "", // Password field starts empty for editing
    },
  })

  const onSubmit = handleSubmit(async (data: FormSchemaData) => {
    const payload = { id: userData.id, ...data }
    const response = await registerOrUpdateAction(payload)

    if (!response.success) {
      return setError("root", {
        message: "Error al actualizar el usuario o el nombre ya existe",
      })
    }

    router.back()
  })

  return (
    <div className="flex min-h-52 items-center justify-center bg-slate-100 px-4 py-12 text-black sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-4 text-center">
          <h1 className="mb-3 text-2xl font-semibold">Editar Usuario</h1>
          <p className="text-black">Modifica los datos del usuario</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="flex items-center gap-2 font-semibold text-black">
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
              {errors.name && <span className="text-red-500">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="flex items-center gap-2 font-semibold text-black">
                <LockKeyholeOpen className="text-black" />
                Contraseña (Dejar en blanco para mantener la actual)
              </label>
              <input
                id="password"
                type="password"
                placeholder="Inserte nueva contraseña o deje en blanco"
                className="rounded border border-gray-300 px-3 py-2"
                {...register("password")}
              />
              {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="role" className="flex items-center gap-2 font-semibold text-black">
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
              {errors.role && <span className="text-red-500">{errors.role.message}</span>}
            </div>

            {errors.root && <div className="mt-3 text-red-500">{errors.root.message}</div>}

            <button type="submit" className="mt-4 rounded bg-black py-2 text-white hover:bg-gray-800">
              Actualizar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
