import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";

import { QueryProvider } from "@/app/providers/query-provider";
import { router } from "@/routes";
import { Toaster } from "@/components/ui/sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
      <Toaster richColors />
    </QueryProvider>
  </React.StrictMode>,
);
