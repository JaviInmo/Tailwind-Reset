import { ContactForm } from "@/app/admin/agenda/create/contact-form";
import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";
import { notFound } from "next/navigation";

export default async function FormPage(props: {
	params: Promise<{ id: string }>;
}) {
	const params = await props.params;
	await getAuth();

	return <EditContactPage params={params} />;
}

export async function EditContactPage({ params }: { params: { id: string } }) {
	const id = Number(params.id);

	const contactData = await prisma.contact.findUnique({
		where: { id },
		include: { province: true, municipality: true },
	});

	if (!contactData) {
		notFound();
	}

	const provinceData = await prisma.province.findMany({
		include: { municipalities: true },
	});

	return <ContactForm contactData={contactData} provinceData={provinceData} />;
}
