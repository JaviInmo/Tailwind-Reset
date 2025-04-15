import { PropsWithChildren, ReactNode } from "react";

export default function Layout({ children, create, edit}: PropsWithChildren<{ create: ReactNode ; edit: ReactNode }>) {
    return (
        <>
            {children}
            {create}
            {edit}
            
        </>
    );
}
