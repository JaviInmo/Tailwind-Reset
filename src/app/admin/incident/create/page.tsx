import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";

import { ReportForm } from "./report-form";

export default async function FormPage() {
    await getAuth();

    const variableData = await prisma.variable.findMany({
        include: {
            categories: {
                include: {
                    subcategories: {
                        include: { secondSubcategories: true }, // Incluir segundas subcategorías
                    },
                },
            },
        },
    });

    const provinceData = await prisma.province.findMany({
        include: { municipalities: true },
    });

    // const unit = await prisma.unitMeasure.findMany({});

    return <ReportForm provinceData={provinceData} variableData={variableData} />;
}
