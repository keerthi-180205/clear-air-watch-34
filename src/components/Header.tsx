
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Map, Users, Info, BookOpen } from "lucide-react";

const Header = () => {
  return (
    <header className="app-header sticky top-0 z-50 bg-[#8B5CF6]">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 transition-all duration-300 hover:scale-105">
          <div className="bg-white/10 p-2 rounded-full">
            <Map className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            ClearCity
          </span>
        </Link>
        <nav>
          <ul className="flex items-center gap-2">
            <li>
              <Link to="/">
                <Button variant="ghost" size="sm" className="btn-interactive hover:bg-white/10 rounded-lg text-white">
                  <Map className="mr-1 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/city-guide">
                <Button variant="ghost" size="sm" className="btn-interactive hover:bg-white/10 rounded-lg text-white">
                  <BookOpen className="mr-1 h-4 w-4" />
                  City Guide
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/community-ideas">
                <Button variant="ghost" size="sm" className="btn-interactive hover:bg-white/10 rounded-lg text-white">
                  <Users className="mr-1 h-4 w-4" />
                  Community Ideas
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/about">
                <Button variant="ghost" size="sm" className="btn-interactive hover:bg-white/10 rounded-lg text-white">
                  <Info className="mr-1 h-4 w-4" />
                  About
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
