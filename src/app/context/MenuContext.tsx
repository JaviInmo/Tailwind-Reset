"use client";

import { createContext, PropsWithChildren, ReactNode, useContext, useState } from "react";

type MenuState = {
    open: boolean;
    onToggle: () => void;
};

export const MenuContext = createContext<MenuState | null>(null);

export function MenuContextProvider({ children }: PropsWithChildren) {
    const [open, setOpen] = useState(false);

    function onToggle() {
        setOpen((prev) => !prev);
    }

    return <MenuContext.Provider value={{ open, onToggle }}>{children}</MenuContext.Provider>;
}

export function useMenuState() {
    const value = useContext(MenuContext);

    if (value === null) {
        throw new Error("useMenuState needs to be used inside MenuContextProvider");
    }

    return value;
}
