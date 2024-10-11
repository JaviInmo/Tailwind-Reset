"use client";
import React, { useContext } from "react";
import { FaBars } from "react-icons/fa";
import MenuContextProvider, { MenuContext } from "../context/MenuContext";

const MainHeader = () => {
  const { toggle } = useContext(MenuContext);
  return (
    <div className="bg-white flex justify-between items-center px-4 h-12 mb-0">
      <div>MainHeaderBrand</div>
      <div onClick={toggle} className="lg:hidden">
        <FaBars className="cursor-pointer" />
      </div>
    </div>
  );
};
export default MainHeader;
