import { useState } from "react";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { cn } from "../../lib/utils";
import { AdminSearchProvider } from "../contexts/AdminSearchContext";
import { ThemeProvider } from "../../components/common/ThemeProvider";

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AdminSearchProvider>
        <div className="min-h-screen bg-background">
          <DashboardSidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed(!collapsed)}
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
          />
          <div
            className={cn(
              "flex flex-col min-h-screen transition-all duration-300",
              collapsed ? "lg:ml-[64px]" : "lg:ml-[230px]",
              "ml-0"
            )}
          >
            <DashboardHeader onMenuClick={() => setMobileOpen(true)} />
            <main className="flex-1 p-4 lg:p-5">
              <Outlet />
            </main>
          </div>
        </div>
      </AdminSearchProvider>
    </ThemeProvider>
  );
}
