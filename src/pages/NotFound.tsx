
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#33C3F0] text-white">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-white/80 mb-4">Oops! Page not found</p>
          <a href="/" className="text-primary-foreground hover:text-white underline">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
