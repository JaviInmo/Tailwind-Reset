import type { PropsWithChildren, ReactNode } from "react"

export default function Layout({
  children,
  create,
  update,
  delete: deleteSlot,
}: PropsWithChildren<{
  create: ReactNode
  update: ReactNode
  delete: ReactNode
}>) {
  return (
    <>
      {children}
      {create}
      {update}
      {deleteSlot}
    </>
  )
}
