import { ContactForm } from "@/app/admin/agenda/create/contact-form";
import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";

export default async function FormPage({ params }: { params: { id: string } }) {
    await getAuth();

    const id = Number(params.id); // Convierte el id a número

    // Recupera el contacto desde la base de datos, incluyendo sus relaciones
    const contactData = await prisma.contact.findUnique({
        where: { id },
        include: { province: true, municipality: true },
    });

    if (!contactData) {
        // Maneja el caso donde el contacto no existe
        return { notFound: true };
    }

    // Recupera las provincias y sus municipios para el formulario
    const provinceData = await prisma.province.findMany({
        include: { municipalities: true },
    });

    return (
        <ContactForm
            contactData={contactData}
            provinceData={provinceData}
        />
    );
}
