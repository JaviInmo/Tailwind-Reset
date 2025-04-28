import { getAuth } from "@/libs/auth"
import { DeleteUserContent } from "@/app/admin/users/delete/delete-user-content"
import prisma from "@/libs/db"

interface PageProps {
  params: {
    id: string
  }
}

// This is a Server Component
export default async function DeleteUserPage({ params }: PageProps) {
  await getAuth()

  // Check if user exists on the server
  const userData = await prisma.user.findUnique({
    where: { id: params.id },
  })

  if (!userData) {
    return (
      <div className="flex min-h-52 items-center justify-center bg-slate-100 px-4 py-12 text-black sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-red-600">Usuario no encontrado</h2>
            <p className="mt-2 text-gray-600">El usuario con ID {params.id} no existe.</p>
          </div>
        </div>
      </div>
    )
  }

  // Pass user data to client component
  return <DeleteUserContent id={params.id} userName={userData.name} />
}
