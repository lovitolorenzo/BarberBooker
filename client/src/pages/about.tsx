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
              <Link href="/contact" className="text-barbershop-muted hover:text-barbershop-gold transition-colors">Contact</Link>
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
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-barbershop-text mb-8">Our Story</h3>
          <div className="space-y-6 text-barbershop-muted text-lg leading-relaxed">
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
          
          <div className="barbershop-dark rounded-lg p-8 mt-12 max-w-2xl mx-auto">
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
                <div className="text-3xl font-bold text-barbershop-gold mb-2">1</div>
                <div className="text-barbershop-muted">Master Barber</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-barbershop-gold mb-2">4.9</div>
                <div className="text-barbershop-muted">Star Rating</div>
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

      {/* Meet Our Master Barber */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 barbershop-charcoal">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-barbershop-text text-center mb-12">Meet Our Master Barber</h3>
          <div className="flex justify-center">
            <Card className="barbershop-card border-barbershop-dark max-w-sm">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 barbershop-dark rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-barbershop-gold h-10 w-10" />
                </div>
                <h4 className="text-xl font-semibold text-barbershop-text mb-1">Marcus Johnson</h4>
                <div className="text-barbershop-gold font-medium mb-2">Master Barber & Owner</div>
                <div className="text-barbershop-muted text-sm mb-2">15+ years experience</div>
                <p className="text-barbershop-muted text-sm">Classic cuts & beard styling specialist</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 barbershop-charcoal border-t border-barbershop-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-barbershop-text mb-8">Get In Touch</h3>
          <p className="text-barbershop-muted mb-8">
            Ready to experience the finest barbering in the city? Contact us or visit our shop.
          </p>
          <Link href="/contact">
            <Button className="barbershop-gold text-white font-semibold px-8 py-3 text-lg hover:opacity-90 transition-all">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}