import { getAuth } from "@/app/libs/auth";

export default async function Page() {
  await getAuth();

  return <div>DashboardPage</div>;
}
