import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Crown, Check } from "lucide-react";

const logoUrl = new URL("../assets/WhatsApp Image 2026-01-28 at 22.36.13.jpeg", import.meta.url).href;

const services = [
	{
		icon: null,
		useLogo: true,
		title: "Taglio e Shampoo",
		description: "Taglio completo con shampoo",
		price: "€14 · 35 min",
		features: ["Shampoo", "Taglio", "Rifinitura"],
	},
	{
		icon: User,
		useLogo: false,
		title: "Taglio",
		description: "Taglio senza shampoo",
		price: "€12 · 30 min",
		features: [
			"Taglio",
			"Rifinitura",
		],
	},
	{
		icon: Crown,
		useLogo: false,
		title: "Barba",
		description: "A partire da €4",
		price: "da €4 · 15 min",
		features: [
			"Rifinitura",
			"Modellatura",
		],
	},
];

export default function ServicesSection() {
	const scrollToContact = () => {
		const element = document.getElementById("contact");
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<section id="services" className="py-20 bg-barbershop-medium">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
						Servizi <span className="text-barbershop-gold">Signature</span>
					</h2>
					<p className="text-xl text-barbershop-muted max-w-2xl mx-auto">
						Ogni servizio è una testimonianza del nostro impegno per l'eccellenza e l'attenzione ai dettagli
					</p>
				</motion.div>

				<div className="grid md:grid-cols-3 gap-8">
					{services.map((service, index) => (
						<motion.div
							key={service.title}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: index * 0.2 }}
							viewport={{ once: true }}
						>
							<Card className="service-card bg-barbershop-light border-barbershop-light/30 shadow-2xl hover:transform hover:scale-105 transition-all duration-300 h-full">
								<CardContent className="p-8">
									<div className="text-center mb-6">
										{service.useLogo ? (
											<img src={logoUrl} alt="Barbershop logo" className="h-16 w-16 rounded-full object-cover mx-auto mb-4" />
										) : (
											service.icon && <service.icon className="text-barbershop-gold mx-auto mb-4" size={48} />
										)}
										<h3 className="font-display text-2xl font-semibold mb-2 text-barbershop-text">{service.title}</h3>
										<p className="text-barbershop-muted mb-4">{service.description}</p>
										<div className="text-barbershop-gold text-2xl font-bold">{service.price}</div>
									</div>

									<ul className="space-y-2 text-sm text-barbershop-muted mb-6">
										{service.features.map((feature) => (
											<li key={feature} className="flex items-center">
												<Check className="text-barbershop-gold mr-2" size={16} />
												{feature}
											</li>
										))}
									</ul>

									<Button
										className="w-full bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 transition-all duration-300"
										onClick={scrollToContact}
									>
										Prenota Questo Servizio
									</Button>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
