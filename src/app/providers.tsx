"use client";

import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";
import MenuContextProvider from "./context/MenuContext";

export function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
        <MenuContextProvider>
            {children}
        </MenuContextProvider>
    </SessionProvider>
);
}
