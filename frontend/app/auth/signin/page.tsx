"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain, Zap, Eye } from "lucide-react";
import { useUser, SignIn } from "@stackframe/stack";

export default function SignInPage() {
  const user = useUser();
  const router = useRouter();

  // Redirect if already signed in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900 to-slate-900 pointer-events-none"></div>
      <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Brain className="text-6xl text-purple-400 animate-float" />
            </div>
            <CardTitle className="text-2xl text-white">
              Welcome to AI<span className="text-purple-400">NEX</span>
            </CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="ai-themed-signin">
              <SignIn />
            </div>

            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Zap className="text-purple-400" size={16} />
                <span className="text-sm">AI-Powered Authentication</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}