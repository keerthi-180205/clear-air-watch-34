
import { ApiKeyProvider } from "@/contexts/ApiKeyContext";
import { useApiKey } from "@/contexts/ApiKeyContext";
import ApiKeyForm from "@/components/ApiKeyForm";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";

const MainApp = () => {
  const { isKeyValid } = useApiKey();

  return (
    <div className="min-h-screen flex flex-col bg-[#33C3F0]">
      <div className="pattern-overlay"></div>
      <Header />
      <main className="flex-1 container py-6 text-white">
        {isKeyValid ? (
          <Dashboard />
        ) : (
          <div className="flex items-center justify-center flex-col h-full min-h-[80vh]">
            <div className="content-section bg-white/10 backdrop-blur-sm p-8 max-w-md w-full animate-fade-in border border-white/20">
              <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Welcome to ClearCity
              </h2>
              <p className="text-white/80 mb-8 max-w-md text-center">
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
