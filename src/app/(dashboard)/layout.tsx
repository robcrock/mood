import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <div className="fixed h-screen">
          <AppSidebar />
        </div>
        <main className="flex-1 overflow-auto ml-[256px]">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default layout;
