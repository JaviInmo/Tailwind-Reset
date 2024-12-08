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
} from "lucide-react";
import Link from "next/link";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";

// Menu items.
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
        url: "/",
        icon: Variable,
    },
    {
        title: "Categorías",
        url: "#",
        icon: Tag,
    },
    {
        title: "Subcategorías",
        url: "#",
        icon: Layers,
    },
    {
        title: "2da Subcategoría",
        url: "/admin/incident/create",
        icon: FolderTree,
    },
    {
        title: "Medidas",
        url: "/admin/incident/read",
        icon: Ruler,
    },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Extra</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {extra.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/*  <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <Collapsible defaultOpen={false} className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            <span>Otros</span>
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {extra.map((item) => (
                                                <SidebarMenuSubItem key={item.title}>
                                                    <SidebarMenuSubButton asChild>
                                                        <Link href={item.url}>
                                                            <span>{item.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup> */}
            </SidebarContent>
        </Sidebar>
    );
}
