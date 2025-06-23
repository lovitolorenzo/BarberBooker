import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/navbar";

export default function ContactPage() {
	const { t } = useTranslation();

	return (
		<div className="min-h-screen barbershop-bg text-barbershop-text">
			<Navbar />

			{/* Main Content */}
			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-barbershop-text mb-6">{t("contact.visitUs")}</h2>
					<p className="text-xl text-barbershop-muted mb-8">{t("contact.description")}</p>
					<Link href="/">
						<Button className="barbershop-gold text-white font-semibold px-8 py-3 text-lg hover:opacity-90 transition-all">
							{t("contact.bookAppointment")}
						</Button>
					</Link>
				</div>

				{/* Contact Information Cards */}
				<div className="grid md:grid-cols-3 gap-8 mb-12">
					<Card className="barbershop-card border-barbershop-dark">
						<CardContent className="p-8 text-center">
							<div className="w-16 h-16 barbershop-gold rounded-full flex items-center justify-center mx-auto mb-4">
								<MapPin className="text-white h-8 w-8" />
							</div>
							<h3 className="text-xl font-semibold text-barbershop-text mb-4">{t("contact.location")}</h3>
							<div className="text-barbershop-muted leading-relaxed">
								<p>{t("contact.address.street")}</p>
								<p>{t("contact.address.district")}</p>
								<p>{t("contact.address.city")}</p>
							</div>
						</CardContent>
					</Card>

					<Card className="barbershop-card border-barbershop-dark">
						<CardContent className="p-8 text-center">
							<div className="w-16 h-16 barbershop-gold rounded-full flex items-center justify-center mx-auto mb-4">
								<Phone className="text-white h-8 w-8" />
							</div>
							<h3 className="text-xl font-semibold text-barbershop-text mb-4">{t("contact.phone")}</h3>
							<div className="text-barbershop-muted leading-relaxed">
								<p>{t("contact.phoneNumbers.primary")}</p>
								<p>{t("contact.phoneNumbers.secondary")}</p>
							</div>
						</CardContent>
					</Card>

					<Card className="barbershop-card border-barbershop-dark">
						<CardContent className="p-8 text-center">
							<div className="w-16 h-16 barbershop-gold rounded-full flex items-center justify-center mx-auto mb-4">
								<Clock className="text-white h-8 w-8" />
							</div>
							<h3 className="text-xl font-semibold text-barbershop-text mb-4">{t("contact.hours")}</h3>
							<div className="text-barbershop-muted leading-relaxed">
								<p>{t("contact.schedule.weekdays")}</p>
								<p>{t("contact.schedule.saturday")}</p>
								<p>{t("contact.schedule.sunday")}</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Additional Information */}
				<div className="barbershop-charcoal rounded-lg p-8 text-center">
					<h3 className="text-2xl font-bold text-barbershop-text mb-4">{t("contact.questions")}</h3>
					<p className="text-barbershop-muted mb-6 max-w-2xl mx-auto">{t("contact.additionalInfo")}</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							variant="outline"
							className="barbershop-dark text-barbershop-text border-barbershop-gold hover:barbershop-gold hover:text-white transition-all"
						>
							<Phone className="mr-2 h-4 w-4" />
							{t("contact.callNow")}
						</Button>
						<Link href="/">
							<Button
								variant="outline"
								className="barbershop-dark text-barbershop-text border-barbershop-charcoal hover:barbershop-charcoal transition-all"
							>
								{t("contact.learnMore")}
							</Button>
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
}
