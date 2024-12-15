"use client";
import React, { useContext } from "react";
import { PropsWithChildren } from "react";
import MainHeader from "./MainHeader";
import { AiOutlineHome } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import { BsFileText } from "react-icons/bs";
import { VscGraphLine } from "react-icons/vsc";
import { GoTable } from "react-icons/go";
import { VscVariableGroup } from "react-icons/vsc";
import { FaAngleRight, FaAnglesLeft } from "react-icons/fa6";
import { RiAdminLine } from "react-icons/ri";
import Link from "next/link";
import { useMenuState } from "../context/MenuContext";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

export function MainLayout({ children }: PropsWithChildren) {
    const { open, onToggle } = useMenuState();

    return (
        <SidebarProvider>
            <div className="relative flex min-h-screen w-full bg-slate-100">
                <div
                    className={`flex h-screen flex-1 flex-col overflow-x-hidden transition-all duration-500 ease-in-out`}
                >
                    <div
                        className={`absolute left-0 top-0 border-r-0 border-slate-700 bg-slate-800 pl-2 text-slate-100 shadow-lg`}
                        style={{
                            width: "12rem",
                            overflow: "hidden",
                        }}
                    >
                        <AppSidebar />
                    </div>

                    <header className="flex h-10 w-full items-center border-b border-l border-slate-700 bg-slate-800 px-4 text-slate-100 transition-all duration-500 ease-in-out">
                        <MainHeader />
                        <SidebarTrigger className="lg:hidden" />
                    </header>

                    <main className="w-full flex-1 overflow-y-auto">
                        <div className="p-4">
                            <div className="w-full overflow-y-auto">{children}</div>
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
