/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AdminLayout } from "./components/AdminLayout";
import { Home } from "./pages/Home";
import { ReportScam } from "./pages/ReportScam";
import { LegitList } from "./pages/LegitList";
import { LegitProfileDetail } from "./pages/LegitProfileDetail";
import { ScamDetail } from "./pages/ScamDetail";
import { ScamList } from "./pages/ScamList";
import { Warnings } from "./pages/Warnings";
import { About } from "./pages/About";
import { AdminOverview } from "./pages/AdminOverview";
import { AdminScamManagement } from "./pages/AdminScamManagement";
import { AdminLegitManagement } from "./pages/AdminLegitManagement";
import { AdminSettings } from "./pages/AdminSettings";
import { Login } from "./pages/Login";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/report" element={<Layout><ReportScam /></Layout>} />
          <Route path="/legit" element={<Layout><LegitList /></Layout>} />
          <Route path="/legit/:id" element={<Layout><LegitProfileDetail /></Layout>} />
          <Route path="/reports" element={<Layout><ScamList /></Layout>} />
          <Route path="/reports/:id" element={<Layout><ScamDetail /></Layout>} />
          <Route path="/warnings" element={<Layout><Warnings /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout><AdminOverview /></AdminLayout></ProtectedAdminRoute>} />
          <Route path="/admin/scams" element={<ProtectedAdminRoute><AdminLayout><AdminScamManagement /></AdminLayout></ProtectedAdminRoute>} />
          <Route path="/admin/legit" element={<ProtectedAdminRoute><AdminLayout><AdminLegitManagement /></AdminLayout></ProtectedAdminRoute>} />
          <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminLayout><AdminSettings /></AdminLayout></ProtectedAdminRoute>} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
