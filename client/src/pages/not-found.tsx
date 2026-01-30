import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen barbershop-bg text-barbershop-text">
      <Navbar />
      
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md barbershop-card border-barbershop-dark">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-barbershop-gold" />
            </div>
            <h1 className="text-2xl font-bold text-barbershop-text mb-4">404 Page Not Found</h1>
            <p className="text-barbershop-muted mb-6">
              The page you're looking for doesn't exist.
            </p>
            <Link href="/">
              <Button className="barbershop-gold text-white font-semibold px-6 py-2 hover:opacity-90 transition-all">
                Go Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
