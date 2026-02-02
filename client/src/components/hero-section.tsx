import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, Calendar, Scissors } from "lucide-react";
import { Link } from "wouter";

 const heroVideoUrl = new URL("../assets/3998516-uhd_4096_2160_25fps.mp4", import.meta.url).href;

export default function HeroSection() {
	const scrollToServices = () => {
		const element = document.getElementById("services");
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
			<div className="absolute inset-0 z-0">
				<video
					src={heroVideoUrl}
					autoPlay
					muted
					loop
					playsInline
					preload="metadata"
					className="absolute inset-0 h-full w-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-surface-secondary/90" />
			</div>
			{/* Decorative background elements */}
			<div className="absolute inset-0 overflow-hidden z-0">
				<div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
				<div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
			</div>

			<div className="relative z-10 container-narrow text-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
				>
					{/* Badge */}
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 shadow-soft mb-8">
						<Scissors className="h-4 w-4 text-accent-blue" />
						<span className="text-sm font-medium text-text-secondary">Prenota il tuo appuntamento online</span>
					</div>

					{/* Main heading */}
					<h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-text-primary mb-6">
						L'arte del
						<span className="block text-accent-blue">taglio perfetto</span>
					</h1>

					{/* Subtitle */}
					<p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
						Dove la tradizione incontra l'innovazione. Prenota online e vivi un'esperienza di stile unica nel cuore della Basilicata.
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
						<Link href="/booking">
							<Button
								size="lg"
								className="btn-accent text-base px-8 py-6 h-auto"
							>
								<Calendar className="h-5 w-5 mr-2" />
								Prenota Ora
							</Button>
						</Link>
						<Button
							size="lg"
							className="btn-secondary text-base px-8 py-6 h-auto"
							onClick={scrollToServices}
						>
							Scopri i Servizi
						</Button>
					</div>

					{/* Stats cards */}
					<div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
						{[
							{ value: "15+", label: "Anni di esperienza" },
							{ value: "5000+", label: "Clienti soddisfatti" },
							{ value: "4.9", label: "Valutazione media" },
						].map((stat, index) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
								className="glass-card rounded-2xl p-4"
							>
								<div className="text-2xl md:text-3xl font-bold text-text-primary">{stat.value}</div>
								<div className="text-xs text-text-secondary mt-1">{stat.label}</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>

			{/* Scroll indicator */}
			<motion.div
				animate={{ y: [0, 8, 0] }}
				transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
				className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
				onClick={scrollToServices}
			>
				<div className="flex flex-col items-center gap-2">
					<span className="text-xs font-medium text-text-secondary">Scorri</span>
					<ChevronDown className="h-5 w-5 text-text-secondary" />
				</div>
			</motion.div>
		</section>
	);
}
