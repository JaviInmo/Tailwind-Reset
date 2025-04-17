import { ReportForm } from "@/app/admin/incident/create/report-form";
import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";

export default async function FormPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await getAuth();
  return <ViewPage params={params} />;
}

export async function ViewPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  const incidentData = await prisma.incident.findUnique({
    where: { id },
  });

  if (!incidentData) {
    return { notFound: true };
  }

  const variableData = await prisma.variable.findMany({
    include: {
      categories: {
        include: {
          subcategories: { include: { secondSubcategories: true } },
        },
      },
    },
  });

  const provinceData = await prisma.province.findMany({
    include: { municipalities: true },
  });

  return (
    <ReportForm
      incidentData={incidentData}
      provinceData={provinceData}
      variableData={variableData}
      readOnly={true}
    />
  );
}
