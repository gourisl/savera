export default function InstagramFeed() {
  const images = [
    "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605100804763-247f66150ce8?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop",
  ];

  return (
    <section className="py-24 bg-[var(--color-surface-light)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="text-sm tracking-[0.2em] uppercase text-[var(--color-primary-gold)] font-bold mb-3 block">
            @savera.jewellery
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text-main)]">
            Follow Us on Instagram
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
          {images.map((img, index) => (
            <a
              key={index}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-xs font-bold tracking-widest uppercase">View</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
