import { Link, useLocation, useNavigate } from "react-router-dom";
import { Droplet, LogOut, Menu, X, User, Shield, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/auth');
    setMobileMenuOpen(false);
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
      {/* Modern Header with Glass Morphism */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-card/95 backdrop-blur-xl shadow-lg border-b border-border/50' 
            : 'bg-card/70 backdrop-blur-md border-b border-border/30'
        }`}
      >
        {/* Top Bar with Gradient Accent */}
        <div className="h-1 bg-gradient-to-r from-primary via-destructive to-primary animate-shimmer bg-[length:200%_100%]" />
        
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 group relative">
              <div className="relative">
                {/* Animated Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-destructive rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500 scale-150" />
                
                {/* Logo Container */}
                <div className="relative bg-gradient-to-br from-primary/20 via-destructive/20 to-primary/20 p-3 rounded-2xl border border-primary/30 shadow-lg group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Droplet className="h-7 w-7 text-primary drop-shadow-lg" fill="currentColor" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-destructive to-primary bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
                  Blood Bank
                </h1>
                <span className="text-xs text-muted-foreground font-medium hidden sm:block">
                  Management System
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-5 py-2.5 rounded-xl font-medium transition-all duration-300 group ${
                    location.pathname === item.path
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Active Background */}
                  {location.pathname === item.path && (
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-destructive rounded-xl shadow-lg shadow-primary/30 animate-scale-in" />
                  )}
                  
                  {/* Hover Background */}
                  {location.pathname !== item.path && (
                    <span className="absolute inset-0 bg-gradient-to-r from-muted/50 to-muted/30 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl" />
                  )}
                  
                  {/* Underline Effect */}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-destructive transition-all duration-300 ${
                    location.pathname === item.path ? 'w-0' : 'w-0 group-hover:w-3/4'
                  }`} />
                  
                  <span className="relative z-10 flex items-center gap-2">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* User Profile Section - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {/* User Info Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 border border-border/50 transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-destructive/20 flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform duration-300">
                      {user?.role === 'ADMIN' ? (
                        <Shield className="w-5 h-5 text-primary" />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="text-left hidden xl:block">
                      <p className="text-sm font-semibold text-foreground leading-none mb-1">
                        {user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.role === 'ADMIN' ? 'Administrator' : 'User'}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl overflow-hidden animate-scale-in">
                    <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-destructive/5">
                      <p className="text-sm font-semibold text-foreground">{user?.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {user?.role === 'ADMIN' ? 'Administrator Account' : 'User Account'}
                      </p>
                    </div>
                    <div className="p-2">
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden relative group"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="relative">
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
                ) : (
                  <Menu className="h-6 w-6 transition-transform duration-300" />
                )}
              </div>
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-6 border-t border-border/50 animate-fade-in bg-gradient-to-b from-transparent to-muted/20">
              {/* User Info - Mobile */}
              <div className="mb-6 px-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-destructive/10 border border-primary/20">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-destructive/30 flex items-center justify-center border border-primary/40">
                    {user?.role === 'ADMIN' ? (
                      <Shield className="w-6 h-6 text-primary" />
                    ) : (
                      <User className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{user?.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.role === 'ADMIN' ? 'Administrator' : 'User'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-2 px-4">
                {navItems.map((item, index) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`relative px-5 py-4 rounded-xl font-medium transition-all duration-300 overflow-hidden group ${
                      location.pathname === item.path
                        ? "text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={{
                      animation: 'slide-in-left 0.3s ease-out forwards',
                      animationDelay: `${index * 50}ms`,
                      opacity: 0
                    }}
                  >
                    {location.pathname === item.path && (
                      <span className="absolute inset-0 bg-gradient-to-r from-primary to-destructive" />
                    )}
                    {location.pathname !== item.path && (
                      <span className="absolute inset-0 bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                    <span className="relative z-10 flex items-center justify-between">
                      {item.label}
                      {location.pathname === item.path && (
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      )}
                    </span>
                  </Link>
                ))}
                
                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full gap-2 mt-4 py-4 rounded-xl border-destructive/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-300"
                  style={{
                    animation: 'slide-in-left 0.3s ease-out forwards',
                    animationDelay: `${navItems.length * 50}ms`,
                    opacity: 0
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Modern Footer */}
      <footer className="relative bg-card/80 backdrop-blur-md border-t border-border/50 mt-auto overflow-hidden">
        {/* Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo & Copyright */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-destructive/20 flex items-center justify-center border border-primary/30">
                <Droplet className="w-5 h-5 text-primary" fill="currentColor" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Blood Bank Management</p>
                <p className="text-xs text-muted-foreground">
                  © 2025 All rights reserved
                </p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 border border-success/20">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-success">System Online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
