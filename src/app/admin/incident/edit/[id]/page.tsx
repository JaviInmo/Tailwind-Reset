import { ReportForm } from "@/app/admin/incident/create/report-form";
import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";

export default async function FormPage({ params }: { params: { id: string } }) {
    await getAuth();

    const id = Number(params.id); 


    const incidentData = await prisma.incident.findUnique({
        where: { id: id },
    });

    if (!incidentData) {
        return { notFound: true };
    }

    const variableData = await prisma.variable.findMany({
        include: { categories: { include: { subcategories: {include:{secondSubcategories:true}} } } },
    });

    const provinceData = await prisma.province.findMany({
        include: { municipalities: true },
    });

    return (
        <ReportForm
            incidentData={incidentData}
            provinceData={provinceData}
            variableData={variableData}
        />
    );
}
