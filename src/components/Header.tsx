
import { Button } from "@/components/ui/button";
import { useApiKey } from "@/contexts/ApiKeyContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ApiKeyForm from "./ApiKeyForm";
import { Wind } from "lucide-react";

const Header = () => {
  const { isKeyValid } = useApiKey();

  return (
    <header className="p-4 border-b bg-white shadow-sm">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wind className="text-primary h-6 w-6" />
          <h1 className="text-xl font-bold text-primary">ClearCity</h1>
        </div>
        
        {isKeyValid ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Change API Key</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update API Key</DialogTitle>
                <DialogDescription>
                  Enter a new OpenWeatherMap API key to continue using ClearCity.
                </DialogDescription>
              </DialogHeader>
              <ApiKeyForm />
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
