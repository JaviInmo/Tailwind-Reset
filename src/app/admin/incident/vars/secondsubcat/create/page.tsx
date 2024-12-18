import { getAuth } from "@/libs/auth";

import { SecondSubCatForm } from "./secondsubcat-form";

export default async function FormPage() {
    await getAuth();

    return <SecondSubCatForm />;
}
