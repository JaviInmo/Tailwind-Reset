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
import { MenuContext } from "../context/MenuContext"; // Asegúrate de que esta ruta es correcta

const MainLayout = ({ children }: PropsWithChildren) => {
  const { open, toggle } = useContext(MenuContext); // Añadimos toggle para manejar el estado

  return (
    <div className="bg-slate-100 w-screen min-h-screen relative flex">
      <aside
        className={`bg-slate-800 text-slate-100  fixed top-0 left-0 h-full transition-transform duration-500 ease-in-out z-50 border-r  border-slate-700 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{
          width: "15rem", // Mantener el ancho fijo
          overflow: "hidden",
        }}
      >
        <ul className="py-2 px-2 mr-4">
          <li className="flex justify-start items-center hover:bg-slate-700 hover:underline  p-2 mb-6  ">
            <AiOutlineHome className="mr-2 font-bold text-xl" />
            <Link className="flex-1 font-bold text-xl" href="/">
              Home
            </Link>
            {/* Mostrar el icono solo fuera de lg */}
            <FaAnglesLeft
              className="block lg:hidden cursor-pointer"
              onClick={toggle} // Cerrar el menú cuando se haga clic en la flecha
            />
          </li>
          <li className="flex justify-start items-center hover:bg-slate-700 hover:underline  p-2">
            <RxDashboard className="mr-2" />
            <Link href="/">Dashboard</Link>
          </li>
          <li className="flex justify-start items-center hover:bg-slate-700 hover:underline  p-2">
            <VscGraphLine className="mr-2" />
            <Link href="/">Gráficas</Link>
          </li>
          <li className="flex justify-start items-center hover:bg-slate-700 hover:underline  p-2">
            <BsFileText className="mr-2" />
            <Link href="/admin/incidencia/create">Formulario</Link>
          </li>
          <li className="flex justify-start items-center hover:bg-slate-700 hover:underline p-2">
            <GoTable className="mr-2" />
            <Link href="/">Tablas</Link>
          </li>
          <li className="flex justify-start items-center hover:bg-slate-700 hover:underline  p-2">
            <VscVariableGroup className="mr-2" />
            <h3 className="flex-1">Variables</h3>
            <FaAngleRight />
          </li>
          <li className="flex justify-start items-center hover:bg-slate-700 hover:underline  p-2">
            <RiAdminLine className="mr-2" />
            <h3 className="flex-1">Admin</h3>
            <FaAngleRight />
          </li>
        </ul>
      </aside>

      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "opacity-80" : "opacity-100"
        } lg:ml-60`}
      >
        <header className="flex-none w-full border-l border-b border-slate-700 bg-slate-800 text-slate-100 h-16 flex items-center px-4 transition-all duration-500 ease-in-out ">
          <MainHeader />
        </header>
        <main >
  <div className="bg-mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 overflow-hidden">
    {children}
  </div>
</main>
      </div>
    </div>
  );
};

export default MainLayout;
