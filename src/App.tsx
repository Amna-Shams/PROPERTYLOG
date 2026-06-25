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
import { NotificationsPage } from "./components/NotificationsPage";
import { ToastContainer } from "./components/ToastContainer";
import { motion, AnimatePresence } from "motion/react";

function AppContent() {
  const { currentUser } = useApp();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    // Read initial path from URL hash or fallback to state
    const hash = window.location.hash.replace("#", "");
    if (hash === "dashboard") return "/dashboard";
    if (hash === "notifications") return "/notifications";
    if (hash === "services") return "/services";
    if (hash === "about") return "/about";
    if (hash === "contact") return "/contact";
    if (hash === "login") return "/login";
    if (hash === "register") return "/register";
    return "/";
  });

  // Keep hash in sync with current path for better iframe navigation reloading
  useEffect(() => {
    const routeName = currentPath.replace("/", "");
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
      else if (hash === "register") setCurrentPath("/register");
      else if (hash === "forgot-password") setCurrentPath("/forgot-password");
      else setCurrentPath("/");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Protect dashboard and notifications routes
  useEffect(() => {
    if ((currentPath === "/dashboard" || currentPath === "/notifications") && !currentUser) {
      setCurrentPath("/login");
    }
  }, [currentPath, currentUser]);

  const renderActiveRoute = () => {
    switch (currentPath) {
      case "/":
        return <LandingPage setCurrentPath={setCurrentPath} />;
      case "/services":
        return <ServicesPage setCurrentPath={setCurrentPath} />;
      case "/about":
        return <AboutPage setCurrentPath={setCurrentPath} />;
      case "/contact":
        return <ContactPage />;
      case "/login":
        return <AuthPages view="login" setView={(v) => setCurrentPath(`/${v}`)} setCurrentPath={setCurrentPath} />;
      case "/register":
        return <AuthPages view="register" setView={(v) => setCurrentPath(`/${v}`)} setCurrentPath={setCurrentPath} />;
      case "/forgot-password":
        return <AuthPages view="forgot-password" setView={(v) => setCurrentPath(`/${v}`)} setCurrentPath={setCurrentPath} />;
      case "/dashboard":
        if (!currentUser) return null;
        return <Dashboard />;
      case "/notifications":
        if (!currentUser) return null;
        return <NotificationsPage setCurrentPath={setCurrentPath} />;
      default:
        return <LandingPage setCurrentPath={setCurrentPath} />;
    }
  };

  const showWebsiteChrome = !["/dashboard", "/login", "/register", "/forgot-password", "/notifications"].includes(currentPath);

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
