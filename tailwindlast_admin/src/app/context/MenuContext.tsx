"use client";
import { createContext, useState, ReactNode } from "react";

// Provide a default value, e.g., { open: false, toggle: () => {} }
export const MenuContext = createContext({ open: false, toggle: () => {} });

type MenuContextProviderProps = {
  children: ReactNode;
};

const MenuContextProvider = ({ children }: MenuContextProviderProps) => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    console.log("open");
    setOpen((prev) => !prev);
  };
  return (
    <MenuContext.Provider value={{ open, toggle }}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuContextProvider;
