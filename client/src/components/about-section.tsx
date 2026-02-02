import { motion } from "framer-motion";
import { Award, Heart, Users } from "lucide-react";

export default function AboutSection() {
	const features = [
		{ 
			icon: Award,
			title: "Esperienza", 
			description: "Oltre 15 anni di maestria nel taglio" 
		},
		{ 
			icon: Heart,
			title: "Passione", 
			description: "Dedizione totale per ogni cliente" 
		},
		{ 
			icon: Users,
			title: "Comunità", 
			description: "Un punto di riferimento locale" 
		},
	];

	return (
		<section id="about" className="section-padding bg-surface-primary">
			<div className="container-wide">
				<div className="grid lg:grid-cols-2 gap-16 items-center">
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
					>
						<span className="inline-block px-4 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mb-4">
							Chi Siamo
						</span>
						<h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-6">
							Un'eredità di eccellenza
						</h2>
						<p className="text-lg text-text-secondary mb-6 leading-relaxed">
							Da oltre quindici anni, il nostro barbershop rappresenta un punto di riferimento per chi cerca qualità, 
							professionalità e un'esperienza di cura personale unica nel cuore della Basilicata.
						</p>
						<p className="text-lg text-text-secondary mb-8 leading-relaxed">
							Crediamo che ogni taglio sia un'opera d'arte che richiede precisione, attenzione e comprensione 
							dello stile personale di ciascun cliente.
						</p>

						<div className="grid grid-cols-3 gap-4">
							{features.map((feature, index) => (
								<motion.div
									key={feature.title}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									viewport={{ once: true }}
									className="glass-card rounded-2xl p-4 text-center"
								>
									<div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center mx-auto mb-3">
										<feature.icon className="text-accent-blue" size={20} />
									</div>
									<div className="text-sm font-semibold text-text-primary">{feature.title}</div>
									<div className="text-xs text-text-secondary mt-1">{feature.description}</div>
								</motion.div>
							))}
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="relative"
					>
						<div className="relative rounded-3xl overflow-hidden shadow-glass-lg">
							<img
								src="https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
								alt="Professional barbershop interior"
								className="w-full h-auto"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
						</div>
						
						{/* Floating badge */}
						<div className="absolute -bottom-4 -right-4 md:right-8 glass-card-heavy rounded-2xl p-4 shadow-glass-lg">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-full bg-accent-green flex items-center justify-center">
									<Award className="text-white" size={24} />
								</div>
								<div>
									<div className="text-sm font-semibold text-text-primary">Qualità certificata</div>
									<div className="text-xs text-text-secondary">4.9 stelle su 5</div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
