import { ContactForm } from "@/app/admin/agenda/create/contact-form";
import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";

export default async function FormPage({ params }: { params: { id: string } }) {
    await getAuth();

    const id = Number(params.id); 
    const contactData = await prisma.contact.findUnique({
        where: { id },
        include: { province: true, municipality: true },
    });

    if (!contactData) {
        
        return { notFound: true };
    }

    
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
