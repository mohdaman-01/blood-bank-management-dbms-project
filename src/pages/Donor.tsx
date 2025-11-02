import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, Users } from "lucide-react";
import { apiService } from "@/lib/api";

interface Donor {
  id: number;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  contact: string;
  lastDonation: string | null;
}

const Donor = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    bloodGroup: "",
    contact: "",
    lastDonation: "",
  });

  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = async () => {
    try {
      const data = await apiService.getAllDonors();
      setDonors(data);
    } catch (error) {
      console.error("Failed to load donors:", error);
      toast.error("Failed to load donors");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.gender || !formData.bloodGroup || !formData.contact) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const donorData = {
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        contact: formData.contact,
        lastDonation: formData.lastDonation || null,
      };

      await apiService.createDonor(donorData);
      toast.success("Donor registered successfully!");
      
      // Reload donors list
      await loadDonors();
      
      // Reset form
      setFormData({
        name: "",
        age: "",
        gender: "",
        bloodGroup: "",
        contact: "",
        lastDonation: "",
      });
    } catch (error) {
      console.error("Failed to register donor:", error);
      toast.error("Failed to register donor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="animate-scale-in">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-destructive to-primary bg-clip-text text-transparent mb-2">
          Donor Management
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">Register new donors and view donor list</p>
      </div>

      <Card className="transition-all duration-300 hover:shadow-xl border-primary/10 animate-slide-in-left" style={{ animationDelay: '100ms' }}>
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-destructive/20 transition-transform duration-300 hover:scale-110 hover:rotate-6 shadow-lg">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl">Donor Registration Form</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Enter age"
                  min="18"
                  max="65"
                />
              </div>

              <div className="form-group">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <Label htmlFor="bloodGroup">Blood Group *</Label>
                <Select value={formData.bloodGroup} onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}>
                  <SelectTrigger id="bloodGroup">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <Label htmlFor="contact">Contact Number *</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group">
                <Label htmlFor="lastDonation">Last Donation Date</Label>
                <Input
                  id="lastDonation"
                  type="date"
                  value={formData.lastDonation}
                  onChange={(e) => setFormData({ ...formData, lastDonation: e.target.value })}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-r from-primary to-destructive hover:from-primary/90 hover:to-destructive/90 shadow-lg" 
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Donor
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-xl animate-slide-in-left border-primary/10" style={{ animationDelay: '200ms' }}>
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-destructive/20 transition-transform duration-300 hover:scale-110 hover:rotate-6 shadow-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <span className="text-xl">Registered Donors</span>
              <span className="ml-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                {donors.length}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
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
                    <td colSpan={6} className="text-center text-muted-foreground py-8">
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
    </div>
  );
};

export default Donor;
