import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { Link } from "wouter";

export default function ContactSection() {
	const contactInfo = [
		{
			icon: MapPin,
			title: "Posizione",
			details: ["Via Roma, 45", "Brienza (PZ)", "Basilicata, Italy 85050"],
		},
		{
			icon: Clock,
			title: "Orari",
			details: ["Lunedì - Venerdì: 9:00 - 20:00", "Sabato: 8:00 - 18:00", "Domenica: 10:00 - 17:00"],
		},
		{
			icon: Phone,
			title: "Contatti",
			details: ["Telefono: +39 0975 123456", "Email: info@crownandbladebarber.com"],
		},
	];

	return (
		<section id="contact" className="py-20 bg-barbershop-medium">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
						Visita il Nostro <span className="text-barbershop-gold">Negozio</span>
					</h2>
					<p className="text-xl text-barbershop-muted max-w-2xl mx-auto">
						Vivi il meglio della toelettatura maschile nel cuore di Brienza, Basilicata
					</p>
				</motion.div>

				<div className="grid lg:grid-cols-2 gap-12">
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="space-y-8"
					>
						{contactInfo.map((info, index) => (
							<motion.div
								key={info.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								viewport={{ once: true }}
								className="flex items-start space-x-4"
							>
								<div className="bg-barbershop-gold p-3 rounded-lg">
									<info.icon className="text-barbershop-dark" size={24} />
								</div>
								<div>
									<h3 className="font-semibold text-xl mb-2 text-barbershop-text">{info.title}</h3>
									<div className="text-barbershop-muted space-y-1">
										{info.details.map((detail, detailIndex) => (
											<p key={detailIndex}>{detail}</p>
										))}
									</div>
								</div>
							</motion.div>
						))}

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
							viewport={{ once: true }}
						>
							<Card className="bg-barbershop-light border-barbershop-light/30">
								<CardContent className="p-8">
									<h3 className="font-display text-2xl font-semibold mb-4 text-center text-barbershop-text">
										Prenota il Tuo Appuntamento
									</h3>
									<p className="text-barbershop-muted text-center mb-6">
										Pronto per l'esperienza Barbershop? Prenota oggi il tuo appuntamento.
									</p>
									<Link href="/booking">
										<Button className="w-full bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 transform hover:scale-105 transition-all duration-300 text-lg py-4">
											Prenota Online Ora
										</Button>
									</Link>
								</CardContent>
							</Card>
						</motion.div>
					</motion.div>

					{/* Interactive Map */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="bg-barbershop-light rounded-xl overflow-hidden shadow-2xl"
					>
						<div className="h-96 relative">
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.5!2d15.6300812!3d40.4277778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133a0b8b8b8b8b8b%3A0x5b5b5b5b5b5b5b5b!2s85050%20Brienza%20PZ%2C%20Italy!5e0!3m2!1sen!2sit!4v1640995200000!5m2!1sen!2sit"
								width="100%"
								height="100%"
								style={{ border: 0 }}
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								title="Barbershop Location in Brienza, Italy"
								className="rounded-xl"
							></iframe>
							<div className="absolute top-4 left-4 bg-barbershop-dark/90 backdrop-blur-sm rounded-lg p-3">
								<div className="flex items-center space-x-2">
									<MapPin className="text-barbershop-gold" size={20} />
									<div className="text-barbershop-text text-sm font-medium">Brienza (PZ), Italy</div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
