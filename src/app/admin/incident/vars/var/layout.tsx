import type { PropsWithChildren, ReactNode } from "react"

export default function Layout({
  children,
  create,
  edit,
  delete: deleteSlot,
}: PropsWithChildren<{
  create: ReactNode
  edit: ReactNode
  delete: ReactNode
}>) {
  return (
    <>
      {children}
      {create}
      {edit}
      {deleteSlot}
    </>
  )
}
