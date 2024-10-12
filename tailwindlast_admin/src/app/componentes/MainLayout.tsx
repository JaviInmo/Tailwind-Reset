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
import { FaAngleRight } from "react-icons/fa6";
import { RiAdminLine } from "react-icons/ri";
import Link from "next/link";
import { MenuContext } from "../context/MenuContext"; // Asegúrate de que esta ruta es correcta

const MainLayout = ({ children }: PropsWithChildren) => {
  const { open } = useContext(MenuContext);

  return (
    <div className="bg-slate-100 w-screen min-h-screen relative flex">
      <aside
        className={`bg-slate-800 text-slate-100 absolute lg:fixed top-0 left-0 h-full transition-transform duration-500 ease-in-out transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-50`}
        style={{
          width: "15rem",
          overflow: "hidden",
        }}
      >
        <ul className="transition-opacity duration-500 ease-in-out py-2 px-2 mr-4">
          <li className="flex justify-start items-center hover:bg-slate-700 hover:underline rounded-xl p-2 mb-6">
            <AiOutlineHome className="mr-2" />
            <Link href="/">Home</Link>
          </li>
          <li className="flex justify-start items-center hover:bg-slate-700 hover:underline rounded-xl p-2">
            <RxDashboard className="mr-2" />
            <Link href="/">Dashboard</Link>
          </li>
          <li className="flex justify-start items-center hover:bg-slate-700 hover:underline rounded-xl p-2">
            <VscGraphLine className="mr-2" />
            <Link href="/">Gráficas</Link>
          </li>
          <li className="flex justify-start items-center hover:bg-slate-700 hover:underline rounded-xl p-2">
            <BsFileText className="mr-2" />
            <Link href="/">Formulario</Link>
          </li>
          <li className="flex justify-start items-center hover:bg-slate-700 hover:underline rounded-xl p-2">
            <GoTable className="mr-2" />
            <Link href="/">Tablas</Link>
          </li>
          <li className="flex justify-start items-center hover:bg-slate-700 hover:underline rounded-xl p-2">
            <VscVariableGroup className="mr-2" />
            <h3 className="flex-1">Variables</h3>
            <FaAngleRight />
          </li>
          <li className="flex justify-start items-center hover:bg-slate-700 hover:underline rounded-xl p-2">
            <RiAdminLine className="mr-2" />
            <h3 className="flex-1">Admin</h3>
            <FaAngleRight />
          </li>
        </ul>
      </aside>
      <div
        className={`flex flex-col flex-1 transition-all duration-500 ease-in-out ${
          open ? "ml-60" : "ml-0"
        } lg:ml-60`}
      >
        <header className="flex-none w-full bg-slate-900 text-white h-16 flex items-center px-4 transition-all duration-500 ease-in-out">
          <MainHeader />
        </header>
        <main className="flex-1 bg-slate-50 p-4 transition-all duration-500 ease-in-out">
          <div className="bg-white shadow-md p-6 rounded-lg">{children}</div>
        </main>
        <footer className="flex-none w-full bg-slate-700 text-slate-200 h-16 flex items-center justify-center transition-all duration-500 ease-in-out">
          Footer Content
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
