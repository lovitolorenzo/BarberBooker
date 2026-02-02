import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
	{
		name: "Luca De Santis",
		title: "Cliente da 3 anni",
		text: "Taglio preciso e barba rifinita alla perfezione. Ambiente curato, puntualità e un'attenzione ai dettagli che fa davvero la differenza.",
		rating: 5,
	},
	{
		name: "Davide Romano",
		title: "Cliente abituale",
		text: "Rasatura tradizionale impeccabile: mano sicura, prodotti ottimi e un risultato pulito che dura giorni. Consigliatissimo.",
		rating: 5,
	},
	{
		name: "Matteo Greco",
		title: "Nuovo cliente",
		text: "Prima volta e mi sono sentito subito a mio agio. Consulenza sullo stile, taglio moderno e finitura perfetta: servizio davvero di livello.",
		rating: 5,
	},
];

export default function TestimonialsSection() {
	return (
		<section className="section-padding bg-surface-primary">
			<div className="container-wide">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<span className="inline-block px-4 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mb-4">
						Recensioni
					</span>
					<h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
						Cosa dicono i clienti
					</h2>
					<p className="text-lg text-text-secondary max-w-2xl mx-auto">
						La soddisfazione dei nostri clienti è la nostra priorità
					</p>
				</motion.div>

				<div className="grid md:grid-cols-3 gap-6">
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={testimonial.name}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
						>
							<div className="glass-card rounded-3xl p-8 h-full hover-lift">
								<div className="flex items-center justify-between mb-6">
									<div className="flex text-accent-orange">
										{[...Array(testimonial.rating)].map((_, i) => (
											<Star key={i} size={16} fill="currentColor" />
										))}
									</div>
									<Quote className="text-accent-blue/20" size={32} />
								</div>

								<p className="text-text-secondary mb-6 leading-relaxed">"{testimonial.text}"</p>

								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-full bg-accent-blue/10 flex items-center justify-center">
										<span className="text-accent-blue font-semibold text-sm">
											{testimonial.name.split(' ').map(n => n[0]).join('')}
										</span>
									</div>
									<div>
										<div className="font-semibold text-text-primary text-sm">{testimonial.name}</div>
										<div className="text-xs text-text-secondary">{testimonial.title}</div>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
