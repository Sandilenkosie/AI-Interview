"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardContainer from "@/components/DashboardContainer";

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

export default function DashboardPage() {
  const user = useUser();
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  // Interview generation form state
  const [role, setRole] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);


  // Redirect if not signed in
  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
    }
  }, [user, router]);

  // Fetch interviews on component mount
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

  const generateInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !interviewType || !experienceLevel) {
      alert('Please fill in all fields');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/interviews/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          type: interviewType,
          level: experienceLevel,
          num_questions: numQuestions,
        }),
      });

      if (response.ok) {
        const newInterview = await response.json();
        setInterviews([newInterview, ...interviews]);
        // Reset form
        setRole("");
        setInterviewType("");
        setExperienceLevel("");
        setNumQuestions(5);
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

  const handleInterviewGenerated = (interviewData: Interview) => {
    setInterviews([interviewData, ...interviews]);
    setChatbotOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout activeTab="dashboard">
      <DashboardContainer
        interviews={interviews}
        loading={loading}
        generating={generating}
        chatbotOpen={chatbotOpen}
        setChatbotOpen={setChatbotOpen}
        role={role}
        setRole={setRole}
        interviewType={interviewType}
        setInterviewType={setInterviewType}
        experienceLevel={experienceLevel}
        setExperienceLevel={setExperienceLevel}
        numQuestions={numQuestions}
        setNumQuestions={setNumQuestions}
        generateInterview={generateInterview}
        handleInterviewGenerated={handleInterviewGenerated}
      />
    </DashboardLayout>
  );
}
