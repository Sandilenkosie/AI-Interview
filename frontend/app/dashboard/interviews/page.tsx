"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Star, Brain, User } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useUser } from "@stackframe/stack";

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

export default function InterviewsPage() {
  const user = useUser();
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentInterview, setCurrentInterview] = useState<Interview | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponse, setUserResponse] = useState("");
  const [chatMessages, setChatMessages] = useState<{type: 'ai' | 'user', content: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);


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

  const handleUserResponse = () => {
    if (!userResponse.trim()) return;

    // Add user message locally
    setChatMessages(prev => [...prev, {type: 'user', content: userResponse}]);
    setIsTyping(true);

    // If we have a current interview, send the answer to backend for evaluation
    if (currentInterview) {
      (async () => {
        try {
          const res = await fetch(`/api/interviews/${currentInterview.id}/answer/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ answer_text: userResponse, question_index: currentQuestionIndex }),
          });

          if (res.ok) {
            const data = await res.json();
            // Prefer structured follow_up if provided
            const followUp = data.feedback && data.feedback.follow_up ? data.feedback.follow_up : null;
            const aiText = followUp || (data.ai || 'Thank you.');
            setChatMessages(prev => [...prev, {type: 'ai', content: aiText}]);

            if (!followUp) {
              // Move to next question if available
              const nextIndex = currentQuestionIndex + 1;
              if (nextIndex < currentInterview.questions.length) {
                setCurrentQuestionIndex(nextIndex);
                setChatMessages(prev => [...prev, {type: 'ai', content: `Next question: ${currentInterview.questions[nextIndex]}`}]);
              } else {
                // Interview finished
                setChatMessages(prev => [...prev, {type: 'ai', content: `Interview complete. Summary feedback: ${data.feedback && data.feedback.feedback ? data.feedback.feedback : 'No summary available.'}`}]);
              }
            }
          } else {
            const text = await res.text();
            console.error('Answer endpoint error', text);
            setChatMessages(prev => [...prev, {type: 'ai', content: 'Sorry, there was an error processing your answer.'}]);
          }
        } catch (e) {
          console.error(e);
          setChatMessages(prev => [...prev, {type: 'ai', content: 'Error contacting server.'}]);
        } finally {
          setIsTyping(false);
          setUserResponse('');
        }
      })();
    } else {
      // Fallback: Simulate AI response with dummy data
      setTimeout(() => {
        const dummyResponses = [
          "That's a great answer! Can you elaborate more on your experience with this technology?",
          "Interesting perspective. How would you handle a situation where the requirements changed midway through the project?",
          "Good point. What tools or frameworks would you use to solve this problem?",
          "Excellent! How do you stay updated with the latest industry trends?",
          "That's a solid approach. Can you walk me through your problem-solving process?",
          "Nice! How do you handle working under tight deadlines?",
          "Great answer. What are your thoughts on code quality and best practices?",
          "Interesting. How do you approach learning new technologies?",
          "Good insight. How do you handle disagreements with team members about technical decisions?",
          "Excellent! That's all for this interview. Thank you for your responses!"
        ];

        const randomResponse = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
        setChatMessages(prev => [...prev, {type: 'ai', content: randomResponse}]);
        setIsTyping(false);
      }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds

      setUserResponse('');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const fd = new FormData();
        fd.append('file', blob, 'recording.webm');

        try {
          const res = await fetch('/api/interviews/voice/stt/', {
            method: 'POST',
            body: fd,
          });
          if (res.ok) {
            const j = await res.json();
            const text = j.text || j.transcription || j.transcript || (j.data && j.data.text) || '';
            if (text) {
              setUserResponse(text);
              // auto-submit
              setTimeout(() => handleUserResponse(), 200);
            } else {
              alert('No transcription returned');
            }
          } else {
            console.error('STT error', await res.text());
            alert('Transcription failed');
          }
        } catch (err) {
          console.error('STT request failed', err);
          alert('Transcription request failed');
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Microphone permission error', err);
      alert('Could not access microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  const generateInterview = async () => {
    const defaultRole = "Software Engineer";
    const defaultType = "technical";
    const defaultLevel = "intermediate";
    const defaultNumQuestions = 5;

    setSheetOpen(true);
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
        setCurrentInterview(newInterview);
        setCurrentQuestionIndex(0);
        setChatMessages([{type: 'ai', content: `Welcome! Let's start your ${newInterview.role} interview. Here's the first question: ${newInterview.questions[0]}`}]);
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
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                      <SheetTrigger asChild>
                        <Button
                          disabled={generating}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          {generating ? 'Generating...' : 'Generate Interview'}
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-[800px] sm:w-[1200px] bg-slate-800 border-slate-600">
                        <SheetHeader>
                          <SheetTitle className="text-white">
                            Generating Interview
                          </SheetTitle>
                        </SheetHeader>
                        <div className="mt-4 text-gray-300 h-full flex flex-col">
                          <div className="flex-1 overflow-y-auto space-y-4 p-4">
                            {chatMessages.map((msg, index) => (
                              <div key={index} className={`flex items-end gap-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.type === 'ai' && <Brain className="size-6 text-purple-400" />}
                                <div className={`max-w-[70%] p-3 rounded-lg ${msg.type === 'user' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-gray-200'}`}>
                                  {msg.content}
                                </div>
                                {msg.type === 'user' && <User className="size-6 text-purple-400" />}
                              </div>
                            ))}

                            {isTyping && (
                              <div className="flex items-end gap-2 justify-start">
                                <Brain className="size-6 text-purple-400 animate-pulse" />
                                <div className="bg-slate-700 text-gray-200 p-3 rounded-lg flex items-center gap-2">
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                  </div>
                                  <span className="text-sm">AI is thinking...</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="p-4 border-t border-slate-600">
                            <div className="flex gap-2">
                              <Input
                                value={userResponse}
                                onChange={(e) => setUserResponse(e.target.value)}
                                placeholder="Type your answer..."
                                className="bg-slate-700 border-slate-600 text-white"
                                onKeyPress={(e) => e.key === 'Enter' && handleUserResponse()}
                              />
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => (recording ? stopRecording() : startRecording())}
                                  className={`px-3 py-2 rounded-lg ${recording ? 'bg-red-600 text-white' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                                >
                                  {recording ? 'Stop' : '🎤'}
                                </button>
                                <Button onClick={handleUserResponse} className="bg-purple-600 hover:bg-purple-700">
                                  Send
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
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