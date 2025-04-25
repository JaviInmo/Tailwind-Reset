import { EditUserPage } from "@/app/admin/users/edit/[id]/page"
import { Dialog, DialogContent } from "@/components/ui/app-dialog"
import prisma from "@/libs/db"

export default async function FormPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params

  // Check if the user exists before rendering the EditUserPage
  const userData = await prisma.user.findUnique({
    where: { id: params.id },
  })

  return (
    <Dialog open={true}>
      <DialogContent>
        {userData ? (
          <EditUserPage params={params} />
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
