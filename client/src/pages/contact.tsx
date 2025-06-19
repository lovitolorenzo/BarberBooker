import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Navbar from "@/components/navbar";

export default function ContactPage() {
  return (
    <div className="min-h-screen barbershop-bg text-barbershop-text">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-barbershop-text mb-6">
            Visit Us Today
          </h2>
          <p className="text-xl text-barbershop-muted mb-8">
            Ready for your next cut? We're here to help you look your best.
          </p>
          <Link href="/">
            <Button className="barbershop-gold text-white font-semibold px-8 py-3 text-lg hover:opacity-90 transition-all">
              Book Your Appointment
            </Button>
          </Link>
        </div>

        {/* Contact Information Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="barbershop-card border-barbershop-dark">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 barbershop-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-barbershop-text mb-4">Location</h3>
              <div className="text-barbershop-muted leading-relaxed">
                <p>123 Main Street</p>
                <p>Downtown District</p>
                <p>New York, NY 10001</p>
              </div>
            </CardContent>
          </Card>

          <Card className="barbershop-card border-barbershop-dark">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 barbershop-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-barbershop-text mb-4">Phone</h3>
              <div className="text-barbershop-muted leading-relaxed">
                <p>(555) 123-CUTS</p>
                <p>(555) 123-2887</p>
              </div>
            </CardContent>
          </Card>

          <Card className="barbershop-card border-barbershop-dark">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 barbershop-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-barbershop-text mb-4">Hours</h3>
              <div className="text-barbershop-muted leading-relaxed">
                <p>Mon-Fri: 9AM-6PM</p>
                <p>Saturday: 9AM-5PM</p>
                <p>Sunday: 10AM-4PM</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="barbershop-charcoal rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-barbershop-text mb-4">
            Questions? We're Here to Help
          </h3>
          <p className="text-barbershop-muted mb-6 max-w-2xl mx-auto">
            Whether you're a first-time client or a regular, we're always happy to answer 
            any questions about our services, pricing, or availability. Give us a call or 
            stop by during business hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              className="barbershop-dark text-barbershop-text border-barbershop-gold hover:barbershop-gold hover:text-white transition-all"
            >
              <Phone className="mr-2 h-4 w-4" />
              Call Now
            </Button>
            <Link href="/about">
              <Button 
                variant="outline" 
                className="barbershop-dark text-barbershop-text border-barbershop-charcoal hover:barbershop-charcoal transition-all"
              >
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}