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

export function MainLayout({ children }: PropsWithChildren) {
    const { open, onToggle } = useMenuState();

    return (
        <div className="relative flex min-h-screen w-full bg-slate-100">
            <aside
                className={`fixed left-0 top-0 z-50 h-full border-r border-slate-700 bg-slate-800 pl-2 text-slate-100 transition-transform duration-500 ease-in-out ${
                    open ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
                style={{
                    width: "15rem",
                    overflow: "hidden",
                }}
            >
                <ul className="py-2 pr-6">
                    <li className="flex items-center justify-start p-2 pb-6 hover:bg-slate-700 hover:underline">
                        <AiOutlineHome className="pr-2 text-3xl font-bold" />
                        <Link className="flex-1 text-xl font-bold" href="/">
                            Home
                        </Link>
                        <FaAnglesLeft
                            className="block cursor-pointer lg:hidden"
                            onClick={onToggle}
                        />
                    </li>
                    <li className="flex items-center justify-start p-2 hover:bg-slate-700 hover:underline">
                        <RxDashboard className="pr-2 text-2xl" />
                        <Link href="/">Dashboard</Link>
                    </li>
                    <li className="flex items-center justify-start p-2 hover:bg-slate-700 hover:underline">
                        <VscGraphLine className="pr-2 text-2xl" />
                        <Link href="/">Gráficas</Link>
                    </li>
                    <li className="flex items-center justify-start p-2 hover:bg-slate-700 hover:underline">
                        <BsFileText className="pr-2 text-2xl" />
                        <Link href="/admin/incident/create">Formulario</Link>
                    </li>
                    <li className="flex items-center justify-start p-2 hover:bg-slate-700 hover:underline">
                        <GoTable className="pr-2 text-2xl" />
                        <Link href="/admin/incident/read">Tablas</Link>
                    </li>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="hover:bg-slate-700 hover:underline">
                                <li className="flex items-center justify-start p-2">
                                    <VscVariableGroup className="pr-2 text-2xl" />
                                    <h3 className="flex-1">Variables</h3>
                                </li>
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="pl-6">
                                    <li className="flex items-center justify-start p-2 hover:bg-slate-700 hover:underline">
                                        <h4 className="flex-1">Var</h4>
                                    </li>
                                    <li className="flex items-center justify-start p-2 hover:bg-slate-700 hover:underline">
                                        <h4 className="flex-1">Cat</h4>
                                    </li>
                                    <li className="flex items-center justify-start p-2 hover:bg-slate-700 hover:underline">
                                        <h4 className="flex-1">SubCat</h4>
                                    </li>
                                    <li className="flex items-center justify-start p-2 hover:bg-slate-700 hover:underline">
                                        <h4 className="flex-1">2daSubCat</h4>
                                    </li>
                                    <li className="flex items-center justify-start p-2 hover:bg-slate-700 hover:underline">
                                        <h4 className="flex-1">Medidas</h4>
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <li className="flex items-center justify-start p-2 hover:bg-slate-700 hover:underline">
                        <RiAdminLine className="pr-2 text-2xl" />
                        <h3 className="flex-1">Admin</h3>
                        <FaAngleRight />
                    </li>
                </ul>
            </aside>

            <div
                className={`flex h-screen flex-1 flex-col overflow-x-hidden transition-all duration-500 ease-in-out ${
                    open ? "opacity-80" : "opacity-100"
                } lg:ml-60`}
            >
                <header className="flex h-16 w-full items-center border-b border-l border-slate-700 bg-slate-800 px-4 text-slate-100 transition-all duration-500 ease-in-out">
                    <MainHeader />
                </header>

                <main className="w-full overflow-y-auto">
                    <div className="p-4">
                        <div className="w-full overflow-y-auto">{children}</div>
                    </div>
                </main>
            </div>
        </div>
    );
}
