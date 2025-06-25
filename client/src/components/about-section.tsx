import { motion } from "framer-motion";

export default function AboutSection() {
	const stats = [
		{ number: "30+", label: "Anni di Esperienza" },
		{ number: "15K+", label: "Clienti Soddisfatti" },
		{ number: "5", label: "Barbieri Maestri" },
	];

	return (
		<section id="about" className="py-20 bg-barbershop-dark">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
					>
						<h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
							Un'Eredità di <span className="text-barbershop-gold">Eccellenza</span>
						</h2>
						<p className="text-lg text-barbershop-muted mb-6 leading-relaxed">
							Da oltre tre decenni, Barbershop rappresenta l'apice della toelettatura maschile in città. I nostri
							barbieri maestri combinano tecniche tradizionali con stile contemporaneo, assicurando che ogni cliente se
							ne vada sentendosi sicuro e distinto.
						</p>
						<p className="text-lg text-barbershop-muted mb-8 leading-relaxed">
							Crediamo che un grande taglio di capelli sia più di un semplice servizio—è una forma d'arte che richiede
							abilità, precisione e comprensione dello stile e della personalità unici di ogni cliente.
						</p>

						<div className="grid grid-cols-3 gap-6 text-center">
							{stats.map((stat, index) => (
								<motion.div
									key={stat.label}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
									viewport={{ once: true }}
								>
									<div className="text-3xl font-bold text-barbershop-gold">{stat.number}</div>
									<div className="text-barbershop-muted">{stat.label}</div>
								</motion.div>
							))}
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="relative"
					>
						<img
							src="https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
							alt="Professional barbershop interior showcasing vintage equipment"
							className="rounded-xl shadow-2xl w-full"
						/>
						<div className="absolute -bottom-6 -right-6 bg-barbershop-gold p-6 rounded-xl shadow-lg">
							<svg className="w-8 h-8 text-barbershop-dark" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
