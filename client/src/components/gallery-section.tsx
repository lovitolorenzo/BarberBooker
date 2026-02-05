import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play } from "lucide-react";

const galleryMedia = [
	{
		type: "video" as const,
		src: new URL("../assets/13637912_3840_2160_24fps.mp4", import.meta.url).href,
		alt: "Dettagli del salone",
	},
	{
		type: "video" as const,
		src: new URL("../assets/3996975-uhd_4096_2160_25fps.mp4", import.meta.url).href,
		alt: "Atmosfera e stile",
	},
	{
		type: "video" as const,
		src: new URL("../assets/3998511-uhd_4096_2160_25fps.mp4", import.meta.url).href,
		alt: "Strumenti da barbiere",
	},
	{
		type: "video" as const,
		src: new URL("../assets/7686508-hd_1920_1080_24fps.mp4", import.meta.url).href,
		alt: "Precisione e finitura",
	},
	{
		type: "video" as const,
		src: new URL("../assets/8252400-hd_1920_1080_30fps.mp4", import.meta.url).href,
		alt: "Stile moderno",
	},
	{
		type: "video" as const,
		src: new URL("../assets/7697049-hd_1920_1080_30fps.mp4", import.meta.url).href,
		alt: "Esperienza in salone",
	},
];

const fallbackPosterUrl = new URL(
	"../assets/WhatsApp Image 2026-01-28 at 22.36.13.jpeg",
	import.meta.url,
).href;

export default function GallerySection() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [canHover, setCanHover] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);

  useEffect(() => {
    try {
      setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    } catch {
      setCanHover(false);
    }
  }, []);

  const handleEnter = async (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    try {
      await video.play();
    } catch {
      // ignore autoplay/gesture restrictions
    }
  };

  const handleLeave = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    video.pause();
    try {
      video.currentTime = 0;
    } catch {
      // ignore
    }
  };

  return (
    <section id="gallery" className="section-padding bg-surface-secondary">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mb-4">
            Galleria
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Il nostro lavoro
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Scopri l'arte e la precisione che mettiamo in ogni taglio
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryMedia.map((media, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer hover-lift"
              onMouseEnter={() => canHover && media.type === "video" && handleEnter(index)}
              onMouseLeave={() => canHover && media.type === "video" && handleLeave(index)}
              onClick={() => !canHover && media.type === "video" && setActiveVideoIndex(index)}
            >
              {media.type === "video" ? (
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={media.src}
                  poster={fallbackPosterUrl}
                  muted
                  loop
                  playsInline
                  preload={canHover ? "metadata" : "none"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <img
                  src={media.src}
                  alt={media.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm font-medium">{media.alt}</p>
              </div>
              {media.type === "video" && (
                <div className="absolute top-3 right-3">
                  <div className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-md border border-white/50 shadow-soft flex items-center justify-center">
                    <Play className="h-4 w-4 text-text-primary" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <Dialog
          open={activeVideoIndex !== null}
          onOpenChange={(open) => {
            if (!open) setActiveVideoIndex(null);
          }}
        >
          <DialogContent className="bg-white/95 backdrop-blur-xl border-white/50 shadow-glass-lg max-w-3xl rounded-3xl p-0 overflow-hidden">
            {activeVideoIndex !== null && (
              <div className="p-4 md:p-6">
                <div className="mb-3">
                  <div className="text-sm font-medium text-text-primary">{galleryMedia[activeVideoIndex].alt}</div>
                </div>
                <video
                  src={galleryMedia[activeVideoIndex].src}
                  controls
                  autoPlay
                  playsInline
                  className="w-full rounded-2xl bg-black"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
