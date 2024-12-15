import { getAuth } from "@/libs/auth";

import { CatForm } from "./cat-form";

export default async function FormPage() {
    await getAuth();

    return <CatForm />;
}
