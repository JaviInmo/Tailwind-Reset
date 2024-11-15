import React from "react";
import { FaBars } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { useMenuState } from "../context/MenuContext";

const MainHeader = () => {
    const { onToggle } = useMenuState();

    return (
        <div className="mb-0 flex max-h-16 w-full items-center justify-between gap-2 px-2 py-2">
            <div className="flex items-center gap-2">
                <div onClick={onToggle} className="lg:hidden">
                    <FaBars className="cursor-pointer" />
                </div>
                <div>MainHeaderBrand</div>
            </div>
            <div className="flex items-center justify-between gap-2 px-2 py-2">
                <div className="flex items-center justify-between gap-2 rounded-xl px-2 py-2 text-2xl hover:bg-slate-700 hover:underline">
                    <CgProfile />
                </div>
                <div className="flex items-center justify-between gap-2 rounded-xl px-2 py-2 text-2xl hover:bg-slate-700 hover:underline">
                    <MdLogout />
                </div>
            </div>
        </div>
    );
};

export default MainHeader;
