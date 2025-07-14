import Section from "../layout/Section";
import Container from "../layout/Container";
import Image from "next/image";

export default function AboutHomeSection() {
  return (
    <Section className="relative bg-[#E3E3E3] min-h-[110vh] flex items-center justify-center py-20">
      <Container>
        {/* Main text */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center min-h-[340px]">
          <p className="text-xl md:text-5xl font-extralight text-gray-900 max-w-6xl mx-auto leading-relaxed">
            At Xtrawrkx, we solve{" "}
            <span className="font-medium">
              Xtra-tough <br /> challenges
            </span>{" "}
            with <span className="font-medium">smart, strategic Wrkx</span>.
            <br />
            From <span className="font-medium">Consulting</span> to{" "}
            <span className="font-medium">Electric Vehicles</span> —<br />
            we bring &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; the <span className="font-medium">spark</span>.
          </p>
          {/* Top-left image */}
          <div className="absolute -left-10 -top-12 w-40 h-28 md:w-56 md:h-38 z-10">
            <Image
              src="/images/hero.png" // Replace with actual image path
              alt="Team group 1"
              fill
              className="object-cover rounded-md shadow-lg"
              style={{ objectPosition: "center" }}
            />
          </div>
          {/* Top-right image */}
          <div className="absolute -right-32 top-20 w-40 h-28 md:w-56 md:h-42 z-10">
            <Image
              src="/images/hero.png" // Replace with actual image path
              alt="Team group 2"
              fill
              className="object-cover rounded-md shadow-lg"
              style={{ objectPosition: "center" }}
            />
          </div>
          {/* Bottom-center image */}
          <div className="absolute left-1/2 -bottom-30 transform -translate-x-1/2 w-40 h-28 md:w-56 md:h-46 z-10">
            <Image
              src="/images/hero.png" // Replace with actual image path
              alt="Panel discussion"
              fill
              className="object-cover rounded-md shadow-lg"
              style={{ objectPosition: "center" }}
            />
          </div>
        </div>
        {/* Cloud effect at bottom */}
        <div
          className="absolute left-0 right-0 bottom-0 h-24 md:h-32 bg-gradient-to-t from-[#f5f5f5] to-transparent pointer-events-none"
          style={{ zIndex: 5 }}
        />
      </Container>
    </Section>
  );
}
