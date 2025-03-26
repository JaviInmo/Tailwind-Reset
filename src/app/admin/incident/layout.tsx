import { PropsWithChildren, ReactNode } from "react";

export default function Layout({ children, modal, view }: PropsWithChildren<{ modal: ReactNode; view: ReactNode }>) {
    return (
        <>
            {children}
            {modal}
            {view}
        </>
    );
}
