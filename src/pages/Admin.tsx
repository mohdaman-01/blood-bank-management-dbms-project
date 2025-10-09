import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Shield, CheckCircle, XCircle, Edit2, AlertTriangle, Activity, Users, Droplets } from "lucide-react";
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
      toast.success("Request approved successfully");
      await loadData();
    } catch (error) {
      console.error("Failed to approve request:", error);
      toast.error("Failed to approve request");
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
    <div className="space-y-8 animate-fade-in">
      <div className="animate-scale-in">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 transition-transform duration-300 hover:scale-110">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Admin Control Panel
          </span>
        </h1>
        <p className="text-muted-foreground text-lg">Manage requests, stock, and monitor system status</p>
      </div>

      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stat-card group cursor-pointer animate-scale-in" style={{ animationDelay: '100ms' }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground group-hover:text-warning transition-colors duration-300">Pending Requests</p>
                <p className="text-3xl font-bold text-warning transition-transform duration-300 group-hover:scale-110">{pendingRequests.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-warning/10 transition-all duration-300 group-hover:scale-110 relative">
                <Activity className="h-8 w-8 text-warning" />
                <div className="absolute inset-0 rounded-xl bg-warning/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card group cursor-pointer animate-scale-in" style={{ animationDelay: '200ms' }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">Total Donors</p>
                <p className="text-3xl font-bold text-primary transition-transform duration-300 group-hover:scale-110">{donors.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10 transition-all duration-300 group-hover:scale-110 relative">
                <Users className="h-8 w-8 text-primary" />
                <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card group cursor-pointer animate-scale-in" style={{ animationDelay: '300ms' }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground group-hover:text-success transition-colors duration-300">Total Stock</p>
                <p className="text-3xl font-bold text-success transition-transform duration-300 group-hover:scale-110">{totalStock}</p>
              </div>
              <div className="p-3 rounded-xl bg-success/10 transition-all duration-300 group-hover:scale-110 relative">
                <Droplets className="h-8 w-8 text-success" />
                <div className="absolute inset-0 rounded-xl bg-success/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card group cursor-pointer animate-scale-in" style={{ animationDelay: '400ms' }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground group-hover:text-destructive transition-colors duration-300">Expiring Soon</p>
                <p className="text-3xl font-bold text-destructive transition-transform duration-300 group-hover:scale-110">{expiringStock.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-destructive/10 transition-all duration-300 group-hover:scale-110 relative">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div className="absolute inset-0 rounded-xl bg-destructive/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Pending Blood Requests ({pendingRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Patient Name</th>
                  <th>Blood Group</th>
                  <th>Units Required</th>
                  <th>Hospital</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted-foreground py-8">
                      No pending requests
                    </td>
                  </tr>
                ) : (
                  pendingRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-muted/50">
                      <td className="font-mono text-xs">#{request.id}</td>
                      <td className="font-medium">{request.patientName}</td>
                      <td>
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-primary/10 text-primary font-semibold text-xs">
                          {request.bloodGroup}
                        </span>
                      </td>
                      <td>{request.unitsRequired}</td>
                      <td>{request.hospitalName}</td>
                      <td>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                            className="bg-success hover:bg-success/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(request.id)}
                            className="transition-all duration-300 hover:scale-105 hover:shadow-lg"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            Stock Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Blood Group</th>
                  <th>Current Quantity</th>
                  <th>Expiry Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bloodStock.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50">
                    <td>
                      <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-primary/10 text-primary font-bold">
                        {item.bloodGroup}
                      </span>
                    </td>
                    <td>
                      {editingStock === item.id ? (
                        <Input
                          type="number"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(e.target.value)}
                          className="w-24"
                          min="0"
                        />
                      ) : (
                        <span className="font-semibold">{item.quantity} units</span>
                      )}
                    </td>
                    <td>{item.expiryDate}</td>
                    <td>
                      {editingStock === item.id ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStock(item.id)}
                            className="bg-success hover:bg-success/90"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingStock(null);
                              setEditQuantity("");
                            }}
                          >
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
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
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

      {/* Registered Donors */}
      <Card className="transition-all duration-300 hover:shadow-lg animate-slide-in-left" style={{ boxShadow: 'var(--shadow-sm)', animationDelay: '300ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 transition-transform duration-300 hover:scale-110">
              <Users className="h-5 w-5 text-primary" />
            </div>
            Registered Donors ({donors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Blood Group</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Contact</th>
                  <th>Last Donation</th>
                </tr>
              </thead>
              <tbody>
                {donors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted-foreground py-8">
                      No donors registered yet
                    </td>
                  </tr>
                ) : (
                  donors.map((donor, index) => (
                    <tr 
                      key={donor.id} 
                      className="hover:bg-muted/50 transition-all duration-200 hover:shadow-sm"
                      style={{ 
                        animation: 'fade-in 0.3s ease-out forwards',
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      <td className="font-mono text-xs">#{donor.id}</td>
                      <td className="font-medium">{donor.name}</td>
                      <td>
                        <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-semibold text-xs transition-all duration-300 hover:bg-primary/20 hover:scale-105">
                          {donor.bloodGroup}
                        </span>
                      </td>
                      <td>{donor.age}</td>
                      <td>{donor.gender}</td>
                      <td>{donor.contact}</td>
                      <td>{donor.lastDonation ? new Date(donor.lastDonation).toLocaleDateString() : "N/A"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Expiry Alerts */}
      <Card className="border-destructive/50 transition-all duration-300 hover:shadow-lg animate-slide-in-left" style={{ boxShadow: 'var(--shadow-sm)', animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <div className="p-2 rounded-lg bg-destructive/10 transition-transform duration-300 hover:scale-110 animate-pulse">
              <AlertTriangle className="h-5 w-5" />
            </div>
            Expiry Alerts - Units Expiring Within 7 Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          {expiringStock.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No expiring stock</p>
          ) : (
            <div className="space-y-3">
              {expiringStock.map((item, index) => {
                const days = getDaysUntilExpiry(item.expiryDate);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-destructive/5 border border-destructive/20 rounded-lg transition-all duration-300 hover:bg-destructive/10 hover:border-destructive/30 hover:shadow-md hover:-translate-y-0.5 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-destructive/10 animate-pulse">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground transition-colors duration-300 hover:text-destructive">
                          Blood Group {item.bloodGroup} - {item.quantity} units
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expires on {item.expiryDate} ({days} days remaining)
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
