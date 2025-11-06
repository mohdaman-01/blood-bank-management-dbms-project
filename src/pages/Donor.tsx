import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  UserPlus, 
  Users, 
  User, 
  Calendar, 
  Phone, 
  Droplet, 
  Hash,
  Search,
  Filter,
  Download,
  CheckCircle2
} from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBloodGroup, setFilterBloodGroup] = useState("all");
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
      
      await loadDonors();
      
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

  // Filter donors
  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.contact.includes(searchTerm) ||
                         donor.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBloodGroup === "all" || donor.bloodGroup === filterBloodGroup;
    return matchesSearch && matchesFilter;
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Donor Management
          </h1>
          <p className="text-muted-foreground">Register and manage blood donors</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
          <Users className="w-5 h-5 text-primary" />
          <span className="font-semibold text-primary">{donors.length} Total Donors</span>
        </div>
      </div>

      {/* Registration Form */}
      <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 via-info/5 to-transparent pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-info flex items-center justify-center shadow-lg shadow-primary/20">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Register New Donor</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Fill in the details to add a new donor</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="h-12 border-border/50 focus:border-primary"
                  required
                />
              </div>

              {/* Age Field */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-semibold flex items-center gap-2">
                  <Hash className="w-4 h-4 text-primary" />
                  Age *
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Enter age (18-65)"
                  min="18"
                  max="65"
                  className="h-12 border-border/50 focus:border-primary"
                  required
                />
              </div>

              {/* Gender Field */}
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Gender *
                </Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger id="gender" className="h-12 border-border/50">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Blood Group Field */}
              <div className="space-y-2">
                <Label htmlFor="bloodGroup" className="text-sm font-semibold flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-primary" />
                  Blood Group *
                </Label>
                <Select value={formData.bloodGroup} onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}>
                  <SelectTrigger id="bloodGroup" className="h-12 border-border/50">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map(group => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Contact Field */}
              <div className="space-y-2">
                <Label htmlFor="contact" className="text-sm font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Contact Number *
                </Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="Enter phone number"
                  className="h-12 border-border/50 focus:border-primary"
                  required
                />
              </div>

              {/* Last Donation Field */}
              <div className="space-y-2">
                <Label htmlFor="lastDonation" className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Last Donation Date
                </Label>
                <Input
                  id="lastDonation"
                  type="date"
                  value={formData.lastDonation}
                  onChange={(e) => setFormData({ ...formData, lastDonation: e.target.value })}
                  className="h-12 border-border/50 focus:border-primary"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="h-12 px-8 text-base font-semibold bg-gradient-to-r from-primary to-info hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Registering...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Register Donor
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Donors List */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-info/5 via-primary/5 to-transparent pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-info to-primary flex items-center justify-center shadow-lg shadow-info/20">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Registered Donors</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredDonors.length} of {donors.length} donors
                </p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search donors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 w-full sm:w-64 border-border/50"
                />
              </div>

              {/* Filter */}
              <Select value={filterBloodGroup} onValueChange={setFilterBloodGroup}>
                <SelectTrigger className="h-11 w-full sm:w-40 border-border/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {bloodGroups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Export Button */}
              <Button variant="outline" className="h-11 gap-2 border-border/50">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Modern Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Donor Name</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Blood Group</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Age</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Gender</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Contact</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Last Donation</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                          <Users className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">No donors found</p>
                          <p className="text-sm text-muted-foreground">
                            {searchTerm || filterBloodGroup !== "all" 
                              ? "Try adjusting your search or filters" 
                              : "Register your first donor to get started"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDonors.map((donor, index) => (
                    <tr 
                      key={donor.id} 
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
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-semibold text-foreground">{donor.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary/10 to-info/10 border border-primary/20 font-bold text-primary">
                          <Droplet className="w-4 h-4" fill="currentColor" />
                          {donor.bloodGroup}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-foreground">{donor.age}</td>
                      <td className="py-4 px-6">
                        <span className="text-muted-foreground">{donor.gender}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {donor.contact}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {donor.lastDonation ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(donor.lastDonation).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground/50">Not donated yet</span>
                        )}
                      </td>
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
