import { Users, Droplets, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

interface Stats {
  totalDonors: number;
  availableUnits: number;
  expiringUnits: number;
}

const Home = () => {
  const [stats, setStats] = useState<Stats>({
    totalDonors: 0,
    availableUnits: 0,
    expiringUnits: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Try to load from API first
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const apiStats = await response.json();
          setStats({
            totalDonors: apiStats.totalDonors || 0,
            availableUnits: apiStats.availableUnits || 0,
            expiringUnits: apiStats.expiringUnits || 0,
          });
          return;
        }
      } catch (error) {
        console.warn('Failed to load stats from API, using localStorage fallback');
      }

      // Fallback to localStorage
      const donors = JSON.parse(localStorage.getItem("donors") || "[]");
      const bloodStock = JSON.parse(localStorage.getItem("bloodStock") || "[]");
      
      const totalUnits = bloodStock.reduce((sum: number, item: any) => sum + item.quantity, 0);
      const expiring = bloodStock.filter((item: any) => {
        const daysUntilExpiry = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 2 && daysUntilExpiry >= 0;
      }).reduce((sum: number, item: any) => sum + item.quantity, 0);

      setStats({
        totalDonors: donors.length,
        availableUnits: user?.role === 'ADMIN' ? totalUnits : 0,
        expiringUnits: user?.role === 'ADMIN' ? expiring : 0,
      });
    };

    if (user) {
      loadStats();
    }
  }, [user]);

  // Role-based statistics
  const getStatCards = () => {
    const baseStats = [
      {
        title: "Total Donors",
        value: stats.totalDonors,
        icon: Users,
        color: "text-primary",
        bgColor: "bg-primary/10",
      },
    ];

    if (user?.role === 'ADMIN') {
      return [
        ...baseStats,
        {
          title: "Available Units",
          value: stats.availableUnits,
          icon: Droplets,
          color: "text-success",
          bgColor: "bg-success/10",
        },
        {
          title: "Expiring Soon",
          value: stats.expiringUnits,
          icon: AlertCircle,
          color: "text-destructive",
          bgColor: "bg-destructive/10",
        },
      ];
    }

    return baseStats;
  };

  const statCards = getStatCards();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-4 animate-scale-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-destructive to-primary bg-clip-text text-transparent leading-tight">
          Blood Bank Management System
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
          Efficiently manage donors and blood inventory with modern technology
        </p>
        {user && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-destructive/10 border border-primary/20 text-primary rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Welcome, <span className="font-semibold">{user.email}</span> 
            <span className="px-2 py-0.5 bg-primary/20 rounded-md text-xs">
              {user.role === 'ADMIN' ? 'Admin' : 'User'}
            </span>
          </div>
        )}
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 ${user?.role === 'ADMIN' ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
        {statCards.map((stat, index) => (
          <Card 
            key={index} 
            className="stat-card group cursor-pointer overflow-hidden"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animation: 'fade-in 0.5s ease-out forwards'
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                {stat.title}
              </CardTitle>
              <div className={`p-3 rounded-xl ${stat.bgColor} transition-all duration-300 group-hover:scale-110 relative`}>
                <stat.icon className={`h-5 w-5 ${stat.color} transition-transform duration-300 group-hover:rotate-12`} />
                <div className={`absolute inset-0 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300 ${stat.bgColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground transition-all duration-300 group-hover:scale-105">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className={`grid grid-cols-1 ${user?.role === 'ADMIN' ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 group animate-slide-in-left" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                <Users className="h-5 w-5 text-primary" />
              </div>
              Donor Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Register new donors and maintain a comprehensive database of all blood donors.
              Track donation history and contact information.
            </p>
          </CardContent>
        </Card>

        {user?.role === 'ADMIN' && (
          <>
            <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 group animate-slide-in-left" style={{ animationDelay: '300ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 group-hover:text-success transition-colors duration-300">
                  <div className="p-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-all duration-300 group-hover:scale-110">
                    <Droplets className="h-5 w-5 text-success" />
                  </div>
                  Blood Inventory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Monitor available blood stock across all blood groups. Track quantities and
                  expiry dates to ensure optimal inventory management.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 group animate-slide-in-left" style={{ animationDelay: '400ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 group-hover:text-destructive transition-colors duration-300">
                  <div className="p-2 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-all duration-300 group-hover:scale-110">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  </div>
                  Admin Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Manage blood stock levels, monitor donor registrations, and receive alerts for
                  expiring blood units to prevent wastage.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
