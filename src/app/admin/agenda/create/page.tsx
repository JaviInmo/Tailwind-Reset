import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";

import { ContactForm } from "./contact-form";

export default async function FormPage() {
  await getAuth();

  const provinceData = await prisma.province.findMany({
    include: { municipalities: true },
  });

  return <ContactForm provinceData={provinceData} />;
}
