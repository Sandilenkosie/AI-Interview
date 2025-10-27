"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus, Calendar, Users, MessageSquare, Zap, Star, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
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

interface DashboardContainerProps {
  interviews: Interview[];
  loading: boolean;
  chatbotOpen: boolean;
  setChatbotOpen: (open: boolean) => void;
  handleInterviewGenerated: (interviewData: Interview) => void;
}

export default function DashboardContainer({
  interviews,
  loading,
  chatbotOpen,
  setChatbotOpen,
  handleInterviewGenerated,
}: DashboardContainerProps) {
  const router = useRouter();

  return (
    <>
      {/* Interview Chatbot */}
      <InterviewChatbot
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        onInterviewGenerated={handleInterviewGenerated}
        onToggle={() => setChatbotOpen(true)}
      />

      <main className="relative z-10 pb-16 pt-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Welcome Section */}
          <section className="mb-16">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-full px-6 py-3 mb-6">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-slate-200 font-medium">AI-Powered Interview Platform</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                Welcome to your{' '}
                <span className="text-purple-400">
                  AI<span className="text-purple-300">NEX</span>
                </span>{' '}
                Dashboard
              </h1>
              <p className="text-gray-300 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-8 leading-relaxed">
                Monitor your AI usage, manage your models, and explore powerful features all in one place.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl shadow-lg transition-colors duration-300 text-sm md:text-base"
                  onClick={() => setChatbotOpen(true)}
                >
                  <Plus className="mr-2 md:mr-3 size-5 md:size-6" />
                  Create Interview
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl transition-colors duration-300 text-sm md:text-base">
                  <TrendingUp className="mr-2 md:mr-3 size-5 md:size-6" />
                  View Analytics
                </Button>
              </div>
            </div>
          </section>

          {/* Recent Interviews */}
          <section id="recent-interviews" className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-slate-800 rounded-2xl border border-slate-600">
                <Calendar className="size-8 text-slate-300" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-display text-white mb-2">
                  Recent{' '}
                  <span className="text-purple-400">
                    Interviews
                  </span>
                </h2>
                <div className="w-24 h-1 bg-purple-400 rounded-full"></div>
              </div>
            </div>
            {loading ? (
              <div className="text-center text-gray-400 py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
                <p className="text-lg md:text-xl">Loading interviews...</p>
              </div>
            ) : interviews.length > 0 ? (
              <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {interviews.slice(0, 6).map((interview) => (
                  <Card key={interview.id} className="p-4 md:p-6 bg-slate-800 border-slate-600 hover:border-slate-500 hover:shadow-lg transition-all duration-300 group rounded-2xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-400 rounded-xl flex items-center justify-center">
                          <Star className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <span className="text-xs text-slate-300 bg-slate-700 px-2 py-1 rounded-full">Active</span>
                      </div>
                      <CardTitle className="text-white text-lg md:text-xl group-hover:text-purple-300 transition-colors duration-300 font-bold">{interview.role}</CardTitle>
                      <CardDescription className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 text-sm md:text-base">
                        {interview.interview_type} • {interview.experience_level} • {interview.num_questions} questions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-gray-400 text-sm mb-4 md:mb-6 group-hover:text-gray-300 transition-colors duration-300">
                        Created: {new Date(interview.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-colors duration-300 rounded-lg flex-1 text-sm"
                          onClick={() => router.push(`/interview/${interview.id}`)}
                        >
                          View Questions
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-400 transition-colors duration-300 rounded-lg text-sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this interview?')) {
                              // Delete interview logic here
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12 md:py-16 bg-slate-800 rounded-2xl border border-slate-600">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="size-8 md:size-10 text-gray-500" />
                </div>
                <p className="text-xl md:text-2xl mb-2">No interviews generated yet</p>
                <p className="text-gray-500 text-sm md:text-base">Create your first interview using the form above</p>
              </div>
            )}
          </section>

          {/* Community Interviews */}
          <section id="community">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-slate-800 rounded-2xl border border-slate-600">
                <Users className="size-8 text-slate-300" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-display text-white mb-2">
                  Community{' '}
                  <span className="text-purple-400">
                    Interviews
                  </span>
                </h2>
                <div className="w-24 h-1 bg-purple-400 rounded-full"></div>
              </div>
            </div>
            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Sample community interviews */}
              <Card className="p-4 md:p-6 bg-slate-800 border-slate-600 hover:border-slate-500 hover:shadow-lg transition-all duration-300 group rounded-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-400 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <span className="text-xs text-slate-300 bg-slate-700 px-2 py-1 rounded-full">Community</span>
                  </div>
                  <CardTitle className="text-white text-lg md:text-xl group-hover:text-purple-300 transition-colors duration-300 font-bold">Frontend Developer</CardTitle>
                  <CardDescription className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 text-sm md:text-base">
                    Technical • Intermediate • 8 questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-400 text-sm mb-4 md:mb-6 group-hover:text-gray-300 transition-colors duration-300">
                    Created by: Community User
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-colors duration-300 rounded-lg text-sm"
                  >
                    View Interview
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-4 md:p-6 bg-slate-800 border-slate-600 hover:border-slate-500 hover:shadow-lg transition-all duration-300 group rounded-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-400 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <span className="text-xs text-slate-300 bg-slate-700 px-2 py-1 rounded-full">Community</span>
                  </div>
                  <CardTitle className="text-white text-lg md:text-xl group-hover:text-purple-300 transition-colors duration-300 font-bold">Product Manager</CardTitle>
                  <CardDescription className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 text-sm md:text-base">
                    Behavioral • Advanced • 10 questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-400 text-sm mb-4 md:mb-6 group-hover:text-gray-300 transition-colors duration-300">
                    Created by: Community User
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-colors duration-300 rounded-lg text-sm"
                  >
                    View Interview
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-4 md:p-6 bg-slate-800 border-slate-600 hover:border-slate-500 hover:shadow-lg transition-all duration-300 group rounded-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-400 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <span className="text-xs text-slate-300 bg-slate-700 px-2 py-1 rounded-full">Community</span>
                  </div>
                  <CardTitle className="text-white text-lg md:text-xl group-hover:text-purple-300 transition-colors duration-300 font-bold">Data Scientist</CardTitle>
                  <CardDescription className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 text-sm md:text-base">
                    Technical • Beginner • 6 questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-400 text-sm mb-4 md:mb-6 group-hover:text-gray-300 transition-colors duration-300">
                    Created by: Community User
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-colors duration-300 rounded-lg text-sm"
                  >
                    View Interview
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}