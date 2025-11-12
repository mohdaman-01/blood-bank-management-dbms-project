import { Users, Droplets, AlertCircle, TrendingUp, Activity, Heart } from "lucide-react";
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
        console.error('Failed to load stats from API:', error);
        setStats({
          totalDonors: 0,
          availableUnits: 0,
          expiringUnits: 0,
        });
      }
    };

    if (user) {
      loadStats();
    }
  }, [user]);

  const getStatCards = () => {
    const baseStats = [
      {
        title: "Total Donors",
        value: stats.totalDonors,
        icon: Users,
        color: "text-primary",
        bgColor: "from-primary/20 to-primary/5",
        borderColor: "border-primary/20",
      },
    ];

    if (user?.role === 'ADMIN') {
      return [
        ...baseStats,
        {
          title: "Available Units",
          value: stats.availableUnits,
          icon: Droplets,
          color: "text-info",
          bgColor: "from-info/20 to-info/5",
          borderColor: "border-info/20",
        },
        {
          title: "Expiring Soon",
          value: stats.expiringUnits,
          icon: AlertCircle,
          color: "text-destructive",
          bgColor: "from-destructive/20 to-destructive/5",
          borderColor: "border-destructive/20",
        },
      ];
    }

    return baseStats;
  };

  const statCards = getStatCards();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-info p-8 md:p-12 text-white shadow-2xl shadow-primary/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-info/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
            <Heart className="w-4 h-4" fill="currentColor" />
            <span className="text-sm font-medium">Welcome back, {user?.email?.split('@')[0]}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            LifeFlow Blood Bank
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
            Managing life-saving resources with modern technology. Every donation counts, every life matters.
          </p>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium">{user?.role === 'ADMIN' ? 'Administrator' : 'User'}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/20 backdrop-blur-sm border border-success/30">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium">System Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card 
            key={index}
            className={`group relative overflow-hidden border ${stat.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-50`} />
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-end justify-between">
                <div className="text-4xl font-bold text-foreground">{stat.value}</div>
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Updated just now</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/20">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Donor Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Register and manage blood donors efficiently. Track donation history and maintain comprehensive donor records.
            </p>
          </CardContent>
        </Card>

        {user?.role === 'ADMIN' && (
          <>
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-info/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-info/20 to-info/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Droplets className="w-6 h-6 text-info" />
                </div>
                <CardTitle className="text-xl">Blood Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Monitor blood stock levels across all groups. Track quantities, expiry dates, and ensure optimal inventory management.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-destructive/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-destructive/20 to-destructive/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle className="text-xl">Admin Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Full system control with real-time alerts. Manage requests, monitor stock levels, and prevent wastage.
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
