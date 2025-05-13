import { getAuth } from "@/libs/auth"
import { ItemForm } from "./item-form"

export default async function FormPage() {
  await getAuth()

  return <ItemForm />
}
