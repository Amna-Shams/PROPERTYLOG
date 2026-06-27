/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LandingPage } from "./components/LandingPage";
import { ServicesPage } from "./components/ServicesPage";
import { AboutPage } from "./components/AboutPage";
import { ContactPage } from "./components/ContactPage";
import { AuthPages } from "./components/AuthPages";
import { Dashboard } from "./components/Dashboard";
import { TenantPortal } from "./components/TenantPortal";
import { PropertyManagerPortal } from "./components/PropertyManagerPortal";
import { NotificationsPage } from "./components/NotificationsPage";
import { RentalsPage } from "./components/RentalsPage";
import { PropertyDetailPage } from "./components/PropertyDetailPage";
import { ToastContainer } from "./components/ToastContainer";
import { motion, AnimatePresence } from "motion/react";
import { UserRole } from "./types";

function AppContent() {
  const { currentUser, logout } = useApp();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    // Read initial path from URL hash or fallback to state
    const hash = window.location.hash.replace("#", "");
    if (hash === "dashboard") return "/dashboard";
    if (hash === "notifications") return "/notifications";
    if (hash === "services") return "/services";
    if (hash === "about") return "/about";
    if (hash === "contact") return "/contact";
    if (hash === "login") return "/login";
    if (hash === "register") return "/login";
    if (hash === "rentals") return "/rentals";
    if (hash === "portal/admin" || hash === "portal-admin") return "/portal/admin";
    if (hash === "portal/owner" || hash === "portal-owner") return "/portal/owner";
    if (hash === "portal/tenant" || hash === "portal-tenant") return "/portal/tenant";
    if (hash === "portal/property-manager" || hash === "portal-property-manager") return "/portal/property-manager";
    if (hash.startsWith("property-detail-")) {
      const id = hash.replace("property-detail-", "");
      return `/property-detail/${id}`;
    }
    // Check path fallback
    const pathname = window.location.pathname;
    if (pathname.includes("/portal/admin")) return "/portal/admin";
    if (pathname.includes("/portal/owner")) return "/portal/owner";
    if (pathname.includes("/portal/tenant")) return "/portal/tenant";
    if (pathname.includes("/portal/property-manager")) return "/portal/property-manager";
    return "/";
  });

  // Keep hash in sync with current path for better iframe navigation reloading
  useEffect(() => {
    let routeName = currentPath.replace("/", "");
    if (currentPath.startsWith("/property-detail/")) {
      routeName = currentPath.replace("/property-detail/", "property-detail-");
    }
    if (currentPath.startsWith("/portal/")) {
      routeName = currentPath.substring(1); // "portal/admin" etc.
    }
    window.location.hash = routeName || "home";
  }, [currentPath]);

  // Listen to hash changes for robust routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "dashboard") setCurrentPath("/dashboard");
      else if (hash === "notifications") setCurrentPath("/notifications");
      else if (hash === "services") setCurrentPath("/services");
      else if (hash === "about") setCurrentPath("/about");
      else if (hash === "contact") setCurrentPath("/contact");
      else if (hash === "login") setCurrentPath("/login");
      else if (hash === "register") setCurrentPath("/login");
      else if (hash === "forgot-password") setCurrentPath("/forgot-password");
      else if (hash === "rentals") setCurrentPath("/rentals");
      else if (hash === "portal/admin" || hash === "portal-admin") setCurrentPath("/portal/admin");
      else if (hash === "portal/owner" || hash === "portal-owner") setCurrentPath("/portal/owner");
      else if (hash === "portal/tenant" || hash === "portal-tenant") setCurrentPath("/portal/tenant");
      else if (hash === "portal/property-manager" || hash === "portal-property-manager") setCurrentPath("/portal/property-manager");
      else if (hash.startsWith("property-detail-")) {
        const id = hash.replace("property-detail-", "");
        setCurrentPath(`/property-detail/${id}`);
      }
      else setCurrentPath("/");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Protect dashboard and notifications/portal routes
  useEffect(() => {
    const isProtectedRoute = [
      "/dashboard", 
      "/notifications", 
      "/portal/admin", 
      "/portal/owner", 
      "/portal/tenant", 
      "/portal/property-manager"
    ].includes(currentPath);

    if (isProtectedRoute && !currentUser) {
      setCurrentPath("/login");
    }
  }, [currentPath, currentUser]);

  const renderActiveRoute = () => {
    if (currentPath.startsWith("/property-detail/")) {
      const propertyId = currentPath.split("/").pop() || "";
      return <PropertyDetailPage propertyId={propertyId} setCurrentPath={setCurrentPath} />;
    }

    switch (currentPath) {
      case "/":
        return <LandingPage setCurrentPath={setCurrentPath} />;
      case "/rentals":
        return <RentalsPage setCurrentPath={setCurrentPath} />;
      case "/services":
        return <ServicesPage setCurrentPath={setCurrentPath} />;
      case "/about":
        return <AboutPage setCurrentPath={setCurrentPath} />;
      case "/contact":
        return <ContactPage />;
      case "/login":
        return <AuthPages view="login" setView={(v) => setCurrentPath(`/${v === "register" ? "login" : v}`)} setCurrentPath={setCurrentPath} />;
      case "/register":
        return <AuthPages view="login" setView={(v) => setCurrentPath(`/${v === "register" ? "login" : v}`)} setCurrentPath={setCurrentPath} />;
      case "/forgot-password":
        return <AuthPages view="forgot-password" setView={(v) => setCurrentPath(`/${v === "register" ? "login" : v}`)} setCurrentPath={setCurrentPath} />;
      case "/portal/admin":
      case "/portal/owner":
      case "/portal/tenant":
      case "/portal/property-manager":
      case "/dashboard":
        if (!currentUser) return null;
        if (currentUser.role === UserRole.TENANT) {
          return (
            <TenantPortal
              currentUser={currentUser}
              onLogout={async () => {
                await logout();
                setCurrentPath("/");
              }}
              onBrowseRentals={() => setCurrentPath("/rentals")}
            />
          );
        }
        if (currentUser.role === UserRole.PROPERTY_MANAGER) {
          return <PropertyManagerPortal />;
        }
        return <Dashboard />;
      case "/notifications":
        if (!currentUser) return null;
        return <NotificationsPage setCurrentPath={setCurrentPath} />;
      default:
        return <LandingPage setCurrentPath={setCurrentPath} />;
    }
  };

  const showWebsiteChrome = !["/dashboard", "/login", "/register", "/forgot-password", "/notifications"].includes(currentPath) && !currentPath.startsWith("/portal/");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Website Navigation Header */}
      {showWebsiteChrome && (
        <Header currentPath={currentPath} setCurrentPath={setCurrentPath} />
      )}

      {/* Main Page Area with fade-in animation */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {renderActiveRoute()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Website Footer */}
      {showWebsiteChrome && (
        <Footer setCurrentPath={setCurrentPath} />
      )}

      {/* Toast Alert Feed */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
