"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useUser } from "@stackframe/stack";
import { stackClientApp } from "../../../stack/client";

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

function InterviewsContent() {
  const user = useUser();
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);


  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
    }
  }, [user, router]);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/interviews/');
      if (response.ok) {
        const data = await response.json();
        setInterviews(data);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  

  const generateInterview = async () => {
    const defaultRole = "Software Engineer";
    const defaultType = "technical";
    const defaultLevel = "intermediate";
    const defaultNumQuestions = 5;

  setGenerating(true);
    try {
      const response = await fetch('/api/interviews/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: defaultRole,
          type: defaultType,
          level: defaultLevel,
          num_questions: defaultNumQuestions,
        }),
      });

      if (response.ok) {
        const newInterview = await response.json();
        setInterviews([newInterview, ...interviews]);
        // navigate to the newly created interview
        router.push(`/interview/${newInterview.id}`);
      } else {
        alert('Error generating interview');
      }
    } catch (error) {
      console.error('Error generating interview:', error);
      alert('Error generating interview');
    } finally {
      setGenerating(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout activeTab="interviews">
      <div className="container mx-auto px-8 py-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-display text-white mb-2">
                  <span className="text-purple-400">Interviews</span>
                </h1>
                <div className="w-24 h-1 bg-purple-400 rounded-full"></div>
              </div>

              {/* Generate Interview Form */}
              <section className="mb-8">
                <Card className="p-6 bg-slate-800 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white">Generate New Interview</CardTitle>
                    <CardDescription className="text-gray-300">Create a new AI-powered interview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      disabled={generating}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={generateInterview}
                    >
                      {generating ? 'Generating...' : 'Generate Interview'}
                    </Button>
                  </CardContent>
                </Card>
              </section>

              {/* Interviews List */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-slate-800 rounded-2xl border border-slate-600">
                    <svg className="size-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-4xl font-display text-white mb-2">
                      Your{' '}
                      <span className="text-purple-400">Interviews</span>
                    </h2>
                    <div className="w-24 h-1 bg-purple-400 rounded-full"></div>
                  </div>
                </div>
                {loading ? (
                  <div className="text-center text-gray-400 py-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
                    <p className="text-xl">Loading interviews...</p>
                  </div>
                ) : interviews.length > 0 ? (
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {interviews.map((interview) => (
                      <Card key={interview.id} className="p-6 bg-slate-800 border-slate-600 hover:border-slate-500 hover:shadow-lg transition-all duration-300 group rounded-2xl">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-12 h-12 bg-purple-400 rounded-xl flex items-center justify-center">
                              <Star className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs text-slate-300 bg-slate-700 px-2 py-1 rounded-full">Active</span>
                          </div>
                          <CardTitle className="text-white text-xl group-hover:text-purple-300 transition-colors duration-300 font-bold">{interview.role}</CardTitle>
                          <CardDescription className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 text-base">
                            {interview.interview_type} • {interview.experience_level} • {interview.num_questions} questions
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-gray-400 text-sm mb-6 group-hover:text-gray-300 transition-colors duration-300">
                            Created: {new Date(interview.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex gap-3">
                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-colors duration-300 rounded-lg flex-1"
                              onClick={() => router.push(`/interview/${interview.id}`)}
                            >
                              View Questions
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-400 transition-colors duration-300 rounded-lg"
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
                  <div className="text-center text-gray-400 py-16 bg-slate-800 rounded-2xl border border-slate-600">
                    <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="size-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-2xl mb-2">No interviews generated yet</p>
                    <p className="text-gray-500">Use the form above to create your first interview</p>
                  </div>
                )}
              </section>
      </div>
    </DashboardLayout>
  );
}

export default function InterviewsPageWrapper() {
  // If Stack isn't configured, render a fallback so prerendering doesn't call
  // hooks without a provider.
  if (!stackClientApp) {
    return (
      <DashboardLayout activeTab="interviews">
        <div className="container mx-auto px-8 py-8">
          <div className="text-center text-gray-400 py-16 bg-slate-800 rounded-2xl border border-slate-600">
            <h2 className="text-2xl font-semibold">Interviews unavailable</h2>
            <p className="mt-2 text-sm">Authentication is not configured. Set NEXT_PUBLIC_STACK_PROJECT_ID to enable interviews.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return <InterviewsContent />;
}