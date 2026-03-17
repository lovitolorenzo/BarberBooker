import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Check, Scissors, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { apiGet } from "@/config/api";
import type { ServiceConfig } from "@shared/schema";

const logoUrl = new URL("../assets/WhatsApp Image 2026-01-28 at 22.36.13.jpeg", import.meta.url).href;

const servicePresentation: Record<
	string,
	{
		description: string;
		features: string[];
		useLogo?: boolean;
		icon: typeof Sparkles;
		popular?: boolean;
	}
> = {
	full: {
		description: "Servizio completo per un look curato e definito",
		features: ["Taglio completo", "Definizione barba", "Finitura professionale"],
		useLogo: true,
		icon: Sparkles,
		popular: true,
	},
	haircut: {
		description: "Taglio di precisione con styling",
		features: ["Taglio su misura", "Rifinitura dettagliata", "Styling professionale"],
		icon: Scissors,
	},
	beard: {
		description: "Rifinitura e cura della barba",
		features: ["Sagomatura precisa", "Prodotti di qualità", "Trattamento idratante"],
		icon: Scissors,
	},
};

const defaultPresentation = {
	description: "Servizio professionale personalizzato sulle tue esigenze",
	features: ["Consulenza iniziale", "Cura dei dettagli", "Finitura professionale"],
	icon: Scissors,
};

const formatPriceLabel = (priceInCents: number) => `€${Math.round(priceInCents / 100)}`;

export default function ServicesSection() {
	const { data: services = [], isLoading } = useQuery<ServiceConfig[]>({
		queryKey: ["/api/services"],
		queryFn: async () => {
			const response = await apiGet("/api/services");
			if (!response.ok) {
				throw new Error("Failed to fetch services");
			}
			return response.json();
		},
	});

	const loadingCards = Array.from({ length: 3 }, (_, index) => index);

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
					{isLoading
						? loadingCards.map((index) => (
								<motion.div
									key={`service-skeleton-${index}`}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
									viewport={{ once: true }}
									className="relative"
								>
									<div className="glass-card rounded-3xl p-8 h-full hover-lift">
										<div className="text-center mb-6">
											<div className="w-16 h-16 rounded-2xl bg-accent-blue/10 flex items-center justify-center mx-auto mb-4">
												<Scissors className="text-accent-blue" size={28} />
											</div>
											<h3 className="font-display text-xl font-semibold text-text-primary mb-2">Caricamento...</h3>
											<p className="text-text-secondary text-sm mb-4">
												Stiamo caricando i servizi disponibili
											</p>
											<div className="text-3xl font-bold text-text-primary">—</div>
										</div>

										<ul className="space-y-3 mb-8">
											{defaultPresentation.features.map((feature) => (
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
												className="w-full rounded-full py-3 font-medium transition-all duration-300 bg-surface-secondary text-text-primary hover:bg-surface-primary border border-border"
												disabled
											>
												Prenota Ora
											</Button>
										</Link>
									</div>
								</motion.div>
							))
						: services.map((service, index) => {
								const presentation = servicePresentation[service.key] || defaultPresentation;

								return (
									<motion.div
										key={service.key}
										initial={{ opacity: 0, y: 30 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.6, delay: index * 0.1 }}
										viewport={{ once: true }}
										className="relative"
									>
										{presentation.popular && (
											<div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
												<span className="px-4 py-1 rounded-full bg-accent-blue text-white text-xs font-medium shadow-lg">
													Più richiesto
												</span>
											</div>
										)}
										<div className={`glass-card rounded-3xl p-8 h-full hover-lift ${presentation.popular ? 'ring-2 ring-accent-blue/20' : ''}`}>
											<div className="text-center mb-6">
												{presentation.useLogo ? (
													<div className="w-16 h-16 rounded-2xl bg-surface-secondary flex items-center justify-center mx-auto mb-4 shadow-soft">
														<img src={logoUrl} alt="Duo Lab logo" className="h-12 w-12 rounded-xl object-cover" />
													</div>
												) : (
													<div className="w-16 h-16 rounded-2xl bg-accent-blue/10 flex items-center justify-center mx-auto mb-4">
														<presentation.icon className="text-accent-blue" size={28} />
													</div>
												)}
												<h3 className="font-display text-xl font-semibold text-text-primary mb-2">{service.name}</h3>
												<p className="text-text-secondary text-sm mb-4">{presentation.description}</p>
												<div className="text-3xl font-bold text-text-primary">{formatPriceLabel(service.price)}</div>
												<div className="text-text-secondary text-sm mt-2">{service.duration} min</div>
											</div>

											<ul className="space-y-3 mb-8">
												{presentation.features.map((feature) => (
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
														presentation.popular
															? 'btn-accent'
															: 'bg-surface-secondary text-text-primary hover:bg-surface-primary border border-border'
													}`}
												>
													Prenota Ora
												</Button>
											</Link>
										</div>
									</motion.div>
								);
							})}
				</div>
			</div>
		</section>
	);
}
