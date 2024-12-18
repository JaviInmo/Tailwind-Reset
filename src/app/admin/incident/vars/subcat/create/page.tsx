import { getAuth } from "@/libs/auth";

import { SubCatForm } from "./subcat-form";

export default async function FormPage() {
    await getAuth();

    return <SubCatForm />;
}
