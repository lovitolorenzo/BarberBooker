import { motion } from "framer-motion";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1503951458645-643d53bfd90f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Barbiere al lavoro con rasoio tradizionale"
  },
  {
    src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Strumenti da barbiere professionali vintage"
  },
  {
    src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Forbici e pettini da barbiere di qualità"
  },
  {
    src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Sedia da barbiere in pelle classica"
  },
  {
    src: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Setup completo per rasatura con pennello e schiuma"
  },
  {
    src: "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Interno elegante di barbiere tradizionale"
  }
];

export default function GallerySection() {
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
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer hover-lift"
            >
              <img 
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm font-medium">{image.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
