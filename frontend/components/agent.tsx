"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, User as UserIcon } from "lucide-react";
import { stackClientApp } from "../stack/client";
import { vapi } from "@/lib/vapi.sdk";

enum CallStatus {
  INACTIVE = 'inactive',
  CONNECTING = 'connecting',
  ACTIVE = 'active',
  FINISHED = 'finished'
}

interface saveMessage {
  role: 'user' | 'ai' | 'system';
  content: string;
};

interface AgentProps {
  userName?: string | null;
  userId?: string;
  type?: string;
}

interface Message {
  type: string;
  transcriptType?: string;
  role: 'user' | 'ai' | 'system';
  transcript?: string;
}

export const Agent = ({ userName, userId}: AgentProps) => {
  const router = useRouter();

  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<saveMessage[]>([]);

  useEffect(() => {
    const oncallStart = () => setCallStatus(CallStatus.ACTIVE);
    const oncallEnd = () => setCallStatus(CallStatus.FINISHED);
  
    const onMessage = (message: Message) => {
      if(message.type === 'transcript' && message.transcriptType === 'final') {
            if (message.transcript) {
              const newMessage = { role: message.role, content: message.transcript };
              setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
      }
    }

  const onSpeechStart = () => setIsSpeaking(true);
  const onSpeechEnd = () => setIsSpeaking(false);

  const onError = (error: Error) => console.error('Call error:', error);

  vapi.on('call-start', oncallStart);
  vapi.on('call-end', oncallEnd);
  vapi.on('message', onMessage);
  vapi.on('speech-start', onSpeechStart);
  vapi.on('speech-end', onSpeechEnd);
  vapi.on('error', onError);

  return () => {
    vapi.off('call-start', oncallStart);
    vapi.off('call-end', oncallEnd);
    vapi.off('message', onMessage);
    vapi.off('speech-start', onSpeechStart);
    vapi.off('speech-end', onSpeechEnd);
    vapi.off('error', onError);
  };
  }, []);

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) router.push('/');
  }, [messages, callStatus, router]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING); 

    await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
      variableValues: {
        username: userName,
        userid: userId,
      }
    });
  }

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    await vapi.stop();
  }

  const lastestMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <DashboardLayout activeTab="agent">
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-5xl">
          <div className="flex items-center justify-center gap-6 mb-6">
            <Card className={`flex-1 p-6 bg-slate-800 border-2 transition-all duration-300 ${
              isSpeaking ? 'border-purple-400 shadow-lg shadow-purple-400/20' : 'border-slate-600'
            }`}>
              <CardContent>
                <div className="text-center text-sm text-gray-300 min-h-[120px] flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-purple-400/20 rounded-full flex items-center justify-center mb-4">
                    <Brain className="w-12 h-12 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`flex-1 p-6 bg-slate-800 border-2 transition-all duration-300 ${
              isSpeaking ? 'border-purple-400 shadow-lg shadow-purple-400/20' : 'border-slate-600'
            }`}>
              <CardContent>
                <div className="text-center text-sm text-gray-300 min-h-[120px] flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-purple-400/20 rounded-full flex items-center justify-center mb-4">
                    <UserIcon className="w-12 h-12 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current prompt display */}
          <div className="bg-slate-800 border border-slate-600 rounded-2xl p-6 mb-24">
            <div className="text-center">
              {isSpeaking ? (
                <div className="text-lg text-white bg-slate-700 px-6 py-4 rounded-xl">
                  {lastestMessage}
                </div>
              ) : (
                <div className="text-gray-400 py-8">
                  <p className="text-lg mb-2">Ready to start your AI call</p>
                  <p className="text-sm">{lastestMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call Button */}
        <div className="flex justify-center">
          {callStatus !== CallStatus.ACTIVE ? (
            <Button
              onClick={handleCall}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl shadow-lg transition-colors duration-300 text-lg font-semibold"
              size="lg"
            >
              <span className={`${callStatus === CallStatus.CONNECTING ? 'animate-pulse' : 'hidden'}`}>...</span>
              <span className={`${callStatus === CallStatus.CONNECTING ? 'hidden' : ''}`}>{isCallInactiveOrFinished ? 'Call' : "..."}</span>
            </Button>
          ) : (
            <Button
              onClick={handleDisconnect}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl shadow-lg transition-colors duration-300 text-lg font-semibold"
              size="lg"
            >
              End Call
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function AgentPageWrapper() {
  if (!stackClientApp) {
    return (
      <DashboardLayout activeTab="agent">
        <div className="container mx-auto px-8 py-8">
          <div className="text-center text-gray-400 py-16 bg-slate-800 rounded-2xl border border-slate-600">
            <h2 className="text-2xl font-semibold">Agent unavailable</h2>
            <p className="mt-2 text-sm">Authentication is not configured.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return <Agent />;
}
