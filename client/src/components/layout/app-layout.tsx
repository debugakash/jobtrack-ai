import { Outlet } from "react-router-dom";

import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
