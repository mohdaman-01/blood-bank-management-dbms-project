import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Droplet, 
  LogOut, 
  Home, 
  Users, 
  Activity, 
  Shield, 
  Menu, 
  X,
  Bell,
  Search,
  ChevronRight,
  AlertTriangle,
  Calendar,
  Heart
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { apiService } from "@/lib/api";

interface BloodItem {
  id: number;
  bloodGroup: string;
  quantity: number;
  expiryDate: string;
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [expiringStock, setExpiringStock] = useState<BloodItem[]>([]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadExpiringStock();
    }
  }, [user]);

  const loadExpiringStock = async () => {
    try {
      const stockData = await apiService.getAllStock();
      const expiring = stockData.filter((item: BloodItem) => {
        const days = getDaysUntilExpiry(item.expiryDate);
        return days <= 7 && days >= 0;
      });
      setExpiringStock(expiring);
    } catch (error) {
      console.error("Failed to load expiring stock:", error);
      setExpiringStock([]);
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/auth');
  };
  
  const getNavItems = () => {
    if (user?.role === 'ADMIN') {
      return [
        { path: "/", label: "Dashboard", icon: Home, color: "text-primary" },
        { path: "/donor", label: "Donors", icon: Users, color: "text-info" },
        { path: "/blood-stock", label: "Blood Stock", icon: Droplet, color: "text-success" },
        { path: "/admin", label: "Admin Panel", icon: Shield, color: "text-warning" },
      ];
    }

    return [
      { path: "/", label: "Dashboard", icon: Home, color: "text-primary" },
      { path: "/donor", label: "Donors", icon: Users, color: "text-info" },
      { path: "/request-blood", label: "Request Blood", icon: Heart, color: "text-destructive" },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Modern Floating Sidebar - Desktop */}
      <aside className={`fixed left-4 top-4 bottom-4 z-40 hidden lg:flex flex-col bg-card/40 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl shadow-primary/5 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-info rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity animate-glow" />
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-info flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Droplet className="w-6 h-6 text-white animate-float" fill="currentColor" />
              </div>
            </div>
            {!sidebarCollapsed && (
              <div className="animate-fade-in">
                <h1 className="text-xl font-bold text-gradient">LifeFlow</h1>
                <p className="text-xs text-muted-foreground">Blood Bank System</p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-info text-white shadow-lg shadow-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                style={{
                  animation: 'slide-in-left 0.3s ease-out forwards',
                  animationDelay: `${index * 50}ms`,
                  opacity: 0
                }}
              >
                {isActive && !sidebarCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                )}
                <div className={`${sidebarCollapsed ? 'w-full flex justify-center' : ''}`}>
                  <div className={`p-2 rounded-xl transition-all duration-300 ${
                    isActive ? "bg-white/20" : "bg-muted/50 group-hover:bg-muted"
                  }`}>
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : item.color}`} />
                  </div>
                </div>
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
                {isActive && !sidebarCollapsed && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <div className={`flex items-center gap-3 p-3 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/20 hover:bg-white/40 transition-all cursor-pointer ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center border border-primary/20">
              {user?.role === 'ADMIN' ? (
                <Shield className="w-5 h-5 text-primary" />
              ) : (
                <Activity className="w-5 h-5 text-primary" />
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.role === 'ADMIN' ? 'Administrator' : 'User'}
                </p>
              </div>
            )}
          </div>
          
          <Button
            onClick={handleLogout}
            variant="ghost"
            className={`w-full mt-2 gap-2 hover:bg-destructive/10 hover:text-destructive ${
              sidebarCollapsed ? 'px-2' : ''
            }`}
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && <span>Logout</span>}
          </Button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-4 top-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-gradient-to-r hover:from-primary hover:to-info hover:text-white hover:border-transparent transition-all duration-300 shadow-xl hover:scale-110 hover:shadow-primary/30"
        >
          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
        </button>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center shadow-lg">
              <Droplet className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="font-bold text-gradient">LifeFlow</span>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed top-16 right-0 bottom-0 w-80 bg-card border-l border-border/50 z-50 overflow-y-auto animate-slide-in-right">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-info/10 border border-primary/20">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-info/30 flex items-center justify-center">
                  {user?.role === 'ADMIN' ? (
                    <Shield className="w-6 h-6 text-primary" />
                  ) : (
                    <Activity className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.role === 'ADMIN' ? 'Administrator' : 'User'}
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-primary to-info text-white shadow-lg"
                          : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </Link>
                  );
                })}
              </nav>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full gap-2 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-28' : 'lg:pl-80'}`}>
        {/* Floating Top Bar */}
        <div className="sticky top-4 z-30 hidden lg:block px-6 animate-fade-in">
          <div className="flex items-center justify-between h-16 px-6 rounded-3xl bg-card/40 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-primary/5">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-info/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="flex items-center gap-4 flex-1 max-w-2xl relative z-10">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search anything..."
                  className="pl-11 h-11 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:bg-white/80 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-muted/50 text-xs text-muted-foreground font-medium">
                  ⌘K
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 relative z-10">
              {/* Notification Bell - Admin Only */}
              {user?.role === 'ADMIN' && (
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setNotificationOpen(!notificationOpen)}
                    className="relative w-10 h-10 rounded-xl hover:bg-white/50 transition-all hover:scale-110"
                  >
                    <Bell className="w-5 h-5" />
                    {expiringStock.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full animate-pulse">
                        <span className="absolute inset-0 bg-destructive rounded-full animate-ping" />
                      </span>
                    )}
                  </Button>

                  {/* Notification Dropdown */}
                  {notificationOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setNotificationOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-96 bg-card/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50 animate-scale-in">
                        {/* Header */}
                        <div className="p-4 border-b border-border/50 bg-gradient-to-r from-destructive/10 to-transparent">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 text-destructive" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-sm">Expiry Alerts</h3>
                                <p className="text-xs text-muted-foreground">
                                  {expiringStock.length} items expiring soon
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setNotificationOpen(false)}
                              className="w-6 h-6 rounded-lg hover:bg-muted/50 flex items-center justify-center transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                          {expiringStock.length === 0 ? (
                            <div className="p-8 text-center">
                              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                                <Bell className="w-6 h-6 text-success" />
                              </div>
                              <p className="text-sm font-medium text-foreground">All Clear!</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                No blood samples expiring soon
                              </p>
                            </div>
                          ) : (
                            <div className="p-2 space-y-2">
                              {expiringStock.map((item, index) => {
                                const days = getDaysUntilExpiry(item.expiryDate);
                                return (
                                  <Link
                                    key={item.id}
                                    to="/blood-stock"
                                    onClick={() => setNotificationOpen(false)}
                                    className="block p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 group"
                                    style={{
                                      animation: 'fade-in 0.3s ease-out forwards',
                                      animationDelay: `${index * 50}ms`,
                                      opacity: 0
                                    }}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <Droplet className="w-5 h-5 text-destructive" fill="currentColor" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                          <p className="font-semibold text-sm text-foreground">
                                            Blood Group {item.bloodGroup}
                                          </p>
                                          <span className="px-2 py-0.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium">
                                            {days}d left
                                          </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-1">
                                          {item.quantity} units available
                                        </p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <Calendar className="w-3 h-3" />
                                          <span>Expires: {item.expiryDate}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        {expiringStock.length > 0 && (
                          <div className="p-3 border-t border-border/50 bg-muted/20">
                            <Link
                              to="/blood-stock"
                              onClick={() => setNotificationOpen(false)}
                              className="block text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                              View All Stock →
                            </Link>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {/* User Avatar */}
              <div className="ml-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 hover:bg-white/70 transition-all cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  {user?.role === 'ADMIN' ? (
                    <Shield className="w-4 h-4 text-white" />
                  ) : (
                    <Activity className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="hidden xl:block">
                  <p className="text-xs font-semibold text-foreground leading-none">
                    {user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.role === 'ADMIN' ? 'Admin' : 'User'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 lg:p-8 pt-20 lg:pt-24 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>

      {/* Modern Floating Footer */}
      <footer className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-28' : 'lg:pl-80'}`}>
        <div className="mx-4 lg:mx-6 mb-4 rounded-3xl bg-card/40 backdrop-blur-2xl border border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center">
                  <Droplet className="w-4 h-4 text-primary" fill="currentColor" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">LifeFlow</p>
                  <p className="text-xs text-muted-foreground">© 2025 All rights reserved</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-success/10 border border-success/20">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-medium text-success">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
