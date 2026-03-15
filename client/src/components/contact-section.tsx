import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Calendar } from "lucide-react";
import { Link } from "wouter";

export default function ContactSection() {
	const contactInfo = [
		{
			icon: MapPin,
			title: "Posizione",
			details: ["Via Sasso n.61", "Brienza (PZ)", "85050 Italia"],
		},
		{
			icon: Clock,
			title: "Orari",
			details: ["Lun - Ven: 9:00 - 20:00", "Sabato: 8:00 - 18:00", "Domenica: 10:00 - 17:00"],
		},
		{
			icon: Phone,
			title: "Contatti",
			details: ["+39 0975 123456", "info@barbershop.it"],
		},
	];

	return (
		<section id="contact" className="section-padding bg-surface-secondary">
			<div className="container-wide">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<span className="inline-block px-4 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mb-4">
						Contatti
					</span>
					<h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
						Vieni a trovarci
					</h2>
					<p className="text-lg text-text-secondary max-w-2xl mx-auto">
						Siamo nel cuore di Brienza, pronti ad accoglierti
					</p>
				</motion.div>

				<div className="grid lg:grid-cols-2 gap-8">
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="space-y-6"
					>
						{/* Contact cards */}
						<div className="grid gap-4">
							{contactInfo.map((info, index) => (
								<motion.div
									key={info.title}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									viewport={{ once: true }}
									className="glass-card rounded-2xl p-5 flex items-start gap-4"
								>
									<div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
										<info.icon className="text-accent-blue" size={22} />
									</div>
									<div>
										<h3 className="font-semibold text-text-primary mb-1">{info.title}</h3>
										<div className="text-sm text-text-secondary space-y-0.5">
											{info.details.map((detail, detailIndex) => (
												<p key={detailIndex}>{detail}</p>
											))}
										</div>
									</div>
								</motion.div>
							))}
						</div>

						{/* CTA Card */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							viewport={{ once: true }}
							className="glass-card-heavy rounded-3xl p-8 text-center"
						>
							<div className="w-16 h-16 rounded-2xl bg-accent-blue/10 flex items-center justify-center mx-auto mb-4">
								<Calendar className="text-accent-blue" size={28} />
							</div>
							<h3 className="font-display text-2xl font-semibold text-text-primary mb-3">
								Prenota ora
							</h3>
							<p className="text-text-secondary mb-6">
								Prenota il tuo appuntamento online in pochi click
							</p>
							<Link href="/booking">
								<Button className="btn-accent w-full text-base py-6 h-auto">
									Prenota Online
								</Button>
							</Link>
						</motion.div>
					</motion.div>

					{/* Map */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="rounded-3xl overflow-hidden shadow-glass-lg h-full min-h-[400px]"
					>
						<div className="h-full relative">
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.5!2d15.6300812!3d40.4277778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133a0b8b8b8b8b8b%3A0x5b5b5b5b5b5b5b5b!2s85050%20Brienza%20PZ%2C%20Italy!5e0!3m2!1sen!2sit!4v1640995200000!5m2!1sen!2sit"
								width="100%"
								height="100%"
								style={{ border: 0 }}
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								title="Duo Lab Location in Brienza, Italy"
							></iframe>
							<div className="absolute top-4 left-4 glass-card-heavy rounded-xl p-3">
								<div className="flex items-center gap-2">
									<MapPin className="text-accent-blue" size={18} />
									<span className="text-sm font-medium text-text-primary">Via Sasso n.61, Brienza</span>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
