import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
	{
		name: "Marco Rossi",
		title: "Direttore Esecutivo",
		text: "Esperienza assolutamente fenomenale. L'attenzione ai dettagli e la professionalità sono impareggiabili. Vengo qui da 5 anni e non deludono mai.",
		rating: 5,
	},
	{
		name: "Giuseppe Ferrari",
		title: "Imprenditore",
		text: "L'esperienza della rasatura classica qui è incredibile. Asciugamani caldi, prodotti premium e tecnica magistrale. Non è solo un taglio, è un'esperienza.",
		rating: 5,
	},
	{
		name: "Antonio Bianchi",
		title: "Direttore Creativo",
		text: "Barbershop stabilisce lo standard per la toelettatura maschile di lusso. L'atmosfera, il servizio, i risultati - tutto è di primo livello. Raccomando vivamente il Trattamento Reale.",
		rating: 5,
	},
];

export default function TestimonialsSection() {
	return (
		<section className="py-20 bg-barbershop-dark">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
						Testimonianze dei <span className="text-barbershop-gold">Clienti</span>
					</h2>
					<p className="text-xl text-barbershop-muted max-w-2xl mx-auto">
						Non credere solo alle nostre parole - ascolta i nostri clienti soddisfatti
					</p>
				</motion.div>

				<div className="grid md:grid-cols-3 gap-8">
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={testimonial.name}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: index * 0.2 }}
							viewport={{ once: true }}
						>
							<Card className="testimonial-card bg-barbershop-light border-barbershop-light/30 shadow-2xl h-full">
								<CardContent className="p-8">
									<div className="flex items-center mb-4">
										<div className="flex text-barbershop-gold">
											{[...Array(testimonial.rating)].map((_, i) => (
												<Star key={i} size={20} fill="currentColor" />
											))}
										</div>
									</div>

									<p className="text-barbershop-muted mb-6 italic leading-relaxed">"{testimonial.text}"</p>

									<div>
										<div className="font-semibold text-barbershop-text">{testimonial.name}</div>
										<div className="text-sm text-barbershop-muted">{testimonial.title}</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
