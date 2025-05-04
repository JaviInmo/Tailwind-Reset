import type { PropsWithChildren, ReactNode } from "react";

export default function Layout({
    children,
    create,
    edit,
    delete: deleteSlot,
}: PropsWithChildren<{ edit: ReactNode; create: ReactNode; delete: ReactNode }>) {
    return (
        <>
            {children}
            {edit}
            {create}
            {deleteSlot}
        </>
    );
}
