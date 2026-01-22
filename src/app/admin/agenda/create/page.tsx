import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";


import { ContactForm } from "./contact-form";
// importamos la server action (tu archivo "use server")
import { customSubmit } from "./form.action";

export default async function FormPage() {
  await getAuth();

  const provinceData = await prisma.province.findMany({
    include: { municipalities: true },
  });

    // Pasamos la server action customSubmit al componente cliente
    return <ContactForm provinceData={provinceData} customSubmit={customSubmit} />;
}
