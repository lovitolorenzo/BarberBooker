import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import ServicesSection from "@/components/services-section";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
	return (
		<div className="min-h-screen">
			<Navbar />

			<HeroSection />
			<ServicesSection />
			<AboutSection />
			<ContactSection />
			<Footer />
		</div>
	);
}
