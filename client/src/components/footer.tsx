import { motion } from "framer-motion";
import { Facebook, Instagram, MapPin } from "lucide-react";
import { Link } from "wouter";

const logoUrl = new URL("../assets/WhatsApp Image 2026-01-28 at 22.36.13.jpeg", import.meta.url).href;

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

	return (
		<footer className="bg-surface-tertiary border-t border-border">
			<div className="container-wide py-16">
				<div className="grid md:grid-cols-4 gap-12">
					{/* Brand */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						className="md:col-span-2"
					>
						<div className="flex items-center gap-3 mb-4">
							<img src={logoUrl} alt="Barbershop logo" className="h-10 w-10 rounded-full object-cover" />
							<span className="font-display text-xl font-semibold text-text-primary">Barbershop</span>
						</div>
						<p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-sm">
							Un'esperienza di stile unica nel cuore della Basilicata. Qualità, professionalità e cura personale dal 2010.
						</p>
						<div className="flex items-center gap-3">
							<a 
								href="#" 
								aria-label="Facebook"
								className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center text-text-secondary hover:text-accent-blue hover:bg-accent-blue/10 transition-all"
							>
								<Facebook size={18} />
							</a>
							<a 
								href="#" 
								aria-label="Instagram"
								className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center text-text-secondary hover:text-accent-blue hover:bg-accent-blue/10 transition-all"
							>
								<Instagram size={18} />
							</a>
						</div>
					</motion.div>

					{/* Quick Links */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						viewport={{ once: true }}
					>
						<h4 className="font-semibold text-sm text-text-primary mb-4">Link Rapidi</h4>
						<ul className="space-y-3">
							{quickLinks.map((link) => (
								<li key={link.name}>
									<button
										onClick={() => scrollToSection(link.section)}
										className="text-sm text-text-secondary hover:text-accent-blue transition-colors"
									>
										{link.name}
									</button>
								</li>
							))}
							<li>
								<Link href="/booking" className="text-sm text-text-secondary hover:text-accent-blue transition-colors">
									Prenota
								</Link>
							</li>
						</ul>
					</motion.div>

					{/* Location */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						viewport={{ once: true }}
					>
						<h4 className="font-semibold text-sm text-text-primary mb-4">Dove Siamo</h4>
						<div className="flex items-start gap-2 text-sm text-text-secondary">
							<MapPin size={16} className="mt-0.5 flex-shrink-0 text-accent-blue" />
							<div>
								<p>Via Sasso n.61</p>
								<p>85050 Brienza (PZ)</p>
								<p>Italia</p>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Bottom bar */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					viewport={{ once: true }}
					className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
				>
					<p className="text-xs text-text-secondary">
						© {new Date().getFullYear()} Barbershop. Tutti i diritti riservati.
					</p>
					<div className="flex gap-6 text-xs text-text-secondary">
						<a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
						<a href="#" className="hover:text-text-primary transition-colors">Termini</a>
					</div>
				</motion.div>
			</div>
		</footer>
	);
}
