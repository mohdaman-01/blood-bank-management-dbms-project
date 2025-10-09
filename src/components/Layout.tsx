import { Link, useLocation, useNavigate } from "react-router-dom";
import { Droplet, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/auth');
  };
  
  // Role-based navigation items
  const getNavItems = () => {
    const baseItems = [
      { path: "/", label: "Home" },
      { path: "/donor", label: "Donor" },
    ];

    if (user?.role === 'ADMIN') {
      return [
        ...baseItems,
        { path: "/blood-stock", label: "Blood Stock" },
        { path: "/admin", label: "Admin Panel" },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50 transition-all duration-300" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Droplet className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h1 className="text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">Blood Bank Management</h1>
            </Link>
            
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    ...(location.pathname === item.path && { boxShadow: 'var(--shadow-primary)' })
                  }}
                >
                  {location.pathname !== item.path && (
                    <span className="absolute inset-0 bg-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              ))}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="ml-2 gap-2 transition-all duration-300 hover:scale-105"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-card/50 backdrop-blur-sm border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p className="transition-colors duration-300 hover:text-foreground">© 2025 Blood Bank Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
