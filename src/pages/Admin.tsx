import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Edit2, 
  AlertTriangle, 
  Activity, 
  Users, 
  Droplets,
  User,
  Phone,
  Calendar,
  Package,
  TrendingUp,
  Clock,
  Save,
  X
} from "lucide-react";
import { apiService } from "@/lib/api";

interface BloodRequest {
  id: number;
  patientName: string;
  bloodGroup: string;
  unitsRequired: number;
  status: string;
  hospitalName: string;
}

interface BloodItem {
  id: number;
  bloodGroup: string;
  quantity: number;
  expiryDate: string;
}

interface Donor {
  id: number;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  contact: string;
  lastDonation: string | null;
}

const Admin = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [bloodStock, setBloodStock] = useState<BloodItem[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [editingStock, setEditingStock] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState<string>("");

  const getAvailableStock = (bloodGroup: string): number => {
    const stock = bloodStock.find(item => item.bloodGroup === bloodGroup);
    return stock ? stock.quantity : 0;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [requestsData, stockData, donorsData] = await Promise.all([
        apiService.getAllRequests(),
        apiService.getAllStock(),
        apiService.getAllDonors(),
      ]);
      
      setRequests(requestsData);
      setBloodStock(stockData);
      setDonors(donorsData);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load data");
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await apiService.updateRequestStatus(id, "APPROVED");
      toast.success("Request approved successfully! Blood units deducted from stock.");
      await loadData();
    } catch (error: any) {
      console.error("Failed to approve request:", error);
      const errorMessage = error?.message || "Failed to approve request";
      if (errorMessage.includes("Insufficient blood stock")) {
        toast.error("Cannot approve: Insufficient blood stock available");
      } else if (errorMessage.includes("not found in stock")) {
        toast.error("Cannot approve: Blood group not available in stock");
      } else {
        toast.error("Failed to approve request");
      }
    }
  };

  const handleReject = async (id: number) => {
    try {
      await apiService.updateRequestStatus(id, "REJECTED");
      toast.error("Request rejected");
      await loadData();
    } catch (error) {
      console.error("Failed to reject request:", error);
      toast.error("Failed to reject request");
    }
  };

  const handleUpdateStock = async (id: number) => {
    const quantity = parseInt(editQuantity);
    if (isNaN(quantity) || quantity < 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    try {
      await apiService.updateStockQuantity(id, quantity);
      toast.success("Stock updated successfully");
      setEditingStock(null);
      setEditQuantity("");
      await loadData();
    } catch (error) {
      console.error("Failed to update stock:", error);
      toast.error("Failed to update stock");
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const expiringStock = bloodStock.filter((item) => {
    const days = getDaysUntilExpiry(item.expiryDate);
    return days <= 7 && days >= 0;
  });

  const pendingRequests = requests.filter((req) => req.status === "PENDING");
  const totalStock = bloodStock.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-info flex items-center justify-center shadow-lg shadow-primary/20">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Admin Control Panel
          </h1>
          <p className="text-muted-foreground">Manage system operations and monitor activities</p>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Requests</p>
                <p className="text-4xl font-bold text-warning">{pendingRequests.length}</p>
                <div className="flex items-center gap-1 mt-2 text-warning">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium">Awaiting action</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warning/20 to-warning/10 flex items-center justify-center border border-warning/20">
                <Activity className="w-7 h-7 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Donors</p>
                <p className="text-4xl font-bold text-primary">{donors.length}</p>
                <div className="flex items-center gap-1 mt-2 text-primary">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-medium">Registered</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center border border-primary/20">
                <Users className="w-7 h-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Stock</p>
                <p className="text-4xl font-bold text-success">{totalStock}</p>
                <div className="flex items-center gap-1 mt-2 text-success">
                  <Package className="w-4 h-4" />
                  <span className="text-xs font-medium">Units available</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center border border-success/20">
                <Droplets className="w-7 h-7 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Expiring Soon</p>
                <p className="text-4xl font-bold text-destructive">{expiringStock.length}</p>
                <div className="flex items-center gap-1 mt-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-medium">Needs attention</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center border border-destructive/20 animate-pulse">
                <AlertTriangle className="w-7 h-7 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-warning/5 via-warning/3 to-transparent pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warning to-warning/80 flex items-center justify-center shadow-lg shadow-warning/20">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Pending Blood Requests</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {pendingRequests.length} requests awaiting approval
                </p>
              </div>
            </div>
            {pendingRequests.length > 0 && (
              <div className="px-4 py-2 rounded-xl bg-warning/10 border border-warning/20 animate-pulse">
                <span className="text-sm font-semibold text-warning">{pendingRequests.length} Pending</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Request ID</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Patient Name</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Blood Group</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Units Requested</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Available</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Hospital</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                          <Activity className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">No pending requests</p>
                          <p className="text-sm text-muted-foreground">All requests have been processed</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pendingRequests.map((request, index) => (
                    <tr 
                      key={request.id} 
                      className="border-b border-border/30 hover:bg-muted/20 transition-colors duration-200"
                      style={{ 
                        animation: 'fade-in 0.3s ease-out forwards',
                        animationDelay: `${index * 30}ms`,
                        opacity: 0
                      }}
                    >
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm text-muted-foreground">#{request.id}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-foreground">{request.patientName}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary/10 to-info/10 border border-primary/20 font-bold text-primary">
                          <Droplets className="w-4 h-4" fill="currentColor" />
                          {request.bloodGroup}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-foreground">{request.unitsRequired} units</span>
                      </td>
                      <td className="py-4 px-6">
                        {(() => {
                          const available = getAvailableStock(request.bloodGroup);
                          const isInsufficient = available < request.unitsRequired;
                          return (
                            <span className={`font-semibold ${isInsufficient ? 'text-destructive' : 'text-success'}`}>
                              {available} units
                              {isInsufficient && (
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                                  Insufficient
                                </span>
                              )}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-muted-foreground">{request.hospitalName}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                            disabled={getAvailableStock(request.bloodGroup) < request.unitsRequired}
                            className="gap-2 bg-gradient-to-r from-success to-success/80 hover:shadow-lg hover:shadow-success/30 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(request.id)}
                            className="gap-2 hover:shadow-lg hover:shadow-destructive/30"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stock Management */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 via-info/5 to-transparent pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-info flex items-center justify-center shadow-lg shadow-primary/20">
              <Droplets className="w-7 h-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Stock Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Update blood inventory quantities</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Blood Group</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Current Quantity</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Expiry Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bloodStock.map((item, index) => (
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
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center border border-primary/20">
                          <Droplets className="w-5 h-5 text-primary" fill="currentColor" />
                        </div>
                        <span className="text-lg font-bold text-primary">{item.bloodGroup}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {editingStock === item.id ? (
                        <Input
                          type="number"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(e.target.value)}
                          className="w-32 h-10"
                          min="0"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">{item.quantity} units</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {item.expiryDate}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {editingStock === item.id ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStock(item.id)}
                            className="gap-2 bg-gradient-to-r from-success to-success/80"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingStock(null);
                              setEditQuantity("");
                            }}
                            className="gap-2"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingStock(item.id);
                            setEditQuantity(item.quantity.toString());
                          }}
                          className="gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Expiry Alerts */}
      {expiringStock.length > 0 && (
        <Card className="border-destructive/30 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-destructive/5 to-transparent pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-destructive to-destructive/80 flex items-center justify-center shadow-lg shadow-destructive/20 animate-pulse">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-destructive">Expiry Alerts</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {expiringStock.length} items expiring within 7 days
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {expiringStock.map((item, index) => {
                const days = getDaysUntilExpiry(item.expiryDate);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-destructive/5 border border-destructive/20 hover:bg-destructive/10 transition-all duration-300"
                    style={{ 
                      animation: 'fade-in 0.3s ease-out forwards',
                      animationDelay: `${index * 50}ms`,
                      opacity: 0
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center animate-pulse">
                        <AlertTriangle className="w-6 h-6 text-destructive" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          Blood Group {item.bloodGroup} - {item.quantity} units
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expires on {item.expiryDate} ({days} days remaining)
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
                      <span className="text-sm font-semibold text-destructive">{days} days left</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Admin;
