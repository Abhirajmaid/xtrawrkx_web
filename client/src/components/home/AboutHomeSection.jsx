import Section from "../layout/Section";
import Container from "../layout/Container";
import Image from "next/image";

export default function AboutHomeSection() {
  return (
    <Section className="relative bg-[#E3E3E3] min-h-[80vh] md:min-h-[110vh] flex items-center justify-center py-12 md:py-20">
      <Container>
        {/* Main text */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center min-h-[280px] md:min-h-[340px] px-4">
          <p className="text-base sm:text-lg md:text-3xl lg:text-5xl font-extralight text-gray-900 max-w-6xl mx-auto leading-relaxed">
            At Xtrawrkx, we solve{" "}
            <span className="font-medium">
              Xtra-tough{" "}
              <span className="hidden sm:inline">
                <br />
              </span>
              challenges
            </span>{" "}
            with <span className="font-medium">smart, strategic Wrkx</span>.
            <br />
            From <span className="font-medium">Consulting</span> to{" "}
            <span className="font-medium">Electric Vehicles</span> —
            <span className="hidden md:inline">
              <br />
            </span>
            we bring{" "}
            <span className="hidden md:inline">
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              &nbsp;
            </span>{" "}
            the <span className="font-medium">spark</span>.
          </p>

          {/* Images - Hidden on mobile for cleaner layout */}
          <div className="hidden sm:block">
            {/* Top-left image */}
            <div className="absolute -left-6 md:-left-10 -top-6 md:-top-12 w-28 h-20 md:w-40 md:h-28 lg:w-56 lg:h-38 z-10">
              <Image
                src="/images/hero.png"
                alt="Team group 1"
                fill
                className="object-cover rounded-md shadow-lg"
                style={{ objectPosition: "center" }}
              />
            </div>
            {/* Top-right image */}
            <div className="absolute -right-20 md:-right-32 top-12 md:top-20 w-28 h-20 md:w-40 md:h-28 lg:w-56 lg:h-42 z-10">
              <Image
                src="/images/hero.png"
                alt="Team group 2"
                fill
                className="object-cover rounded-md shadow-lg"
                style={{ objectPosition: "center" }}
              />
            </div>
            {/* Bottom-center image */}
            <div className="absolute left-1/2 -bottom-20 md:-bottom-30 transform -translate-x-1/2 w-28 h-20 md:w-40 md:h-28 lg:w-56 lg:h-46 z-10">
              <Image
                src="/images/hero.png"
                alt="Panel discussion"
                fill
                className="object-cover rounded-md shadow-lg"
                style={{ objectPosition: "center" }}
              />
            </div>
          </div>

          {/* Mobile-only decorative elements */}
          <div className="sm:hidden absolute inset-0 pointer-events-none">
            {/* Simple decorative shapes for mobile */}
            <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full opacity-30"></div>
            <div className="absolute bottom-8 right-6 w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full opacity-20"></div>
            <div className="absolute top-1/2 right-2 w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-40"></div>
          </div>
        </div>

        {/* Cloud effect at bottom */}
        <div
          className="absolute left-0 right-0 bottom-0 h-16 md:h-24 lg:h-32 bg-gradient-to-t from-[#f5f5f5] to-transparent pointer-events-none"
          style={{ zIndex: 5 }}
        />
      </Container>
    </Section>
  );
}
