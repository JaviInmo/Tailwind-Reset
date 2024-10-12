import { getAuth } from "@/libs/auth";

export default async function Page() {
  await getAuth();

  return <div>Home Pge</div>;
}
