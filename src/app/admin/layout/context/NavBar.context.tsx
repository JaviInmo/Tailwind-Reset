"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";

type NavBarContextType = {
    isExpanded: boolean;
    onToggleExpanded: () => void;
};

const NavBarContext = createContext<NavBarContextType | null>(null);

export function NavBarProvider({ children }: PropsWithChildren) {
    const [isExpanded, setExpanded] = useState(false);

    function onToggleExpanded() {
        setExpanded((prev) => !prev);
    }

    return (
        <NavBarContext.Provider value={{ isExpanded, onToggleExpanded }}>
            {children}
        </NavBarContext.Provider>
    );
}

export function useNavBar() {
    const context = useContext(NavBarContext);
    if (!context) {
        throw new Error("useNavBar must be used within a NavBarProvider");
    }
    return context;
}
