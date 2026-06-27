/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Building2, Menu, X, Globe, LogIn, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  currentPath: string;
  setCurrentPath: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, setCurrentPath }) => {
  const { currentUser, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Browse Rentals", path: "/rentals" },
    { label: "Services", path: "/services" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" }
  ];

  const handleNavClick = (path: string) => {
    setCurrentPath(path);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/85 backdrop-blur-md transition-all"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 px-2 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 rounded-lg transition-colors mr-2 md:mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div 
            onClick={() => handleNavClick("/")} 
            className="flex cursor-pointer items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md shadow-slate-900/10 transition-transform hover:scale-105">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900">
              PROPERTY<span className="text-blue-600">LOG</span>
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-150 ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute bottom-1 left-4 right-4 h-0.5 bg-blue-600 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <>
              <button
                onClick={() => handleNavClick("/dashboard")}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Go to Workspace
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => handleNavClick("/login")}
              className="flex items-center gap-1.5 px-4.5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg shadow-slate-900/10 transition-all hover:shadow-slate-900/15"
            >
              <LogIn className="h-4 w-4" />
              Login to Workspace
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white"
          >
            <div className="space-y-1 px-4 py-3 pb-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex w-full items-center px-4 py-2.5 text-base font-semibold rounded-xl ${
                    currentPath === item.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <hr className="my-2 border-slate-100" />
              {currentUser ? (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => handleNavClick("/dashboard")}
                    className="flex justify-center items-center py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    Workspace
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex justify-center items-center py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavClick("/login")}
                  className="flex w-full justify-center items-center py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md gap-1.5"
                >
                  <LogIn className="h-4 w-4" />
                  Login to Workspace
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
