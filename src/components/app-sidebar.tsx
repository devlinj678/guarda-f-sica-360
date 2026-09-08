import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  Warehouse,
  PackageCheck,
  Inbox,
  MapPin,
  ClipboardList,
  Headset,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const grupos = [
  {
    label: "Operação",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Recebimento", url: "/recebimento", icon: PackageCheck },
      { title: "Inbound", url: "/inbound", icon: Inbox },
      { title: "Endereçamento", url: "/enderecamento", icon: MapPin },
      { title: "Ordens de Serviço", url: "/ordens", icon: ClipboardList },
      { title: "Atendimento", url: "/atendimento", icon: Headset },
    ],
  },
  {
    label: "Cadastros e Controle",
    items: [
      { title: "Clientes e Contratos", url: "/clientes", icon: Building2 },
      { title: "Estrutura Física", url: "/estrutura", icon: Warehouse },
      { title: "Auditoria", url: "/auditoria", icon: ShieldCheck },
      { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
    ],
  },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-1 py-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary font-display text-sm font-extrabold text-primary-foreground">
            G
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display text-sm font-bold">GoDocs</div>
              <div className="label-industrial text-sidebar-foreground/60">Guarda Física 360</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {grupos.map((grupo) => (
          <SidebarGroup key={grupo.label}>
            <SidebarGroupLabel className="label-industrial">{grupo.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {grupo.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={currentPath === item.url} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
