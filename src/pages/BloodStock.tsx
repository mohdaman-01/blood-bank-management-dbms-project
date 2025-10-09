import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Droplets, Search, AlertTriangle } from "lucide-react";

interface BloodItem {
  id: string;
  bloodGroup: string;
  quantity: number;
  expiryDate: string;
}

const BloodStock = () => {
  const [bloodStock, setBloodStock] = useState<BloodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedStock = localStorage.getItem("bloodStock");
    if (savedStock) {
      setBloodStock(JSON.parse(savedStock));
    } else {
      // Initialize with sample data
      const sampleData: BloodItem[] = [
        { id: "1", bloodGroup: "A+", quantity: 15, expiryDate: "2025-11-15" },
        { id: "2", bloodGroup: "A-", quantity: 8, expiryDate: "2025-10-20" },
        { id: "3", bloodGroup: "B+", quantity: 12, expiryDate: "2025-10-08" },
        { id: "4", bloodGroup: "B-", quantity: 5, expiryDate: "2025-11-01" },
        { id: "5", bloodGroup: "AB+", quantity: 7, expiryDate: "2025-10-25" },
        { id: "6", bloodGroup: "AB-", quantity: 4, expiryDate: "2025-10-09" },
        { id: "7", bloodGroup: "O+", quantity: 20, expiryDate: "2025-11-10" },
        { id: "8", bloodGroup: "O-", quantity: 10, expiryDate: "2025-10-30" },
      ];
      setBloodStock(sampleData);
      localStorage.setItem("bloodStock", JSON.stringify(sampleData));
    }
  }, []);

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isExpiringSoon = (expiryDate: string) => {
    const days = getDaysUntilExpiry(expiryDate);
    return days <= 2 && days >= 0;
  };

  const filteredStock = bloodStock.filter((item) =>
    item.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUnits = bloodStock.reduce((sum, item) => sum + item.quantity, 0);
  const expiringUnits = bloodStock
    .filter((item) => isExpiringSoon(item.expiryDate))
    .reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="animate-scale-in">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent mb-2">
          Blood Stock Management
        </h1>
        <p className="text-muted-foreground text-lg">Monitor available blood inventory and expiry dates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Available Units
            </CardTitle>
            <div className="p-2 rounded-lg bg-success/10">
              <Droplets className="h-5 w-5 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalUnits}</div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Units Expiring Soon
            </CardTitle>
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{expiringUnits}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="transition-all duration-300 hover:shadow-lg animate-slide-in-left" style={{ boxShadow: 'var(--shadow-sm)', animationDelay: '200ms' }}>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 transition-transform duration-300 hover:scale-110">
                <Droplets className="h-5 w-5 text-primary" />
              </div>
              Blood Inventory
            </CardTitle>
            <div className="relative w-full md:w-64 group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary" />
              <Input
                placeholder="Search blood group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Blood Group</th>
                  <th>Quantity (Units)</th>
                  <th>Expiry Date</th>
                  <th>Days Until Expiry</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStock.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted-foreground py-8">
                      No blood stock available
                    </td>
                  </tr>
                ) : (
                  filteredStock.map((item, index) => {
                    const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
                    const expiring = isExpiringSoon(item.expiryDate);
                    
                    return (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-muted/50 transition-all duration-200 hover:shadow-sm ${expiring ? "expiry-warning" : ""}`}
                        style={{ 
                          animation: 'fade-in 0.3s ease-out forwards',
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        <td>
                          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-bold transition-all duration-300 hover:bg-primary/20 hover:scale-105">
                            {item.bloodGroup}
                          </span>
                        </td>
                        <td className="font-semibold">{item.quantity}</td>
                        <td>{item.expiryDate}</td>
                        <td>
                          <span className={`transition-colors duration-300 ${daysUntilExpiry <= 2 ? "font-semibold text-destructive" : ""}`}>
                            {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : "Expired"}
                          </span>
                        </td>
                        <td>
                          {expiring ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive font-semibold text-xs transition-all duration-300 hover:bg-destructive/20 hover:scale-105 animate-pulse">
                              <AlertTriangle className="h-3 w-3" />
                              Expiring Soon
                            </span>
                          ) : daysUntilExpiry < 0 ? (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground font-semibold text-xs transition-all duration-300 hover:scale-105">
                              Expired
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-success/10 text-success font-semibold text-xs transition-all duration-300 hover:bg-success/20 hover:scale-105">
                              Available
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BloodStock;
