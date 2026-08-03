import { Outlet } from "react-router-dom";

import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="fixed inset-y-0 left-0 w-64">
            <Sidebar />
          </div>
        </div>

        {/* Main application area */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />

          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
