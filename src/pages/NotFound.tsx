import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-mesh px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-destructive/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
      </div>

      <div className="text-center relative z-10 max-w-2xl animate-scale-in">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 mb-8 animate-pulse">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        
        <h1 className="mb-4 text-8xl font-bold bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent animate-fade-in">
          404
        </h1>
        
        <h2 className="mb-4 text-3xl font-bold text-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>
          Page Not Found
        </h2>
        
        <p className="mb-8 text-lg text-muted-foreground max-w-md mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Button
            asChild
            size="lg"
            className="gap-2 bg-gradient-to-r from-primary to-destructive hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
          >
            <Link to="/">
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </Button>
          
          <Button
            asChild
            size="lg"
            variant="outline"
            className="gap-2 transition-all duration-300 hover:scale-105"
            onClick={() => window.history.back()}
          >
            <button>
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </Button>
        </div>

        <p className="mt-12 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '400ms' }}>
          Attempted path: <code className="px-2 py-1 bg-muted rounded text-xs font-mono">{location.pathname}</code>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
