
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Map, Users, Info, BookOpen } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90 shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 transition-all duration-300 hover:scale-105">
          <Map className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">ClearCity</span>
        </Link>
        <nav>
          <ul className="flex items-center gap-1">
            <li>
              <Link to="/">
                <Button variant="ghost" size="sm" className="btn-interactive">
                  <Map className="mr-1 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/city-guide">
                <Button variant="ghost" size="sm" className="btn-interactive">
                  <BookOpen className="mr-1 h-4 w-4" />
                  City Guide
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/community-ideas">
                <Button variant="ghost" size="sm" className="btn-interactive">
                  <Users className="mr-1 h-4 w-4" />
                  Community Ideas
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/about">
                <Button variant="ghost" size="sm" className="btn-interactive">
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
