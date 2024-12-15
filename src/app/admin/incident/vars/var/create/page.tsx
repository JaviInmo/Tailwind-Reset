import { getAuth } from "@/libs/auth";

import { VariableForm } from "./var-form";

export default async function FormPage() {
    await getAuth();

    return <VariableForm />;
}
