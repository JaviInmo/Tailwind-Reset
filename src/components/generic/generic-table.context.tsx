import { createContext, useContext, type PropsWithChildren } from "react";

const GenericTableRowContext = createContext<{ id: string } | null>(null);

export function GenericTableRowProvider({ id, children }: PropsWithChildren<{ id: string }>) {
    return (
        <GenericTableRowContext.Provider value={{ id }}>{children}</GenericTableRowContext.Provider>
    );
}

export function useGenericTableRow() {
    const value = useContext(GenericTableRowContext);

    if (!value) {
        throw new Error("useGenericTableRow should be called inside a GenericTableRowProvider");
    }

    return value;
}
