"use client";

import {
  BarChart3,
  Bell,
  BookText,
  ChevronRight,
  ListChecks,
  Package,
  Table2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useRef, useState } from "react";

import { IconButton } from "@/app/componentes/IconButton";
import { useIsMobile } from "@/hooks/window/useIsMobile";
import { cx } from "@/util/cx";

import { useNavBar } from "../../context/NavBar.context";

type NavBarItem = {
  href: string;
  title: string;
  icon?: JSX.Element;
  className?: string;
  subItems?: NavBarItem[];
};

// Esta es la lista de elementos que se mostrarán en la barra de navegación
const navBarItems: NavBarItem[] = [
  {
    href: "/admin",
    title: "Dashboard",
    icon: <ListChecks />,
  },
  {
    href: "/admin/form",
    title: "Formularios",
    icon: <BookText />,
  },
  { href: "/admin/graph", title: "Graficas", icon: <BarChart3 /> },
  { href: "/admin/table", title: "Tables", icon: <Table2 /> },
  {
    href: "#",
    title: "Variables",
    icon: <ChevronRight />, // Cambiado a ChevronRight
    className: "py-4",
    subItems: [
      { href: "/admin/variables/createVars", title: "Crear Variable" },
      { href: "/admin/variables/createCateg", title: "Crear Categoría" },
      { href: "/admin/variables/createSubCat", title: "Crear Subcategoría" },
      {
        href: "/admin/variables/createSecondSubCat",
        title: "Crear Segunda Subcategoría",
      },
    ],
  },
];

export function NavBar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { isExpanded, onToggleExpanded } = useNavBar();
  const blackdropRef = useRef<HTMLDivElement>(null);
  const [isVariablesExpanded, setIsVariablesExpanded] = useState(false);

  function onToggleNavBar(e: React.MouseEvent<HTMLDivElement>) {
    if (!isMobile || e.target !== blackdropRef.current) return;
    onToggleExpanded();
  }

  function onToggleVariables(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setIsVariablesExpanded(!isVariablesExpanded); // Cambia el estado
    console.log("isVariablesExpanded:", !isVariablesExpanded); // Depuración
  }

  return (
    <div
      className={cx(
        "fixed top-0 w-full h-full z-50 bg-transparent transition-colors duration-100",
        isExpanded && "bg-black bg-opacity-50"
      )}
      onClick={onToggleNavBar}
      ref={blackdropRef}
    >
      <div
        className={cx(
          "absolute left-0 w-4/5 h-full border-r border-gray-300 transition-transform duration-500",
          isExpanded ? "left-0" : "-left-full",
          "lg:relative lg:w-72 lg:min-w-72 lg:bg-transparent lg:left-0"
        )}
      >
        <div className="h-7 min-h-7 px-4 flex items-center justify-between border-b">
          <Link href="/HomePage" className="mr-auto flex gap-1 items-center">
            <Package />
            <h5>Apk Web</h5>
          </Link>
          <IconButton>
            <Bell size={"20px"} />
          </IconButton>
        </div>
        <ul className="flex flex-col gap-2 p-4">
          {navBarItems.map(({ href, icon, title, className, subItems }) => (
            <li key={href} className={className}>
              {subItems ? (
                <div
                  onClick={onToggleVariables}
                  className={cx(
                    "flex items-center gap-2 p-2 cursor-pointer transition-colors duration-300",
                    isVariablesExpanded && "bg-gray-200 text-black rounded"
                  )}
                >
                  <ChevronRight
                    className={cx(
                      "transition-transform duration-300",
                      isVariablesExpanded && "transform rotate-90"
                    )}
                  />
                  <span>{title}</span>
                </div>
              ) : (
                <Link
                  href={href}
                  className={cx(
                    "flex items-center gap-2 p-2 cursor-pointer transition-colors duration-300",
                    pathname === href && "bg-gray-200 text-black rounded"
                  )}
                >
                  {icon}
                  <span>{title}</span>
                </Link>
              )}
              {subItems && (
                <ul
                  className={cx(
                    "max-h-0 overflow-hidden transition-max-height duration-300 ease-out",
                    isVariablesExpanded && "max-h-64"
                  )}
                >
                  {subItems.map((subItem) => (
                    <li key={subItem.href} className="pl-7">
                      <Link
                        href={subItem.href}
                        className={cx(
                          "flex items-center gap-2 p-2 cursor-pointer transition-colors duration-300",
                          pathname === subItem.href &&
                            "bg-gray-200 text-black rounded"
                        )}
                      >
                        <span>{subItem.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
