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

export function MainLayout({ children }: PropsWithChildren) {
    const { open, onToggle } = useMenuState();

    return (
        <div className="bg-slate-100 w-full min-h-screen relative flex ">
            <aside
                className={`bg-slate-800 text-slate-100 fixed top-0 left-0 h-full transition-transform duration-500 ease-in-out z-50 border-r border-slate-700 ${
                    open ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
                style={{
                    width: "15rem",
                    overflow: "hidden",
                }}
            >
                <ul className="py-2 pr-6">
                    <li className="flex justify-start items-center hover:bg-slate-700 hover:underline p-2 pb-6">
                        <AiOutlineHome className="pr-2 font-bold text-3xl" />
                        <Link className="flex-1 font-bold text-xl" href="/">
                            Home
                        </Link>
                        <FaAnglesLeft
                            className="block lg:hidden cursor-pointer"
                            onClick={onToggle}
                        />
                    </li>
                    <li className="flex justify-start items-center hover:bg-slate-700 hover:underline p-2">
                        <RxDashboard className="pr-2 text-2xl" />
                        <Link href="/">Dashboard</Link>
                    </li>
                    <li className="flex justify-start items-center hover:bg-slate-700 hover:underline p-2">
                        <VscGraphLine className="pr-2 text-2xl" />
                        <Link href="/">Gráficas</Link>
                    </li>
                    <li className="flex justify-start items-center hover:bg-slate-700 hover:underline p-2">
                        <BsFileText className="pr-2 text-2xl" />
                        <Link href="/admin/incidencia/create">Formulario</Link>
                    </li>
                    <li className="flex justify-start items-center hover:bg-slate-700 hover:underline p-2">
                        <GoTable className="pr-2 text-2xl" />
                        <Link href="/admin/incidencia/read">Tablas</Link>
                    </li>
                    <li className="flex justify-start items-center hover:bg-slate-700 hover:underline p-2">
                        <VscVariableGroup className="pr-2 text-2xl" />
                        <h3 className="flex-1">Variables</h3>
                        <FaAngleRight />
                    </li>
                    <li className="flex justify-start items-center hover:bg-slate-700 hover:underline p-2">
                        <RiAdminLine className="pr-2 text-2xl" />
                        <h3 className="flex-1">Admin</h3>
                        <FaAngleRight />
                    </li>
                </ul>
            </aside>

            <div
                className={`flex flex-col flex-1 h-screen transition-all duration-500 ease-in-out overflow-x-hidden  ${
                    open ? "opacity-80" : "opacity-100"
                } lg:ml-60`}
            >
                <header className="w-full border-l border-b border-slate-700 bg-slate-800 text-slate-100 h-16 flex items-center px-4 transition-all duration-500 ease-in-out">
                    <MainHeader />
                </header>

                <main className="w-full overflow-y-auto ">
                    <div className="p-4 ">
                        <div className=" w-full overflow-y-auto">{children}</div>
                    </div>
                </main>
            </div>
        </div>
    );
}
