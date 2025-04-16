import { getAuth } from "@/libs/auth";

import  RegisterPage from "./register-form"

export default async function FormPage() {
    await getAuth();

    return <RegisterPage />;
}
