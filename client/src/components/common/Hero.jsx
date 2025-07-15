import Image from "next/image";
import Section from "../layout/Section";

export default function Hero({ title, description }) {
  return (
    <Section className="relative w-full h-[90vh] min-h-[400px] flex items-center justify-start overflow-hidden p-0">
      {/* Background image, always the same */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero.jpg"
          alt="Hero background"
          fill
          className="object-cover object-right scale-100 md:object-right z-0"
          priority
        />
        {/* Overlay gradient for text readability */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(0deg, rgba(255,255,255,1) 0%,  rgba(255,255,255,0) 20%, rgba(255,255,255,0) 100%)",
          }}
        />
      </div>
      {/* Content on left */}
      <div className="relative z-20 flex flex-col items-start justify-center text-left w-7xl mx-auto px-4 md:pl-16 -mt-[50px]">
        <h1 className="text-white text-5xl md:text-7xl font-extrabold mb-8 drop-shadow-lg">
          {title}
        </h1>
        <p className="text-white text-lg md:text-xl max-w-2xl font-light drop-shadow">
          {description}
        </p>
      </div>
    </Section>
  );
}
