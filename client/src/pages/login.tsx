import { useState } from "react";
import { Scissors, User, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simple demo authentication - in production, this would connect to a real auth system
      if (email === "admin@barbershop.com" && password === "admin123") {
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("userEmail", email);
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard!",
        });
        setLocation("/admin");
      } else if (email && password) {
        localStorage.setItem("userRole", "customer");
        localStorage.setItem("userEmail", email);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        setLocation("/");
      } else {
        toast({
          title: "Login Failed", 
          description: "Please enter both email and password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen barbershop-bg flex items-center justify-center px-4">
      <Card className="w-full max-w-md barbershop-card border-barbershop-dark">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 barbershop-gold rounded-full flex items-center justify-center">
              <Scissors className="text-white h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl text-barbershop-text">Elite Barbershop</CardTitle>
          <p className="text-barbershop-muted">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-barbershop-text">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-barbershop-muted h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@barbershop.com"
                  className="pl-10 barbershop-dark border-barbershop-charcoal text-barbershop-text"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-barbershop-text">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-barbershop-muted h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="pl-10 barbershop-dark border-barbershop-charcoal text-barbershop-text"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full barbershop-gold text-white font-semibold py-3 hover:opacity-90 transition-all"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 barbershop-dark rounded-lg p-4">
            <h3 className="text-sm font-medium text-barbershop-text mb-2">Demo Credentials:</h3>
            <div className="text-xs text-barbershop-muted space-y-1">
              <p><strong>Admin:</strong> admin@barbershop.com / admin123</p>
              <p><strong>Customer:</strong> Any email / Any password</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}