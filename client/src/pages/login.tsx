import { useState } from "react";
import { Scissors, User, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Link } from "wouter";

export default function LoginPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the authentication API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user info in localStorage
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userFirstName", data.user.firstName || "");
        localStorage.setItem("userLastName", data.user.lastName || "");
        
        // Dispatch auth change event to update other components
        window.dispatchEvent(new Event('auth-change'));
        
        toast({
          title: "Login Successful",
          description: `Welcome ${data.user.firstName || 'back'}!`,
        });

        // Redirect based on role
        if (data.user.role === "admin" || data.user.role === "barber") {
          setLocation("/admin");
        } else {
          setLocation("/");
        }
      } else {
        toast({
          title: "Login Failed", 
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          firstName: 'John', 
          lastName: 'Smith',
          password: 'customer123' 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userFirstName", data.user.firstName || "");
        localStorage.setItem("userLastName", data.user.lastName || "");
        
        window.dispatchEvent(new Event('auth-change'));
        
        toast({
          title: "Welcome!",
          description: `Signed in as ${data.user.firstName || 'Guest'}`,
        });

        setLocation("/");
      } else {
        toast({
          title: "Login Failed", 
          description: data.message || "Unable to sign in as guest",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Guest login error:", error);
      toast({
        title: "Login Failed",
        description: "Unable to connect to server. Please try again.",
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
              <Label htmlFor="firstName" className="text-barbershop-text">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-barbershop-muted h-4 w-4" />
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="pl-10 barbershop-dark border-barbershop-charcoal text-barbershop-text"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-barbershop-text">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-barbershop-muted h-4 w-4" />
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
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
                  placeholder="Enter your password"
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

          {/* Quick Guest Login */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-barbershop-charcoal" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="barbershop-bg px-2 text-barbershop-muted">Or</span>
              </div>
            </div>
            
            <Button
              type="button"
              onClick={handleGuestLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full mt-4 barbershop-dark text-barbershop-text border-barbershop-charcoal hover:barbershop-charcoal"
            >
              {isLoading ? "Signing In..." : "Quick Guest Login"}
            </Button>
          </div>

          <div className="mt-6 barbershop-dark rounded-lg p-4">
            <h3 className="text-sm font-medium text-barbershop-text mb-3">Demo Credentials:</h3>
            <div className="text-xs text-barbershop-muted space-y-2">
              <div className="border-l-2 border-barbershop-gold pl-3">
                <p className="font-medium text-barbershop-text">Admin Access:</p>
                <p>Admin User / admin123</p>
              </div>
              <div className="border-l-2 border-blue-500 pl-3">
                <p className="font-medium text-barbershop-text">Customer Access:</p>
                <p>John Smith / customer123</p>
                <p>Mike Johnson / mike2024</p>
              </div>
              <div className="border-l-2 border-green-500 pl-3">
                <p className="font-medium text-barbershop-text">Quick Guest:</p>
                <p>Use the "Quick Guest Login" button above</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-barbershop-muted text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-barbershop-gold hover:underline">
                Create one here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}