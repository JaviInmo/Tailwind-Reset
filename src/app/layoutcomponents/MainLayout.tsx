"use client";
import React, { useContext } from "react";
import { PropsWithChildren } from "react";
import MainHeader from "./MainHeader";

import { useMenuState } from "../context/MenuContext";

import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

export function MainLayout({ children }: PropsWithChildren) {
    const { open, onToggle } = useMenuState();

    return (
        <SidebarProvider>
            <div className="relative flex min-h-screen w-full bg-slate-100">
                <div
                    className={`flex h-screen flex-none flex-col border-slate-700 bg-red-400 text-slate-100 shadow-lg`}
                >
                    <AppSidebar />
                </div>
                <div className="flex flex-1 flex-col overflow-hidden py-3">
                    <header className="fixed top-0 z-10 flex h-10 w-full items-center border-b border-slate-700 bg-slate-800 px-4 text-slate-100">
                        <MainHeader />
                        <SidebarTrigger className="lg:hidden" />
                    </header>
                    <main className="flex-1 overflow-y-auto p-4">
                        <div className="w-full">{children}</div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
