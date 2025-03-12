"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/libs/db";

type FormSchemaData = {
  name: string;
  provinceId: string;
  municipalityId: string;
  personalPhone: string;
  statePhone: string;
  landlinePhone: string;
  jobTitle: string;
  workplace: string;
};

export async function customSubmit(data: FormSchemaData) {
  return await registerAction(data);
}

export async function registerAction(data: FormSchemaData) {
  try {
    console.log("Contact data to insert:", data);
    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        provinceId: data.provinceId,
        municipalityId: data.municipalityId,
        personalPhone: data.personalPhone,
        statePhone: data.statePhone,
        landlinePhone: data.landlinePhone,
        jobTitle: data.jobTitle,
        workplace:data.workplace
      },
    });

    revalidatePath("/admin/contact");

    return { success: true, contact };
  } catch (error) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Error registering contact:", error);
    return { success: false, error: errorMessage };
  }
}
