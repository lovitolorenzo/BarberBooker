import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Scissors, Sparkles } from "lucide-react";
import { Link } from "wouter";

const logoUrl = new URL("../assets/WhatsApp Image 2026-01-28 at 22.36.13.jpeg", import.meta.url).href;

const services = [
	{
		title: "Taglio e Shampoo",
		description: "Taglio classico con shampoo e styling",
		price: "€14",
		icon: Sparkles,
		useLogo: true,
		features: ["Consulenza personalizzata", "Shampoo premium", "Styling finale"],
		popular: true,
	},
	{
		title: "Taglio",
		description: "Taglio di precisione con styling",
		price: "€12",
		icon: Scissors,
		useLogo: false,
		features: ["Taglio su misura", "Rifinitura dettagliata", "Styling professionale"],
		popular: false,
	},
	{
		title: "Barba",
		description: "Rifinitura e cura della barba",
		price: "da €4",
		icon: Scissors,
		useLogo: false,
		features: ["Sagomatura precisa", "Prodotti di qualità", "Trattamento idratante"],
		popular: false,
	},
];

export default function ServicesSection() {
	return (
		<section id="services" className="section-padding bg-surface-secondary">
			<div className="container-wide">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<span className="inline-block px-4 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mb-4">
						I Nostri Servizi
					</span>
					<h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
						Scegli il tuo stile
					</h2>
					<p className="text-lg text-text-secondary max-w-2xl mx-auto">
						Ogni servizio è pensato per offrirti un'esperienza unica di cura e stile personale
					</p>
				</motion.div>

				<div className="grid md:grid-cols-3 gap-6">
					{services.map((service, index) => (
						<motion.div
							key={service.title}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
							className="relative"
						>
							{service.popular && (
								<div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
									<span className="px-4 py-1 rounded-full bg-accent-blue text-white text-xs font-medium shadow-lg">
										Più richiesto
									</span>
								</div>
							)}
							<div className={`glass-card rounded-3xl p-8 h-full hover-lift ${service.popular ? 'ring-2 ring-accent-blue/20' : ''}`}>
								<div className="text-center mb-6">
									{service.useLogo ? (
										<div className="w-16 h-16 rounded-2xl bg-surface-secondary flex items-center justify-center mx-auto mb-4 shadow-soft">
											<img src={logoUrl} alt="Barbershop logo" className="h-12 w-12 rounded-xl object-cover" />
										</div>
									) : (
										<div className="w-16 h-16 rounded-2xl bg-accent-blue/10 flex items-center justify-center mx-auto mb-4">
											<service.icon className="text-accent-blue" size={28} />
										</div>
									)}
									<h3 className="font-display text-xl font-semibold text-text-primary mb-2">{service.title}</h3>
									<p className="text-text-secondary text-sm mb-4">{service.description}</p>
									<div className="text-3xl font-bold text-text-primary">{service.price}</div>
								</div>

								<ul className="space-y-3 mb-8">
									{service.features.map((feature) => (
										<li key={feature} className="flex items-center text-sm text-text-secondary">
											<div className="w-5 h-5 rounded-full bg-accent-green/10 flex items-center justify-center mr-3 flex-shrink-0">
												<Check className="text-accent-green" size={12} />
											</div>
											{feature}
										</li>
									))}
								</ul>

								<Link href="/booking">
									<Button
										className={`w-full rounded-full py-3 font-medium transition-all duration-300 ${
											service.popular
												? 'btn-accent'
												: 'bg-surface-secondary text-text-primary hover:bg-surface-primary border border-border'
										}`}
									>
										Prenota Ora
									</Button>
								</Link>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
