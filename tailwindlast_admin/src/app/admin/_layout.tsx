import { PropsWithChildren } from "react";

import { Header } from "./layout/components/Header";
import { NavBar } from "./layout/components/NavBar/NavBar";
import { NavBarProvider } from "./layout/context/NavBar.context";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <NavBarProvider>
      <div className="flex flex-col md:flex-row h-full min-h-screen max-h-screen">
        <div>
          <NavBar />
        </div>
        <div className="flex flex-col flex-grow">
          <Header />
          <main className="flex-grow p-4 overflow-auto">{children}</main>
        </div>
      </div>
    </NavBarProvider>
  );
}
