import prisma from "@/libs/db";

import Table from "./Table";

type TableSearchParams = Partial<{
    page: string;
    search: string
}>

export default async function Page({ searchParams }:{ searchParams: TableSearchParams }) {
    
    const itemsPerPage = 5;
    const page = searchParams.page ? Number(searchParams.page) : 1;
    const search = searchParams.search ?? null;

    const skip = (page - 1) * itemsPerPage

    const incidentCount = await prisma.incident.count(); 
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
        where:search ? { description: { contains: search }}: undefined,
        take: itemsPerPage,
        skip: skip
    });

    const pageCount = Math.ceil(incidentCount / itemsPerPage)

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


    return <Table data={data} pageCount={pageCount} currentPage={page}/>;
}
