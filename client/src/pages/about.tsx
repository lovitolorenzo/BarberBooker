import { Award, Clock, Users, Star, MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/navbar";

const logoUrl = new URL("../assets/WhatsApp Image 2026-01-28 at 22.36.13.jpeg", import.meta.url).href;

export default function AboutPage() {
	const { t } = useTranslation();

	const services = [
		{
			name: t("services.classicHaircut.name"),
			duration: t("services.classicHaircut.duration"),
			price: "€25",
			description: t("services.classicHaircut.description"),
		},
		{
			name: t("services.beardTrim.name"),
			duration: t("services.beardTrim.duration"),
			price: "€15",
			description: t("services.beardTrim.description"),
		},
		{
			name: t("services.fullService.name"),
			duration: t("services.fullService.duration"),
			price: "€35",
			description: t("services.fullService.description"),
		},
	];

	return (
		<div className="min-h-screen barbershop-bg text-barbershop-text">
			<Navbar />

			{/* Hero Section */}
			<section className="py-16 px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-4xl font-bold text-barbershop-text mb-6">{t("hero.title")}</h2>
					<p className="text-xl text-barbershop-muted mb-8 leading-relaxed">{t("hero.description")}</p>
					<Link href="/booking">
						<Button className="barbershop-gold text-white font-semibold px-8 py-3 text-lg hover:opacity-90 transition-all">
							{t("hero.bookAppointment")}
						</Button>
					</Link>
				</div>
			</section>

			{/* Our Story */}
			<section className="py-16 px-4 sm:px-6 lg:px-8 barbershop-charcoal">
				<div className="max-w-4xl mx-auto text-center">
					<h3 className="text-3xl font-bold text-barbershop-text mb-8">{t("ourStory.title")}</h3>
					<div className="space-y-6 text-barbershop-muted text-lg leading-relaxed">
						<p>{t("ourStory.founded")}</p>
						<p>{t("ourStory.grown")}</p>
						<p>{t("ourStory.today")}</p>
					</div>

					<div className="barbershop-dark rounded-lg p-8 mt-12 max-w-2xl mx-auto">
						<div className="grid grid-cols-2 gap-6">
							<div className="text-center">
								<div className="text-3xl font-bold text-barbershop-gold mb-2">15+</div>
								<div className="text-barbershop-muted">{t("ourStory.yearsExperience")}</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-barbershop-gold mb-2">5000+</div>
								<div className="text-barbershop-muted">{t("ourStory.happyClients")}</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-barbershop-gold mb-2">1</div>
								<div className="text-barbershop-muted">{t("ourStory.masterBarber")}</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-barbershop-gold mb-2">4.9</div>
								<div className="text-barbershop-muted">{t("ourStory.starRating")}</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Services */}
			<section className="py-16 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					<h3 className="text-3xl font-bold text-barbershop-text text-center mb-12">{t("services.title")}</h3>
					<div className="grid md:grid-cols-3 gap-8">
						{services.map((service, index) => (
							<Card key={index} className="barbershop-card border-barbershop-dark">
								<CardContent className="p-6 text-center">
									<div className="w-16 h-16 barbershop-gold rounded-full flex items-center justify-center mx-auto mb-4">
										<img src={logoUrl} alt="Barbershop logo" className="h-10 w-10 rounded-full object-cover" />
									</div>
									<h4 className="text-xl font-semibold text-barbershop-text mb-2">{service.name}</h4>
									<div className="text-barbershop-gold font-bold text-2xl mb-2">{service.price}</div>
									<div className="text-barbershop-muted mb-4">{service.duration}</div>
									<p className="text-barbershop-muted text-sm">{service.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Meet Our Master Barber */}
			<section className="py-16 px-4 sm:px-6 lg:px-8 barbershop-charcoal">
				<div className="max-w-4xl mx-auto">
					<h3 className="text-3xl font-bold text-barbershop-text text-center mb-12">
						{t("meetOurMasterBarber.title")}
					</h3>
					<div className="flex justify-center">
						<Card className="barbershop-card border-barbershop-dark max-w-sm">
							<CardContent className="p-6 text-center">
								<div className="w-20 h-20 barbershop-dark rounded-full flex items-center justify-center mx-auto mb-4">
									<Users className="text-barbershop-gold h-10 w-10" />
								</div>
								<h4 className="text-xl font-semibold text-barbershop-text mb-1">{t("meetOurMasterBarber.name")}</h4>
								<div className="text-barbershop-gold font-medium mb-2">{t("meetOurMasterBarber.masterBarber")}</div>
								<div className="text-barbershop-muted text-sm mb-2">{t("meetOurMasterBarber.yearsExperience")}</div>
								<p className="text-barbershop-muted text-sm">{t("meetOurMasterBarber.specialist")}</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Contact Info */}
			<section className="py-16 px-4 sm:px-6 lg:px-8 barbershop-charcoal border-t border-barbershop-dark">
				<div className="max-w-4xl mx-auto text-center">
					<h3 className="text-3xl font-bold text-barbershop-text mb-8">{t("contactInfo.title")}</h3>
					<p className="text-barbershop-muted mb-8">{t("contactInfo.description")}</p>
					<Link href="/contact">
						<Button className="barbershop-gold text-white font-semibold px-8 py-3 text-lg hover:opacity-90 transition-all">
							{t("contactInfo.contactUs")}
						</Button>
					</Link>
				</div>
			</section>
		</div>
	);
}
