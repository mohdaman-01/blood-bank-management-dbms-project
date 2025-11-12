import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Droplets, 
  Search, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Package,
  Filter,
  Download,
  RefreshCw,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { apiService } from "@/lib/api";
import { getDaysUntilExpiry, getExpiryStatus } from "@/lib/date-utils";

interface BloodItem {
  id: number;
  bloodGroup: string;
  quantity: number;
  expiryDate: string;
}

const BloodStock = () => {
  const [bloodStock, setBloodStock] = useState<BloodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    setIsLoading(true);
    try {
      const stockData = await apiService.getAllStock();
      setBloodStock(stockData);
    } catch (error) {
      console.error("Failed to load stock:", error);
      toast.error("Failed to load blood stock. Please check your connection.");
      // Set empty array on error
      setBloodStock([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscardExpired = async () => {
    if (!confirm("Are you sure you want to discard all expired blood? This action cannot be undone.")) {
      return;
    }

    setIsDiscarding(true);
    try {
      const response = await apiService.discardExpiredStock();
      toast.success(response || "Expired blood discarded successfully");
      await loadStock();
    } catch (error) {
      console.error("Failed to discard expired stock:", error);
      toast.error("Failed to discard expired blood");
    } finally {
      setIsDiscarding(false);
    }
  };

  const handleDiscardById = async (id: number, bloodGroup: string) => {
    if (!confirm(`Are you sure you want to discard ${bloodGroup} blood? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiService.discardStockById(id);
      toast.success(`${bloodGroup} blood discarded successfully`);
      await loadStock();
    } catch (error) {
      console.error("Failed to discard stock:", error);
      toast.error("Failed to discard blood");
    }
  };



  const filteredStock = bloodStock.filter((item) => {
    const matchesSearch = item.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getExpiryStatus(item.expiryDate);
    const matchesFilter = filterStatus === "all" || status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalUnits = bloodStock.reduce((sum, item) => sum + item.quantity, 0);
  const expiringUnits = bloodStock
    .filter((item) => getExpiryStatus(item.expiryDate) === "expiring")
    .reduce((sum, item) => sum + item.quantity, 0);
  const expiredUnits = bloodStock
    .filter((item) => getExpiryStatus(item.expiryDate) === "expired")
    .reduce((sum, item) => sum + item.quantity, 0);
  const availableTypes = bloodStock.filter(item => item.quantity > 0).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Blood Stock Inventory
          </h1>
          <p className="text-muted-foreground">Monitor and manage blood stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={loadStock}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          {expiredUnits > 0 && (
            <Button 
              variant="destructive" 
              className="gap-2"
              onClick={handleDiscardExpired}
              disabled={isDiscarding}
            >
              <Trash2 className="w-4 h-4" />
              {isDiscarding ? "Discarding..." : `Discard Expired (${expiredUnits})`}
            </Button>
          )}
          <Button className="gap-2 bg-gradient-to-r from-primary to-info">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Units</p>
                <p className="text-4xl font-bold text-foreground">{totalUnits}</p>
                <div className="flex items-center gap-1 mt-2 text-success">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-medium">In stock</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center border border-primary/20">
                <Package className="w-8 h-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Blood Types</p>
                <p className="text-4xl font-bold text-foreground">{availableTypes}</p>
                <div className="flex items-center gap-1 mt-2 text-info">
                  <Droplets className="w-4 h-4" />
                  <span className="text-xs font-medium">Available</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-info/20 to-primary/20 flex items-center justify-center border border-info/20">
                <Droplets className="w-8 h-8 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Expiring Soon</p>
                <p className="text-4xl font-bold text-destructive">{expiringUnits}</p>
                <div className="flex items-center gap-1 mt-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-medium">Needs attention</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center border border-destructive/20 animate-pulse">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 via-info/5 to-transparent pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-info flex items-center justify-center shadow-lg shadow-primary/20">
                <Droplets className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Blood Inventory</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredStock.length} of {bloodStock.length} items
                </p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search blood group..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 w-full sm:w-64 border-border/50"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-11 w-full sm:w-40 border-border/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Blood Group</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Quantity</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Expiry Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Days Remaining</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <RefreshCw className="w-12 h-12 text-primary animate-spin" />
                        <div>
                          <p className="font-semibold text-foreground">Loading blood stock...</p>
                          <p className="text-sm text-muted-foreground">Please wait</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : filteredStock.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">No stock found</p>
                          <p className="text-sm text-muted-foreground">
                            {searchTerm || filterStatus !== "all" 
                              ? "Try adjusting your search or filters" 
                              : "No blood stock available"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStock.map((item, index) => {
                    const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
                    const status = getExpiryStatus(item.expiryDate);
                    
                    return (
                      <tr 
                        key={item.id} 
                        className="border-b border-border/30 hover:bg-muted/20 transition-colors duration-200"
                        style={{ 
                          animation: 'fade-in 0.3s ease-out forwards',
                          animationDelay: `${index * 30}ms`,
                          opacity: 0
                        }}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center border border-primary/20">
                              <Droplets className="w-6 h-6 text-primary" fill="currentColor" />
                            </div>
                            <span className="text-xl font-bold text-primary">{item.bloodGroup}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold text-foreground">{item.quantity} units</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {item.expiryDate}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`font-semibold ${
                            daysUntilExpiry <= 7 ? "text-destructive" : "text-foreground"
                          }`}>
                            {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : "Expired"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {status === "expired" ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-destructive text-destructive-foreground font-semibold text-xs">
                              <AlertTriangle className="w-3 h-3" />
                              Expired
                            </span>
                          ) : status === "expiring" ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-warning/10 text-warning border border-warning/20 font-semibold text-xs animate-pulse">
                              <AlertTriangle className="w-3 h-3" />
                              Expiring Soon
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-success/10 text-success border border-success/20 font-semibold text-xs">
                              <TrendingUp className="w-3 h-3" />
                              Available
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {status === "expired" && item.quantity > 0 && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDiscardById(item.id, item.bloodGroup)}
                              className="gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Discard
                            </Button>
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
