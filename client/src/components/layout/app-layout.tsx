import { Outlet } from "react-router-dom";

import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar />

          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
