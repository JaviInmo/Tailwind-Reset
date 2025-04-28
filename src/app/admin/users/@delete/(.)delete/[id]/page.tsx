import { Dialog, DialogContent } from "@/components/ui/app-dialog"
import prisma from "@/libs/db"
import { DeleteUserContent } from "@/app/admin/users/delete/delete-user-content"

interface PageProps {
  params: {
    id: string
  }
}

export default async function FormPage({ params }: PageProps) {
  // Check if the user exists before rendering the DeleteUserPage
  const userData = await prisma.user.findUnique({
    where: { id: params.id },
  })

  return (
    <Dialog open={true}>
      <DialogContent>
        {userData ? (
          <DeleteUserContent id={params.id} userName={userData.name} />
        ) : (
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600">Usuario no encontrado</h2>
            <p className="mt-2 text-gray-600">El usuario con ID {params.id} no existe.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
