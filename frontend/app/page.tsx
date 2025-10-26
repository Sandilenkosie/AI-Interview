"use client";

import { useState, useEffect } from "react";
import { Brain, Zap, Eye, MessageSquare, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import ImageSlider from "@/components/ImageSlider";
import { useUser } from "@stackframe/stack";
import InterviewChatbot from "@/components/InterviewChatbot";

interface Interview {
  id: number;
  role: string;
  interview_type: string;
  experience_level: string;
  num_questions: number;
  questions: string[];
  responses: string[];
  feedback: object;
  created_at: string;
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const user = useUser();
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const images = [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop",
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInterviewGenerated = (interviewData: Interview) => {
    // For main page, just close chatbot and redirect to dashboard
    setChatbotOpen(false);
    if (user) {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-foreground font-sans">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900 to-slate-900 pointer-events-none"></div>
      <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-900/80 backdrop-blur-md py-3 shadow-lg border-b border-purple-500/20"
            : "py-6"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              AI<span className="text-purple-400">NEX</span>
              <span className="text-xs inline-flex items-center bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full px-2 py-1 ml-2">
                Next Gen
              </span>
            </h1>
          </div>

          <ul className="hidden lg:flex items-center space-x-8">
            <li><a href="#features" className="text-gray-300 hover:text-purple-400 transition-colors">Features</a></li>
            <li><a href="#ai-demo" className="text-gray-300 hover:text-purple-400 transition-colors">AI Demo</a></li>
            <li><a href="#testimonials" className="text-gray-300 hover:text-purple-400 transition-colors">Testimonials</a></li>
            <li><a href="#pricing" className="text-gray-300 hover:text-purple-400 transition-colors">Pricing</a></li>
            <li><a href="#contact" className="text-gray-300 hover:text-purple-400 transition-colors">Contact</a></li>
          </ul>

          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-300">Welcome, {user.primaryEmail || "User"}</span>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg animate-glow"
                  onClick={() => setChatbotOpen(true)}
                >
                  Generate Interview
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                  onClick={() => window.location.href = "/dashboard"}
                >
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <button
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => window.location.href = "/auth/signin"}
                >
                  Login
                </button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg animate-glow"
                  onClick={() => window.location.href = "/auth/signin"}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-32">
          <div className="container mx-auto grid gap-12 md:grid-cols-2 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="font-display text-5xl md:text-7xl leading-tight tracking-tight">
                Unlock the Future with
                <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent ml-2">
                  AI Next-Gen
                </span>
              </h1>
              <p className="text-gray-300 max-w-xl text-xl">
                Experience the power of advanced AI interfaces that are intuitive, fast, and beautifully designed. Transform your ideas into reality with cutting-edge technology.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg animate-bounce-in shadow-lg"
                  onClick={() => user ? setChatbotOpen(true) : (window.location.href = "/auth/signin")}
                >
                  {user ? "Generate Interview" : "Start Free Trial"}
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg animate-fade-in shadow-lg"
                  onClick={() => window.location.href = user ? "/dashboard" : "/auth/signin"}
                >
                  {user ? "Go to Dashboard" : "Watch Demo"}
                </Button>
              </div>
              <div className="flex gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Zap className="text-purple-400" size={20} />
                  <span>Lightning Fast</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="text-purple-400" size={20} />
                  <span>Secure & Private</span>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-in-up">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-30 animate-pulse-slow"></div>
              <ImageSlider images={images} />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6 bg-slate-800/20">
          <div className="container mx-auto">
            <h2 className="text-4xl font-display text-center mb-12 text-white">AI-Powered Features</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="p-6 bg-slate-800/50 border-purple-500/20 hover:border-purple-500/40 transition-all animate-fade-in">
                <CardHeader>
                  <Brain className="size-8 text-purple-400 mb-4" />
                  <CardTitle className="text-white">Intelligent Automation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    Automate complex tasks with AI-driven workflows that learn and adapt to your needs.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="p-6 bg-slate-800/50 border-purple-500/20 hover:border-purple-500/40 transition-all animate-fade-in">
                <CardHeader>
                  <MessageSquare className="size-8 text-purple-400 mb-4" />
                  <CardTitle className="text-white">Natural Language Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    Interact with AI using natural language for seamless communication and understanding.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="p-6 bg-slate-800/50 border-purple-500/20 hover:border-purple-500/40 transition-all animate-fade-in">
                <CardHeader>
                  <TrendingUp className="size-8 text-purple-400 mb-4" />
                  <CardTitle className="text-white">Predictive Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    Gain insights with AI-powered predictions and data analysis for informed decisions.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* AI Demo Section */}
        <section id="ai-demo" className="py-20 px-6">
          <div className="container mx-auto grid gap-12 md:grid-cols-2 items-center">
            <div className="space-y-6 animate-fade-in-left">
              <h2 className="font-display text-4xl md:text-5xl text-white">
                See AI in Action
              </h2>
              <p className="text-gray-300 text-lg">
                Experience our AI capabilities firsthand. Interact with our demo to see how it can transform your workflow.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg animate-bounce-in">
                Launch Demo
              </Button>
            </div>
            <div className="relative animate-fade-in-right">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-30 animate-pulse-slow"></div>
              <Card className="p-8 bg-slate-800/50 border-purple-500/20">
                <div className="text-center">
                  <Eye className="text-6xl text-purple-400 mx-auto mb-4 animate-float" />
                  <p className="text-gray-300 text-lg">AI Demo Preview</p>
                  <p className="text-gray-400 mt-2">Interactive AI interface simulation</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 px-6 bg-slate-800/20">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-display mb-12 text-white">What Our Users Say</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="p-6 bg-slate-800/50 border-purple-500/20 animate-fade-in">
                <CardContent className="text-center">
                  <p className="text-gray-300 mb-4">{'"Revolutionary AI that changed how we work!"'}</p>
                  <p className="text-purple-400 font-semibold">- Alex Johnson</p>
                </CardContent>
              </Card>
              <Card className="p-6 bg-slate-800/50 border-purple-500/20 animate-fade-in">
                <CardContent className="text-center">
                  <p className="text-gray-300 mb-4">{'"Intuitive and powerful. Highly recommend!"'}</p>
                  <p className="text-purple-400 font-semibold">- Maria Garcia</p>
                </CardContent>
              </Card>
              <Card className="p-6 bg-slate-800/50 border-purple-500/20 animate-fade-in">
                <CardContent className="text-center">
                  <p className="text-gray-300 mb-4">{'"The future of AI interfaces is here."'}</p>
                  <p className="text-purple-400 font-semibold">- David Lee</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-6">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-display mb-12 text-white">Choose Your Plan</h2>
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <Card className="p-8 bg-slate-800/50 border-purple-500/20 hover:border-purple-500/40 transition-all animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Free</CardTitle>
                  <div className="text-4xl font-bold text-purple-400 mt-4">$0</div>
                  <CardDescription className="text-gray-300 mt-2">Perfect for getting started</CardDescription>
                </CardHeader>
                <CardContent className="mt-6">
                  <ul className="text-gray-300 space-y-2 text-left">
                    <li>✓ Basic AI features</li>
                    <li>✓ 100 queries/month</li>
                    <li>✓ Community support</li>
                  </ul>
                  <Button className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white">Get Started</Button>
                </CardContent>
              </Card>

              <Card className="p-8 bg-slate-800/50 border-purple-500/40 hover:border-purple-500/60 transition-all animate-fade-in relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm">Most Popular</div>
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Pro</CardTitle>
                  <div className="text-4xl font-bold text-purple-400 mt-4">$29</div>
                  <CardDescription className="text-gray-300 mt-2">For growing businesses</CardDescription>
                </CardHeader>
                <CardContent className="mt-6">
                  <ul className="text-gray-300 space-y-2 text-left">
                    <li>✓ Advanced AI models</li>
                    <li>✓ Unlimited queries</li>
                    <li>✓ Priority support</li>
                    <li>✓ API access</li>
                  </ul>
                  <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white animate-glow">Start Free Trial</Button>
                </CardContent>
              </Card>

              <Card className="p-8 bg-slate-800/50 border-purple-500/20 hover:border-purple-500/40 transition-all animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Enterprise</CardTitle>
                  <div className="text-4xl font-bold text-purple-400 mt-4">Custom</div>
                  <CardDescription className="text-gray-300 mt-2">For large organizations</CardDescription>
                </CardHeader>
                <CardContent className="mt-6">
                  <ul className="text-gray-300 space-y-2 text-left">
                    <li>✓ Custom AI solutions</li>
                    <li>✓ Dedicated support</li>
                    <li>✓ On-premise deployment</li>
                    <li>✓ SLA guarantee</li>
                  </ul>
                  <Button className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white">Contact Sales</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-6 border-t border-purple-500/20">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">AINEX</h3>
              <p className="text-gray-400">Next-generation AI interfaces for the future.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-purple-400 transition-colors">Features</a></li>
                <li><a href="#ai-demo" className="hover:text-purple-400 transition-colors">AI Demo</a></li>
                <li><a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-purple-400 transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-purple-400 transition-colors">Contact</a></li>
                <li><a href="#careers" className="hover:text-purple-400 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#help" className="hover:text-purple-400 transition-colors">Help Center</a></li>
                <li><a href="#privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2023 AINEX. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Interview Chatbot - Only for authenticated users */}
      {user && (
        <InterviewChatbot
          isOpen={chatbotOpen}
          onClose={() => setChatbotOpen(false)}
          onInterviewGenerated={handleInterviewGenerated}
          onToggle={() => setChatbotOpen(true)}
        />
      )}
    </div>
  );
}
