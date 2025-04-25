import type { PropsWithChildren, ReactNode } from "react"

export default function Layout({
  children,
  update,
  create,
}: PropsWithChildren<{ update: ReactNode; create: ReactNode }>) {
  return (
    <>
      {children}
      {update}
      {create}
    </>
  )
}
