import prisma from "@/libs/db";

import Table from "./Table";

export default async function Page() {
    // Obtener datos de la base de datos
    const incidents = await prisma.incident.findMany({
        include: {
            province: true,
            municipality: true,
            variable: true,
            category: true,
            subcategory: true,
            unitMeasure: true,
            secondSubcategory: true,
        },
    });

    // Mapear los datos a un formato compatible con el componente de tabla
    const data = incidents.map((incident) => ({
        id: incident.id, // Ya es un número
        variable: incident.variable.name,
        categoria: incident.category.name,
        subcategoria: incident.subcategory?.name || "",
        segundasubcategoria: incident.secondSubcategory?.name || "",
        amount: incident.amount || 0,
        descripcion: incident.description,
        provincia: incident.province.name,
        municipio: incident.municipality.name,
        fecha: incident.date.toISOString().split("T")[0],
    }));

    return <Table data={data} />;
}
