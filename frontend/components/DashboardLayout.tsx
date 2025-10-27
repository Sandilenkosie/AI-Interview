"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, FileText, UserCircle, Calendar, Users, Settings, X } from "lucide-react";
import Topbar from "@/components/Topbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

export default function DashboardLayout({ children, activeTab = "dashboard" }: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: activeTab === "dashboard",
    },
    {
      title: "Interviews",
      url: "/dashboard/interviews",
      icon: FileText,
      isActive: activeTab === "interviews",
    },
    {
      title: "Profile",
      url: "#",
      icon: UserCircle,
      isActive: false,
    },
  ];

  const navigationItems = [
    {
      title: "Recent Interviews",
      url: "/dashboard#recent-interviews",
      icon: Calendar,
    },
    {
      title: "Community",
      url: "/dashboard#community",
      icon: Users,
    },
  ];

  const settingsItems = [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];

  const handleNavigation = (url: string) => {
    if (url.startsWith('/dashboard#')) {
      router.push('/dashboard');
      setTimeout(() => {
        const sectionId = url.split('#')[1];
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      router.push(url);
    }
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-slate-900 text-white font-sans flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        w-64 bg-slate-800 border-r border-slate-700 shadow-xl overflow-hidden
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed inset-y-0 left-0 z-50 md:translate-x-0 md:static md:inset-0
      `}>
        {/* Mobile Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 text-slate-300 hover:text-white transition-colors duration-200 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Sidebar Content - Fixed height with no scrolling */}
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="border-b border-slate-700 p-6 flex-shrink-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">AINEX</h3>
                <p className="text-slate-300 text-sm">Interview Platform</p>
              </div>
            </div>

            {/* Main Navigation */}
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.title}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${item.isActive
                      ? 'text-purple-400 bg-slate-700 shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }
                  `}
                  onClick={() => handleNavigation(item.url)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Navigation Section */}
          <div className="p-6 flex-shrink-0">
            <div className="mb-4">
              <h4 className="text-slate-200 font-semibold text-sm uppercase tracking-wider">Navigation</h4>
            </div>
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.title}
                  className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-xl transition-all duration-200"
                  onClick={() => handleNavigation(item.url)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Section - Pushed to bottom */}
          <div className="mt-auto border-t border-slate-700 p-6 flex-shrink-0">
            <nav className="space-y-2">
              {settingsItems.map((item) => (
                <button
                  key={item.title}
                  className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-xl transition-all duration-200"
                  onClick={() => handleNavigation(item.url)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar isScrolled={false} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content - Only this scrolls */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}