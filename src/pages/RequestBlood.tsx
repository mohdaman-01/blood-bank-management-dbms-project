import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Droplets, Send, User, Calendar, Phone, Building2, Package } from "lucide-react";
import { apiService } from "@/lib/api";

const RequestBlood = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    bloodGroup: "",
    unitsRequired: "",
    hospitalName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.age || !formData.bloodGroup || !formData.unitsRequired || !formData.hospitalName) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData = {
        patientName: formData.patientName,
        age: parseInt(formData.age),
        bloodGroup: formData.bloodGroup,
        unitsRequired: parseInt(formData.unitsRequired),
        hospitalName: formData.hospitalName,
      };
      
      console.log("Submitting request:", requestData);
      
      const response = await apiService.createRequest(requestData);
      
      console.log("Request submitted successfully:", response);
      
      toast.success("Blood request submitted successfully! Admin will review your request.");
      setFormData({
        patientName: "",
        age: "",
        bloodGroup: "",
        unitsRequired: "",
        hospitalName: "",
      });
    } catch (error: any) {
      console.error("Failed to submit request:", error);
      console.error("Error details:", {
        message: error?.message,
        status: error?.status,
        response: error?.response
      });
      
      // Show more specific error message
      if (error?.message?.includes("401") || error?.message?.includes("Authentication")) {
        toast.error("Authentication failed. Please login again.");
      } else if (error?.message?.includes("403")) {
        toast.error("You don't have permission to create requests.");
      } else if (error?.message?.includes("400")) {
        toast.error("Invalid request data. Please check all fields.");
      } else {
        toast.error("Failed to submit request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-destructive via-destructive/80 to-primary flex items-center justify-center shadow-lg shadow-destructive/20">
          <Droplets className="w-8 h-8 text-white" fill="currentColor" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Request Blood
          </h1>
          <p className="text-muted-foreground">Submit a blood request for urgent needs</p>
        </div>
      </div>

      {/* Request Form */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-destructive/5 via-primary/5 to-transparent pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-destructive to-primary flex items-center justify-center shadow-lg shadow-destructive/20">
              <Send className="w-7 h-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Blood Request Form</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Fill in the details below to submit your request</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Name */}
              <div className="space-y-2">
                <Label htmlFor="patientName" className="flex items-center gap-2 text-sm font-semibold">
                  <User className="w-4 h-4 text-primary" />
                  Patient Name
                </Label>
                <Input
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="Enter patient name"
                  className="h-11"
                  required
                />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-2 text-sm font-semibold">
                  <Calendar className="w-4 h-4 text-primary" />
                  Age
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  min="1"
                  className="h-11"
                  required
                />
              </div>

              {/* Blood Group */}
              <div className="space-y-2">
                <Label htmlFor="bloodGroup" className="flex items-center gap-2 text-sm font-semibold">
                  <Droplets className="w-4 h-4 text-destructive" />
                  Blood Group
                </Label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              {/* Units Required */}
              <div className="space-y-2">
                <Label htmlFor="unitsRequired" className="flex items-center gap-2 text-sm font-semibold">
                  <Package className="w-4 h-4 text-primary" />
                  Units Required
                </Label>
                <Input
                  id="unitsRequired"
                  name="unitsRequired"
                  type="number"
                  value={formData.unitsRequired}
                  onChange={handleChange}
                  placeholder="Enter units required"
                  min="1"
                  className="h-11"
                  required
                />
              </div>

              {/* Hospital Name */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="hospitalName" className="flex items-center gap-2 text-sm font-semibold">
                  <Building2 className="w-4 h-4 text-primary" />
                  Hospital Name
                </Label>
                <Input
                  id="hospitalName"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  placeholder="Enter hospital name"
                  className="h-11"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2 bg-gradient-to-r from-destructive to-primary hover:shadow-lg hover:shadow-destructive/30 px-8 h-11"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="border-info/30 bg-gradient-to-r from-info/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center flex-shrink-0">
              <Droplets className="w-6 h-6 text-info" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Important Information</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Your request will be reviewed by the admin team</li>
                <li>• You will be notified once your request is approved or rejected</li>
                <li>• Please ensure all information is accurate</li>
                <li>• For urgent requests, please contact the hospital directly</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestBlood;
