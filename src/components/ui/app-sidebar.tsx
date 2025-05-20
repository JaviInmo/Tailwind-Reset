"use client";

import { useSession } from "next-auth/react";
import {
    Calendar,
    ChartLine,
    FolderTree,
    Home,
    Inbox,
    Layers,
    LayoutDashboard,
    LetterText,
    LucideGitGraph,
    Ruler,
    Search,
    Settings,
    Table2,
    Tag,
    Variable,
    Phone,
    UserRoundPlus,
    Leaf,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Para Next.js 13

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger, // Asegúrate de importar el trigger
} from "@/components/ui/sidebar";

import { useSidebar } from "@/components/ui/sidebar";

const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Dashboard",
        url: "#",
        icon: LayoutDashboard,
    },
    {
        title: "Gráficas",
        url: "#",
        icon: ChartLine,
    },
    {
        title: "Formulario",
        url: "/admin/incident/create",
        icon: LetterText,
    },
    {
        title: "Tablas",
        url: "/admin/incident/read",
        icon: Table2,
    },
];

const extra = [
    {
        title: "Variables",
        url: "/admin/incident/vars/var",
        icon: Variable,
    },
    {
        title: "Categorías",
        url: "/admin/incident/vars/cat",
        icon: Tag,
    },
    {
        title: "Subcategorías",
        url: "/admin/incident/vars/subcat",
        icon: Layers,
    },
    {
        title: "2da Subcategoría",
        url: "/admin/incident/vars/secondsubcat",
        icon: FolderTree,
    },
    {
         
        title: "Ojetos de Incidencia",
        url: "/admin/incident/items",
        icon: Leaf,
    },
    
];

const phonebook = [
    {
        title: "Agenda",
        url: "/admin/agenda/read",
        icon: Phone,
    },
];

const admin = [
    {
        title: "Administración",
        url: "/admin/users/read",
        icon: UserRoundPlus,
    },
];


export function AppSidebar() {
    const { state } = useSidebar();
    const pathname = usePathname();
    const { data: session } = useSession();
    const role = session?.user?.role;

    return (
        // modo icon para que no se oculten los iconos
        <Sidebar collapsible="icon" className="shadow-left-3 shadow-2xl">
            <div className="relative h-10 border-b border-slate-700 bg-slate-800 p-2 text-slate-100">
                <SidebarTrigger />
                <div className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2">
                    <span
                        className={`transition-opacity duration-300 ${
                            state === "expanded" ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        App
                    </span>
                </div>
            </div>
            <SidebarContent>
                {/* Grupo Application siempre visible */}
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Los siguientes grupos solo se muestran si el usuario NO es SIMPLE */}
                {role !== "SIMPLE" && (
                    <>
                        <SidebarGroup>
                            <SidebarGroupLabel>Extra</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {extra.map((item) => {
                                        const isActive = pathname === item.url;
                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton asChild isActive={isActive}>
                                                    <Link href={item.url}>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        <SidebarGroup>
                            <SidebarGroupLabel>Telefonos</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {phonebook.map((item) => {
                                        const isActive = pathname === item.url;
                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton asChild isActive={isActive}>
                                                    <Link href={item.url}>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        {role === "ADMIN" && (
                            <SidebarGroup>
                                <SidebarGroupLabel>Administración</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {admin.map((item) => {
                                            const isActive = pathname === item.url;
                                            return (
                                                <SidebarMenuItem key={item.title}>
                                                    <SidebarMenuButton asChild isActive={isActive}>
                                                        <Link href={item.url}>
                                                            <item.icon />
                                                            <span>{item.title}</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            );
                                        })}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        )}
                    </>
                )}
            </SidebarContent>
        </Sidebar>
    );
}
