"use client";

import { ArrowDownNarrowWide, CircleUser, LogOut } from "lucide-react";

import { IconButton } from "@/componentes/IconButton";

import { useNavBar } from "../../context/NavBar.context";

export function Header() {
  const { onToggleExpanded } = useNavBar();

  return (
    <header className="flex justify-end h-7 min-h-7 border-b-2 px-4">
      <div className="flex items-center gap-2">
        <div className="block md:hidden">
          <IconButton onClick={onToggleExpanded}>
            <ArrowDownNarrowWide size={"20px"} />
          </IconButton>
        </div>
        <IconButton>
          <LogOut size={"20px"} />
        </IconButton>
        <IconButton>
          <CircleUser size={"20px"} />
        </IconButton>
      </div>
    </header>
  );
}
