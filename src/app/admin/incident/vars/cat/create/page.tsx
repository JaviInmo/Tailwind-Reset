import { getAuth } from "@/libs/auth";
import { fetchVariables } from "./cat.action";
import { CatForm } from "./cat-form";

export default async function FormPage() {
    await getAuth();

    const variables = await fetchVariables();

    return <CatForm initialVariables={variables} />;
}
