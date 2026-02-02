import { motion } from "framer-motion";
import { useRef } from "react";

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

export default function GallerySection() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

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
              onMouseEnter={() => media.type === "video" && handleEnter(index)}
              onMouseLeave={() => media.type === "video" && handleLeave(index)}
            >
              {media.type === "video" ? (
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={media.src}
                  muted
                  loop
                  playsInline
                  preload="metadata"
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
