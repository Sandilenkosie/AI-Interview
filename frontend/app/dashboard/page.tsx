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
  const [chatbotOpen, setChatbotOpen] = useState(false);


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

  // Generation is handled via a dedicated chatbot/modal — keep dashboard page focused on listing.

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
        chatbotOpen={chatbotOpen}
        setChatbotOpen={setChatbotOpen}
        handleInterviewGenerated={handleInterviewGenerated}
      />
    </DashboardLayout>
  );
}
