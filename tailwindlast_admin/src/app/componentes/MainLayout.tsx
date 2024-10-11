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
import { MenuContext } from "../context/MenuContext";

const MainLayout = ({ children }: PropsWithChildren) => {
  const { open } = useContext(MenuContext);
  return (
    <div className="bg-slate-200 w-screen min-h-screen">
      <MainHeader />
      <div className="flex justify-start items-start">
        <aside
          className={`bg-white  overflow-hidden transition-all duration-200 ${
            open ? "w-60 h-screen p-4" : "w-0"
          } lg:w-60 lg:h-screen lg:p-4`} // Make sure there's a space between the closing curly brace and media query classes
        >
          <ul>
            <li className="flex justify-start items-center hover:bg-slate-200 hover:underline rounded-xl p-2">
              <AiOutlineHome className="mr-2" />
              <Link href="/">Home</Link>
            </li>
          </ul>
          <ul>
            <li className="flex justify-start items-center hover:bg-slate-200 hover:underline rounded-xl p-2">
              <RxDashboard className="mr-2" />
              <Link href="/">Dashboard</Link>
            </li>
          </ul>
          <ul>
            <li className="flex justify-start items-center hover:bg-slate-200 hover:underline rounded-xl p-2">
              <VscGraphLine className="mr-2" />
              <Link href="/">Gráficas</Link>
            </li>
          </ul>
          <ul>
            <li className="flex justify-start items-center hover:bg-slate-200 hover:underline rounded-xl p-2">
              <BsFileText className="mr-2" />
              <Link href="/">Formulario</Link>
            </li>
          </ul>
          <ul>
            <li className="flex justify-start items-center hover:bg-slate-200 hover:underline rounded-xl p-2">
              <GoTable className="mr-2" />
              <Link href="/">Tablas</Link>
            </li>
          </ul>
          <ul>
            <li className="flex justify-start items-center hover:bg-slate-200 hover:underline rounded-xl p-2">
              <VscVariableGroup className="mr-2" />
              <h3 className="flex-1">Variables</h3>
              <FaAngleRight />
            </li>
          </ul>
          <ul>
            <li className="flex justify-start items-center hover:bg-slate-200 hover:underline rounded-xl p-2">
              <RiAdminLine className="mr-2" />
              <h3 className="flex-1">Admin</h3>
              <FaAngleRight />
            </li>
          </ul>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};
export default MainLayout;
