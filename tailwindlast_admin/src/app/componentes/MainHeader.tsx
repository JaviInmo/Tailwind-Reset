"use client";
import React, { useContext } from "react";
import { FaBars } from "react-icons/fa";
import MenuContextProvider, { MenuContext } from "../context/MenuContext";

const MainHeader = () => {
  const { toggle } = useContext(MenuContext);
  return (
    <div className="flex justify-between items-center px-2 h-12 mb-0 gap-2">
      <div onClick={toggle} className="lg:hidden">
        <FaBars className="cursor-pointer" />
      </div>
      <div>MainHeaderBrand</div>
    </div>
  );
};
export default MainHeader;
