/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
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
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><AdminOverview /></AdminLayout>} />
          <Route path="/admin/scams" element={<AdminLayout><AdminScamManagement /></AdminLayout>} />
          <Route path="/admin/legit" element={<AdminLayout><AdminLegitManagement /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
