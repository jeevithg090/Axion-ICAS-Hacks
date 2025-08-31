export default function Partners() {
  const logos = [
    "https://dummyimage.com/140x40/ddd/000.png&text=Partner+1",
    "https://dummyimage.com/140x40/ddd/000.png&text=Partner+2",
    "https://dummyimage.com/140x40/ddd/000.png&text=Partner+3",
    "https://dummyimage.com/140x40/ddd/000.png&text=Partner+4",
    "https://dummyimage.com/140x40/ddd/000.png&text=Partner+5",
  ];
  return (
    <section className="border-y bg-muted/20">
      <div className="container py-8">
        <div className="grid grid-cols-2 items-center justify-items-center gap-6 sm:grid-cols-3 md:grid-cols-5">
          {logos.map((src, i) => (
            <img key={i} src={src} alt={`Partner ${i + 1}`} className="h-8 w-auto opacity-75" loading="lazy" />
          ))}
        </div>
      </div>
    </section>
  );
}
