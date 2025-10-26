"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, Sparkles, Menu, PanelLeft, ChevronDown, Bell, Search } from "lucide-react";
import { useUser } from "@stackframe/stack";

interface TopbarProps {
  isScrolled: boolean;
  onMenuToggle?: () => void;
}

export default function Topbar({ isScrolled, onMenuToggle }: TopbarProps) {
  const user = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await user?.signOut();
    router.push("/");
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-slate-900 py-2 shadow-lg border-b border-slate-700"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="container md:px-6 lg:px-8">
        <div className="topbar-centered">
          <div className="topbar-content gap-4 md:gap-6">
            {/* Left Section */}
            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
              {/* Desktop Sidebar Toggle */}
              <button
                onClick={onMenuToggle}
                className="hidden md:flex items-center justify-center w-10 h-10 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-300 rounded-xl border border-slate-600 hover:border-slate-500"
              >
                <PanelLeft className="w-5 h-5" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={onMenuToggle}
                className="md:hidden flex items-center justify-center w-10 h-10 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-300 rounded-xl border border-slate-600 hover:border-slate-500"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Logo and Brand */}
              <div className="flex items-center gap-3 md:gap-4">
                <div className="relative group">
                  <h1 className="topbar-logo font-black text-white tracking-tight">
                    AI<span className="text-purple-400">NEX</span>
                  </h1>
                </div>

                {/* Status Badge */}
                <div className="hidden sm:flex items-center bg-slate-800 border border-slate-600 rounded-full px-3 py-1.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-xs font-medium text-slate-200">AI-Powered</span>
                  <Sparkles className="w-3 h-3 ml-2 text-yellow-400" />
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              {/* Search Button (Desktop) */}
              <button className="hidden lg:flex items-center justify-center w-10 h-10 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-300 rounded-xl border border-slate-600 hover:border-slate-500">
                <Search className="w-4 h-4" />
              </button>

              {/* Notifications Button */}
              <button className="hidden md:flex items-center justify-center w-10 h-10 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-300 rounded-xl border border-slate-600 hover:border-slate-500 relative">
                <Bell className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full"></div>
              </button>

              {/* User Profile */}
              <div className="hidden lg:flex items-center gap-3 text-gray-300 bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-600 cursor-pointer group">
                <div className="relative">
                  <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">Welcome back</span>
                  <span className="text-xs text-slate-300">{user?.displayName || "User"}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-400 transition-colors duration-300 rounded-xl px-3 py-2"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut size={16} className="mr-1" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}