"use client";
import React, { useContext } from "react";
import { FaBars } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { MenuContext } from "../context/MenuContext";

const MainHeader = () => {
  const { toggle } = useContext(MenuContext);

  return (
    <div className=" flex justify-between items-center px-2 py-2 h-9 w-full mb-0 gap-2 ">
      <div>
        <div onClick={toggle} className="lg:hidden">
          <FaBars className="cursor-pointer" />
        </div>
        <div>MainHeaderBrand</div>
      </div>
      <div className="flex justify-between items-center px-2 py-2 gap-2  ">
        <div className="flex justify-between items-center px-2 py-2 gap-2  hover:bg-slate-700 hover:underline rounded-xl text-2xl ">
          <CgProfile />
        </div>
        <div className="flex justify-between items-center px-2 py-2 gap-2  hover:bg-slate-700 hover:underline rounded-xl text-2xl">
          <MdLogout />
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
