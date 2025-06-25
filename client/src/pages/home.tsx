import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import ServicesSection from "@/components/services-section";
import AboutSection from "@/components/about-section";
import GallerySection from "@/components/gallery-section";
import TestimonialsSection from "@/components/testimonials-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
	return (
		<div className="bg-barbershop-dark text-barbershop-text">
			<Navbar />

			<HeroSection />
			<ServicesSection />
			<AboutSection />
			<GallerySection />
			<TestimonialsSection />
			<ContactSection />
			<Footer />
		</div>
	);
}
