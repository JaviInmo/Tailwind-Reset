import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";
import { VariableForm } from "../../create/var-form";

export default async function EditVarPage({
  params,
}: {
  params: { id: string };
}) {
  await getAuth();

  const id = Number(params.id);
  const variableData = await prisma.variable.findUnique({
    where: { id },
    include: { categories: { include: { subcategories: true } } },
  });

  if (!variableData) {
    return { notFound: true };
  }

  return <VariableForm variableData={variableData} />;
}
