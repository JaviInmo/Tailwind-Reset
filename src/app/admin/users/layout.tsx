import type { PropsWithChildren, ReactNode } from "react"

export default function Layout({
  children,
  modal,
  create,
  delete: deleteSlot,
}: PropsWithChildren<{ modal: ReactNode; create: ReactNode; delete: ReactNode }>) {
  return (
    <>
      {children}
      {modal}
      {create}
      {deleteSlot}
    </>
  )
}
