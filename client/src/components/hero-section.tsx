import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";

export default function HeroSection() {
	const parallaxRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			if (parallaxRef.current) {
				const scrolled = window.pageYOffset;
				const speed = scrolled * 0.5;
				parallaxRef.current.style.transform = `translateY(${speed}px)`;
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToServices = () => {
		const element = document.getElementById("services");
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	const scrollToContact = () => {
		const element = document.getElementById("contact");
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
			{/* Background Image with Parallax */}
			<div className="absolute inset-0 z-0">
				<img
					ref={parallaxRef}
					src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
					alt="Professional barbershop interior with vintage styling and premium equipment"
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-barbershop-dark/80 via-barbershop-dark/60 to-barbershop-dark/80"></div>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, ease: "easeOut" }}
				className="relative z-10 text-center max-w-4xl mx-auto px-4"
			>
				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.2 }}
					className="font-display text-5xl md:text-7xl font-bold mb-6 text-shadow"
				>
					Maestria <span className="text-barbershop-gold">Ridefinita</span>
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.4 }}
					className="text-xl md:text-2xl mb-8 text-barbershop-muted max-w-2xl mx-auto"
				>
					Dove la tradizione incontra la sofisticazione moderna. Vivi i migliori servizi di toelettatura in un'atmosfera
					di eleganza senza tempo.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.6 }}
					className="flex flex-col sm:flex-row gap-4 justify-center"
				>
					<Link href="/booking">
						<Button
							size="lg"
							className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 transform hover:scale-105 transition-all duration-300 shadow-lg text-lg px-8 py-4"
							onClick={scrollToContact}
						>
							Prenota la Tua Esperienza
						</Button>
					</Link>
					<Button
						size="lg"
						variant="outline"
						className="border-2 border-barbershop-gold text-barbershop-gold hover:bg-barbershop-gold hover:text-barbershop-dark transition-all duration-300 text-lg px-8 py-4"
						onClick={scrollToServices}
					>
						Vedi i Servizi
					</Button>
				</motion.div>
			</motion.div>

			{/* Floating Arrow */}
			<motion.div
				animate={{ y: [0, -10, 0] }}
				transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
				className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
				onClick={scrollToServices}
			>
				<ChevronDown className="text-barbershop-gold text-2xl" size={32} />
			</motion.div>
		</section>
	);
}
