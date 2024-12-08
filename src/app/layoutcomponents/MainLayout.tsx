"use client";
import React, { useContext } from "react";
import { PropsWithChildren } from "react";
import MainHeader from "./MainHeader";

import { useMenuState } from "../context/MenuContext";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

export function MainLayout({ children }: PropsWithChildren) {
    const { open, onToggle } = useMenuState();

    return (
        <div className="relative flex min-h-screen w-full bg-slate-100">
            <div
                className={`flex h-screen flex-1 flex-col overflow-x-hidden transition-all duration-500 ease-in-out ${
                    open ? "opacity-80" : "opacity-100"
                } lg:ml-60`}
            >
                <header className="flex h-10 w-full items-center border-b border-l border-slate-700 bg-slate-800 px-4 text-slate-100 transition-all duration-500 ease-in-out">
                    <MainHeader />
                </header>
                <SidebarProvider>
                    <AppSidebar />
                    <main className="w-full overflow-y-auto">
                        <SidebarTrigger />
                        <div className="p-4">
                            <div className="w-full overflow-y-auto">{children}</div>
                        </div>
                    </main>
                </SidebarProvider>
            </div>
        </div>
    );
}
