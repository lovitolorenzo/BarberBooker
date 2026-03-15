import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navigation() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
			setIsMenuOpen(false);
		}
	};

	return (
		<nav
			className={`fixed top-0 w-full z-50 transition-all duration-300 ${
				isScrolled ? "glass-effect border-b border-barbershop-light/30" : "bg-transparent"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="font-display text-2xl font-bold text-barbershop-gold">Duo Lab </div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex space-x-8">
						<button onClick={() => scrollToSection("hero")} className="hover:text-barbershop-gold transition-colors">
							Home
						</button>
						<button
							onClick={() => scrollToSection("services")}
							className="hover:text-barbershop-gold transition-colors"
						>
							Servizi
						</button>
						<button onClick={() => scrollToSection("about")} className="hover:text-barbershop-gold transition-colors">
							Chi Siamo
						</button>
						<button onClick={() => scrollToSection("gallery")} className="hover:text-barbershop-gold transition-colors">
							Galleria
						</button>
						<button onClick={() => scrollToSection("contact")} className="hover:text-barbershop-gold transition-colors">
							Contatti
						</button>
					</div>

					<Button
						className="hidden md:block bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 transform hover:scale-105 transition-all duration-300"
						onClick={() => scrollToSection("contact")}
					>
						Prenota Ora
					</Button>

					{/* Mobile Menu Button */}
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden text-barbershop-text"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</Button>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="md:hidden bg-barbershop-medium border-t border-barbershop-light/30">
						<div className="px-2 pt-2 pb-3 space-y-1">
							<button
								onClick={() => scrollToSection("hero")}
								className="block px-3 py-2 text-barbershop-text hover:text-barbershop-gold transition-colors"
							>
								Home
							</button>
							<button
								onClick={() => scrollToSection("services")}
								className="block px-3 py-2 text-barbershop-text hover:text-barbershop-gold transition-colors"
							>
								Servizi
							</button>
							<button
								onClick={() => scrollToSection("about")}
								className="block px-3 py-2 text-barbershop-text hover:text-barbershop-gold transition-colors"
							>
								Chi Siamo
							</button>
							<button
								onClick={() => scrollToSection("gallery")}
								className="block px-3 py-2 text-barbershop-text hover:text-barbershop-gold transition-colors"
							>
								Galleria
							</button>
							<button
								onClick={() => scrollToSection("contact")}
								className="block px-3 py-2 text-barbershop-text hover:text-barbershop-gold transition-colors"
							>
								Contatti
							</button>
							<Button
								className="mx-3 mt-2 bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90"
								onClick={() => scrollToSection("contact")}
							>
								Prenota Ora
							</Button>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
