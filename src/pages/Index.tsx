
import { useState } from "react";
import { ApiKeyProvider } from "@/contexts/ApiKeyContext";
import { useApiKey } from "@/contexts/ApiKeyContext";
import ApiKeyForm from "@/components/ApiKeyForm";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";

const ChatbotButton = ({ onClick }: { onClick: () => void }) => (
  <Button 
    onClick={onClick} 
    className="fixed bottom-6 right-6 rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-10"
    variant="default"
    size="icon"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  </Button>
);

const MainApp = () => {
  const { isKeyValid } = useApiKey();
  const [showChatbot, setShowChatbot] = useState(false);
  
  const toggleChatbot = () => {
    setShowChatbot(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-6">
        {isKeyValid ? (
          <>
            <Dashboard />
            <ChatbotButton onClick={toggleChatbot} />
            {showChatbot && <Chatbot onClose={toggleChatbot} />}
          </>
        ) : (
          <div className="flex items-center justify-center flex-col h-full min-h-[80vh]">
            <div className="content-section bg-white/10 backdrop-blur-sm p-8 max-w-md w-full animate-fade-in border border-border shadow-md">
              <h2 className="text-2xl font-bold mb-8 text-center text-primary">
                Welcome to ClearCity
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md text-center">
                Real-time Urban Pollution Tracker. To get started, please enter your OpenWeatherMap API key below.
                This will allow us to fetch air quality data for cities around the world.
              </p>
              <ApiKeyForm />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <ApiKeyProvider>
      <MainApp />
    </ApiKeyProvider>
  );
};

export default Index;
