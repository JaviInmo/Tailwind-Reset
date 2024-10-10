import React from "react";
import { PropsWithChildren } from "react";
import MainHeader from "./MainHeader";

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-slate-200 w-screen min-h-screen">
      <MainHeader />
      <div>
        <aside>Left</aside>
        <main>{children}</main>
      </div>
    </div>
  );
};
export default MainLayout;
