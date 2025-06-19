import { Scissors, Award, Clock, Users, Star, MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AboutPage() {
  const services = [
    {
      name: "Classic Haircut",
      duration: "30 minutes",
      price: "$25",
      description: "Professional scissor cut with styling"
    },
    {
      name: "Beard Trim",
      duration: "15 minutes", 
      price: "$15",
      description: "Precision beard shaping and styling"
    },
    {
      name: "Full Service",
      duration: "45 minutes",
      price: "$35", 
      description: "Complete haircut and beard service"
    }
  ];



  return (
    <div className="min-h-screen barbershop-bg text-barbershop-text">
      {/* Header */}
      <header className="barbershop-charcoal border-b border-barbershop-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Scissors className="text-barbershop-gold text-2xl" />
              <h1 className="text-2xl font-bold text-barbershop-text">Elite Barbershop</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-barbershop-muted hover:text-barbershop-gold transition-colors">
                Book Now
              </Link>
              <a href="#" className="text-barbershop-gold">About</a>
              <a href="#" className="text-barbershop-muted hover:text-barbershop-gold transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-barbershop-text mb-6">
            Crafting Excellence Since 2009
          </h2>
          <p className="text-xl text-barbershop-muted mb-8 leading-relaxed">
            At Elite Barbershop, we combine traditional craftsmanship with modern techniques 
            to deliver the finest grooming experience in the city. Our skilled barbers are 
            dedicated to helping you look and feel your absolute best.
          </p>
          <Link href="/">
            <Button className="barbershop-gold text-white font-semibold px-8 py-3 text-lg hover:opacity-90 transition-all">
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 barbershop-charcoal">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-barbershop-text mb-6">Our Story</h3>
              <div className="space-y-4 text-barbershop-muted">
                <p>
                  Founded in 2009 by master barber Marcus Johnson, Elite Barbershop began as a 
                  vision to create a space where traditional barbering techniques meet contemporary 
                  style and comfort.
                </p>
                <p>
                  What started as a single chair operation has grown into the city's premier 
                  destination for men's grooming, built on a foundation of quality, consistency, 
                  and exceptional customer service.
                </p>
                <p>
                  Today, we serve hundreds of satisfied clients who trust us with their personal 
                  style, from business professionals to artists, each receiving the same attention 
                  to detail and craftsmanship.
                </p>
              </div>
            </div>
            <div className="barbershop-dark rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-barbershop-gold mb-2">15+</div>
                  <div className="text-barbershop-muted">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-barbershop-gold mb-2">5000+</div>
                  <div className="text-barbershop-muted">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-barbershop-gold mb-2">3</div>
                  <div className="text-barbershop-muted">Master Barbers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-barbershop-gold mb-2">4.9</div>
                  <div className="text-barbershop-muted">Star Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-barbershop-text text-center mb-12">Our Services</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="barbershop-card border-barbershop-dark">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 barbershop-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <Scissors className="text-black h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-semibold text-barbershop-text mb-2">{service.name}</h4>
                  <div className="text-barbershop-gold font-bold text-2xl mb-2">{service.price}</div>
                  <div className="text-barbershop-muted mb-4">{service.duration}</div>
                  <p className="text-barbershop-muted text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Contact Info */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 barbershop-charcoal border-t border-barbershop-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-barbershop-text mb-8">Visit Us Today</h3>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <MapPin className="text-barbershop-gold h-8 w-8 mb-2" />
              <h4 className="font-semibold text-barbershop-text mb-1">Location</h4>
              <p className="text-barbershop-muted text-sm">
                123 Main Street<br />
                Downtown District<br />
                New York, NY 10001
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="text-barbershop-gold h-8 w-8 mb-2" />
              <h4 className="font-semibold text-barbershop-text mb-1">Phone</h4>
              <p className="text-barbershop-muted text-sm">
                (555) 123-CUTS<br />
                (555) 123-2887
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="text-barbershop-gold h-8 w-8 mb-2" />
              <h4 className="font-semibold text-barbershop-text mb-1">Hours</h4>
              <p className="text-barbershop-muted text-sm">
                Mon-Fri: 9AM-6PM<br />
                Saturday: 9AM-5PM<br />
                Sunday: 10AM-4PM
              </p>
            </div>
          </div>
          <Link href="/">
            <Button className="barbershop-gold text-white font-semibold px-8 py-3 text-lg hover:opacity-90 transition-all">
              Book Your Appointment Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}