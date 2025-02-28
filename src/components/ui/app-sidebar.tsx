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
  import { usePathname } from "next/navigation"; // Para Next.js 13

  import { Phone } from 'lucide-react';
  import { UserRoundPlus } from 'lucide-react';
  
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
      title: "Medidas",
      url: "/admin/incident/medidas",
      icon: Ruler,
    },
  ];


  const phonebook=[{
    title:"Agenda",
    url:"/admin/agenda/create",
    icon: Phone,
  }]


  const admin=[{
    title:"Administración",
    url:"/admin/admin/users",
    icon: UserRoundPlus,
  }]

  
  export function AppSidebar() {
    const { state } = useSidebar();
    const pathname = usePathname();

    return (
        //modo icon para q no se oculten los iconos
        <Sidebar collapsible="icon" className="shadow-left-3 shadow-2xl">
      <div className="relative p-2 h-10 border-b border-slate-700 bg-slate-800 text-slate-100">
        <SidebarTrigger />
        <div className="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none">
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
      </SidebarContent>
    </Sidebar>
  );
}