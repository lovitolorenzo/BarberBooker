import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	const quickLinks = [
		{ name: "Servizi", section: "services" },
		{ name: "Chi Siamo", section: "about" },
		{ name: "Galleria", section: "gallery" },
		{ name: "Contatti", section: "contact" },
	];

	const services = ["Taglio e Shampoo", "Taglio", "Barba"];

	return (
		<footer className="bg-barbershop-dark py-12 border-t border-barbershop-light/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid md:grid-cols-4 gap-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="col-span-2"
					>
						<div className="font-display text-3xl font-bold text-barbershop-gold mb-4">Barbershop</div>
						<p className="text-barbershop-muted mb-6 max-w-md">
							Dove la tradizione incontra la sofisticazione moderna. Vivi i migliori servizi di toelettatura in
							un'atmosfera di eleganza senza tempo.
						</p>
						<div className="flex space-x-4">
							<button className="text-barbershop-muted hover:text-barbershop-gold transition-colors">
								<Facebook size={24} />
							</button>
							<button className="text-barbershop-muted hover:text-barbershop-gold transition-colors">
								<Instagram size={24} />
							</button>
							<button className="text-barbershop-muted hover:text-barbershop-gold transition-colors">
								<Twitter size={24} />
							</button>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						viewport={{ once: true }}
					>
						<h4 className="font-semibold text-lg mb-4 text-barbershop-text">Link Rapidi</h4>
						<ul className="space-y-2 text-barbershop-muted">
							{quickLinks.map((link) => (
								<li key={link.name}>
									<button
										onClick={() => scrollToSection(link.section)}
										className="hover:text-barbershop-gold transition-colors"
									>
										{link.name}
									</button>
								</li>
							))}
						</ul>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
					>
						<h4 className="font-semibold text-lg mb-4 text-barbershop-text">Servizi</h4>
						<ul className="space-y-2 text-barbershop-muted">
							{services.map((service) => (
								<li key={service}>
									<button
										onClick={() => scrollToSection("services")}
										className="hover:text-barbershop-gold transition-colors"
									>
										{service}
									</button>
								</li>
							))}
						</ul>
					</motion.div>
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					viewport={{ once: true }}
					className="border-t border-barbershop-light/30 mt-8 pt-8 text-center text-barbershop-muted"
				>
					<p>&copy; 2024 Barbershop. Tutti i diritti riservati.</p>
				</motion.div>
			</div>
		</footer>
	);
}
