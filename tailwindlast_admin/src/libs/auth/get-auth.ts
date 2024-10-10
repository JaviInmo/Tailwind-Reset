import { redirect } from "next/navigation";

import { auth } from "./auth";

export async function getAuth() {
    const session = await auth();

    console.log("[user] ", session?.user);
    if (!session?.user) {
        redirect("/unauthorized");
    }

    return session;
}
