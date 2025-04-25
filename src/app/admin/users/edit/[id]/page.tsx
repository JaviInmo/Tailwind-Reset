import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import RegisterPage from "../../create/register-form" // Asegúrate de que la ruta sea la correcta

export default async function FormPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  await getAuth()

  return <EditUserPage params={params} />
}

export async function EditUserPage({ params }: { params: { id: string } }) {
  // Usamos el id como string, ya que Prisma espera un string
  const id = params.id

  const userData = await prisma.user.findUnique({
    where: { id },
  })

  if (!userData) {
    // Instead of returning { notFound: true }, return a JSX element
    //importante para el intercepting routes no de error de jsx element
    return (
      <div className="flex min-h-52 items-center justify-center bg-slate-100 px-4 py-12 sm:px-6 lg:px-8 text-black">
        <div className="w-full max-w-md">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-red-600">Usuario no encontrado</h2>
            <p className="mt-2 text-gray-600">El usuario con ID {id} no existe.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <RegisterPage
      initialData={{
        id: userData.id,
        name: userData.name,
        role: userData.role,
      }}
    />
  )
}
