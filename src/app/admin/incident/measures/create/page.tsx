import { getAuth } from "@/libs/auth"
import { UnitForm } from "./unit-form"

export default async function FormPage() {
  await getAuth()

  return <UnitForm />
}
