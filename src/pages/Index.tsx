
import { ApiKeyProvider } from "@/contexts/ApiKeyContext";
import { useApiKey } from "@/contexts/ApiKeyContext";
import ApiKeyForm from "@/components/ApiKeyForm";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";

const MainApp = () => {
  const { isKeyValid } = useApiKey();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container py-6">
        {isKeyValid ? (
          <Dashboard />
        ) : (
          <div className="flex items-center justify-center flex-col h-full min-h-[80vh]">
            <h2 className="text-2xl font-bold mb-8 text-center text-primary">
              Welcome to Clear Air Watch
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md text-center">
              To get started, please enter your OpenWeatherMap API key below.
              This will allow us to fetch air quality data for any location on the map.
            </p>
            <ApiKeyForm />
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
