import { ReportForm } from "@/app/admin/incidencia/create/report-form";
import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";

export default async function FormPage({ params }: { params: { id: string } }) {
    await getAuth();

    const id = Number(params.id); // Convierte el id a número

    // Recupera el objeto que contiene el id desde la base de datos
    const incidentData = await prisma.incident.findUnique({
        where: { id: id },
    });

    if (!incidentData) {
        // Maneja el caso donde el incidente no existe
        return { notFound: true };
    }

    const variableData = await prisma.variable.findMany({
        include: { categories: { include: { subcategories: true } } },
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
