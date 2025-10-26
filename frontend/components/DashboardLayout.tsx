"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, FileText, UserCircle, Calendar, Users, Settings } from "lucide-react";
import Topbar from "@/components/Topbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

export default function DashboardLayout({ children, activeTab = "dashboard" }: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-slate-900 text-foreground font-sans relative overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Custom Layout Grid */}
      <div className="h-full grid grid-cols-1 gap-0 md:grid-cols-[16rem_1fr]">
        {/* Sidebar */}
        <div className={`h-full bg-slate-800 border-r border-slate-600 shadow-lg z-40 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute top-4 right-4 text-slate-300 hover:text-white transition-colors duration-200 z-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="border-b border-slate-600 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">AINEX</h3>
                <p className="text-slate-300 text-xs">Interview Platform</p>
              </div>
            </div>
            <nav className="space-y-2">
              <button
                className={`w-full flex items-center gap-3 transition-colors duration-300 rounded-lg p-3 ${
                  activeTab === "dashboard"
                    ? "text-purple-400 bg-slate-700 hover:bg-slate-600 hover:text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
                onClick={() => {
                  router.push('/dashboard');
                  setSidebarOpen(false);
                }}
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button
                className={`w-full flex items-center gap-3 transition-colors duration-300 rounded-lg p-3 ${
                  activeTab === "interviews"
                    ? "text-purple-400 bg-slate-700 hover:bg-slate-600 hover:text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
                onClick={() => {
                  router.push('/dashboard/interviews');
                  setSidebarOpen(false);
                }}
              >
                <FileText className="w-5 h-5" />
                <span>Interviews</span>
              </button>
              <button className="w-full flex items-center gap-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-300 rounded-lg p-3">
                <UserCircle className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </nav>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <h4 className="text-slate-200 font-semibold text-sm uppercase tracking-wider">Navigation</h4>
            </div>
            <nav className="space-y-2">
              <button
                className="w-full flex items-center gap-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-300 rounded-lg p-3"
                onClick={() => {
                  router.push('/dashboard');
                  setTimeout(() => {
                    const recentSection = document.getElementById('recent-interviews');
                    if (recentSection) {
                      recentSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                  setSidebarOpen(false);
                }}
              >
                <Calendar className="w-5 h-5" />
                <span>Recent Interviews</span>
              </button>
              <button
                className="w-full flex items-center gap-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-300 rounded-lg p-3"
                onClick={() => {
                  router.push('/dashboard');
                  setTimeout(() => {
                    const communitySection = document.getElementById('community');
                    if (communitySection) {
                      communitySection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                  setSidebarOpen(false);
                }}
              >
                <Users className="w-5 h-5" />
                <span>Community</span>
              </button>
            </nav>
          </div>
          <div className="border-t border-slate-600 p-4">
            <nav>
              <button className="w-full flex items-center gap-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-300 rounded-lg p-3">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="h-screen flex flex-col min-w-0">
          <Topbar isScrolled={false} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <div className="h-[calc(100vh-4rem)] overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}