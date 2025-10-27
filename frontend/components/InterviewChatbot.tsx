"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Brain, Send, X, Loader2, User } from "lucide-react";

// Small typed wrapper for browser SpeechRecognition to avoid `any` and satisfy TS
type SpeechRecognitionResultArray = { [i: number]: { [j: number]: { transcript: string } } };

type SpeechRecognitionEventLike = {
  results: SpeechRecognitionResultArray;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives?: number;
  onresult?: (e: SpeechRecognitionEventLike) => void;
  onerror?: (e: Event) => void;
  onend?: () => void;
  start: () => void;
  stop: () => void;
};

interface SpeechRecognitionConstructorLike {
  new (): SpeechRecognitionLike;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructorLike;
    webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
  }
}

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

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface InterviewChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onInterviewGenerated: (interviewData: Interview) => void;
  onToggle?: () => void;
}

export default function InterviewChatbot({ isOpen, onClose, onInterviewGenerated, onToggle }: InterviewChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hi! I'm your AI interview assistant. I can help you generate custom interview questions. What role would you like to prepare for?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [recognizing, setRecognizing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const steps = [
    { field: "role", question: "What job role would you like to prepare for?", placeholder: "e.g. Software Engineer" },
    { field: "type", question: "What type of interview? (Technical, HR, Behavioral)", placeholder: "e.g. Technical" },
    { field: "level", question: "What experience level? (Beginner, Intermediate, Advanced)", placeholder: "e.g. Intermediate" },
    { field: "questions", question: "How many questions would you like?", placeholder: "e.g. 5" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition (if available) when component mounts
  useEffect(() => {
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionConstructor) return;
    try {
      const r = new SpeechRecognitionConstructor();
      r.lang = 'en-US';
      r.interimResults = false;
      r.maxAlternatives = 1;
      r.onresult = (event: SpeechRecognitionEventLike) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? prev + ' ' + transcript : transcript));
        setRecognizing(false);
      };
      r.onerror = () => setRecognizing(false);
      r.onend = () => setRecognizing(false);
      recognitionRef.current = r;
    } catch {
      // ignore
    }
  }, []);

  // When a new bot message is added, optionally speak it using the browser TTS
  useEffect(() => {
    if (!speechEnabled) return;
    const last = messages.slice().reverse().find(m => m.type === 'bot');
    if (!last) return;
    // Speak the last bot message
    try {
      const utter = new SpeechSynthesisUtterance(last.content);
      utter.lang = 'en-US';
      // Choose a voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const voice = voices.find(v => /en|alloy|female|male/i.test(v.name)) || voices[0];
        if (voice) utter.voice = voice as SpeechSynthesisVoice;
      }
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch {
      // ignore TTS errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const generateBotResponse = async (userInput: string, step: number) => {
    setIsTyping(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    let response = "";

    switch (step) {
      case 0:
        response = `Great! I'll help you prepare for a ${userInput} interview. ${steps[1].question}`;
        break;
      case 1:
        response = `Perfect! ${userInput} interview it is. ${steps[2].question}`;
        break;
      case 2:
        response = `Excellent choice for ${userInput} level. ${steps[3].question}`;
        break;
      case 3:
        const numQuestions = parseInt(userInput);
        if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 20) {
          response = "Please enter a number between 1 and 20. How many questions would you like?";
          setCurrentStep(3);
        } else {
          response = `Perfect! I'll generate ${numQuestions} interview questions for you. Let me create that now...`;

          // Generate the interview
          try {
            const interviewResponse = await fetch('/api/interviews/create/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                role: messages.find(m => m.type === "user" && steps[0].field === "role")?.content || "Software Engineer",
                type: messages.find(m => m.type === "user" && steps[1].field === "type")?.content || "Technical",
                level: messages.find(m => m.type === "user" && steps[2].field === "level")?.content || "Intermediate",
                num_questions: numQuestions,
              }),
            });

            if (interviewResponse.ok) {
              const interviewData = await interviewResponse.json();
              response += "\n\n✅ Interview generated successfully! You can view it in your dashboard.";

              // Notify parent component
              onInterviewGenerated(interviewData);
            } else {
              response += "\n\n❌ There was an error generating your interview. Please try again.";
            }
          } catch {
            response += "\n\n❌ There was an error generating your interview. Please try again.";
          }

          setCurrentStep(-1); // End conversation
        }
        break;
      default:
        response = "I'm ready to help you with another interview! What role would you like to prepare for?";
        setCurrentStep(0);
    }

    setIsTyping(false);
    return response;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const botResponse = await generateBotResponse(input, currentStep);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: botResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const startRecognition = () => {
    const r = recognitionRef.current;
    if (!r) return;
    try {
      setRecognizing(true);
      r.start();
    } catch {
      setRecognizing(false);
    }
  };

  const stopRecognition = () => {
    const r = recognitionRef.current;
    if (!r) return;
    try {
      r.stop();
      setRecognizing(false);
    } catch {
      setRecognizing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Always render, but change size and content based on isOpen state

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isOpen ? "chatbot-expand" : "chatbot-collapse"
      }`}
      style={{
        width: isOpen ? '384px' : '56px',
        height: isOpen ? '500px' : '56px',
      }}
    >
      <Card
        className="h-full w-full bg-gradient-to-br from-slate-800/95 to-slate-900/95 border-purple-500/30 backdrop-blur-md shadow-2xl transition-all duration-300"
        style={{
          borderRadius: isOpen ? '12px' : '50%',
        }}
      >
        {isOpen ? (
          <CardHeader className=" text-white rounded-t-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Brain className="size-7 animate-pulse text-purple-200" />
                  <div className="absolute -top-1 -right-1 size-3 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Chat Assistant</CardTitle>
                  <div className="text-sm opacity-90">AI-Powered Interview Helper</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/30 transition-all duration-200 rounded-full p-2"
              >
                <X className="size-6" />
              </Button>
            </div>
          </CardHeader>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Button
              className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 animate-bounce-in"
              onClick={onToggle}
              style={{
                width: '56px',
                borderRadius: '50%',
              }}
            >
              <Brain className="animate-pulse size-6" />
            </Button>
          </div>
        )}

        {isOpen && (
          <CardContent className="p-0 flex flex-col" style={{ height: 'calc(100% - 80px)' }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "bot" && <Brain className="size-6 text-purple-400" />}
                <div
                  className={`max-w-[75%] p-4 rounded-2xl shadow-lg transition-all duration-200 ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                      : "bg-gradient-to-r from-slate-600 to-slate-700 text-gray-200"
                  }`}
                >
                  <div className="text-sm leading-relaxed">{message.content}</div>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                {message.type === "user" && <User className="size-6 text-purple-400" />}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-end gap-2 justify-start">
                <Brain className="size-6 text-purple-400" />
                <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-gray-200 p-4 rounded-2xl shadow-lg flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-purple-500/20 bg-slate-800/50">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={steps[currentStep]?.placeholder || "Type your message..."}
                className="bg-slate-700/80 border-purple-500/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 rounded-full"
                disabled={isTyping}
              />
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full px-4"
                >
                  <Send className="size-4" />
                </Button>

                {/* Voice input toggle */}
                <Button
                  variant={recognizing ? "destructive" : "ghost"}
                  onClick={() => (recognizing ? stopRecognition() : startRecognition())}
                  className="text-white p-2 rounded-full"
                >
                  {recognizing ? 'Stop' : 'Voice'}
                </Button>

                {/* TTS toggle */}
                <Button
                  variant={speechEnabled ? "secondary" : "ghost"}
                  onClick={() => setSpeechEnabled(s => !s)}
                  className="text-white p-2 rounded-full"
                >
                  {speechEnabled ? 'TTS On' : 'TTS Off'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        )}
      </Card>
    </div>
  );
}