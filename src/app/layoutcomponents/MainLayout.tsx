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
        <SidebarProvider defaultOpen={false}>
            <div className="relative flex min-h-screen w-full bg-slate-100">
                <div
                    className={`z-50 flex h-screen flex-none flex-col border-slate-700 bg-red-400 text-slate-100 shadow-lg`}
                >
                    <AppSidebar />
                </div>
                <div className="flex flex-1 flex-col overflow-x-auto overflow-y-hidden py-0 ">
                    <header className="sticky top-0 z-10 flex h-10 w-full items-center border-b border-slate-700 bg-slate-800 px-4 text-slate-100">
                        <MainHeader />
                    </header>
                    <main className="flex-1 p-2 pt-2 overflow-hidden">
                        <div className="h-full overflow-hidden ">{children}</div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
