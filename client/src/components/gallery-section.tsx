import { motion } from "framer-motion";
import { Search } from "lucide-react";

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
  },
  {
    src: "https://images.unsplash.com/photo-1567129937968-cdad8f07e2f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Barbiere che taglia i capelli con precisione"
  },
  {
    src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    alt: "Risultato finale di taglio professionale"
  }
];

export default function GallerySection() {
  return (
    <section id="gallery" className="py-20 bg-barbershop-medium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            La Nostra <span className="text-barbershop-gold">Galleria</span>
          </h2>
          <p className="text-xl text-barbershop-muted max-w-2xl mx-auto">
            Scopri la trasformazione e l'arte che definiscono il nostro lavoro
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer"
            >
              <img 
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-barbershop-dark/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Search className="text-barbershop-gold" size={32} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
