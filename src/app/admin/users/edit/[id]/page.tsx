import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";
import RegisterPage from "../../create/page"; // Asegúrate de que la ruta sea la correcta

export default async function FormPage({ params }: { params: { id: string } }) {
  await getAuth();

  return <EditUserPage params={params} />;
}

export async function EditUserPage({ params }: { params: { id: string } }) {
  // Usamos el id como string, ya que Prisma espera un string
  const id = params.id;

  const userData = await prisma.user.findUnique({
    where: { id },
  });

  if (!userData) {
    return { notFound: true };
  }

  return (
    <RegisterPage
      initialData={{
        id: userData.id, 
        name: userData.name,
        role: userData.role,
      }}
    />
  );
}
