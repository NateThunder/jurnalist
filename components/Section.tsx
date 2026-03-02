type SectionProps = {
  id: string;
  title: string;
  description: string;
};

export default function Section({ id, title, description }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-white/10 bg-[#070911] px-6 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="text-3xl font-extrabold uppercase tracking-[0.06em] text-[#f6a21a] sm:text-4xl">
          {title}
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#d5d6db] sm:text-xl">{description}</p>
      </div>
    </section>
  );
}
