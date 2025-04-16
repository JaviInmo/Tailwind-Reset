import { PropsWithChildren, ReactNode } from "react";

export default function Layout({ children, modal, create }: PropsWithChildren<{ modal: ReactNode; create: ReactNode }>) {
    return (
        <>
            {children}
            {modal}
            {create}
        </>
    );
}
