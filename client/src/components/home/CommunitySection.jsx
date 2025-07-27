import Section from "../layout/Section";
import Container from "../layout/Container";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Button from "../common/Button";

const images = [
  {
    src: "/images/hero.png",
    className: "-left-16 top-16 w-46 h-56 rounded-2xl",
  },
  {
    src: "/images/hero.png",
    className: "left-24 -top-16 w-20 h-28 rounded-xl",
  },
  {
    src: "/images/hero.png",
    className: "left-10 bottom-12 w-48 h-60 rounded-3xl",
  },
  {
    src: "/images/hero.png",
    className: "-right-16 top-16 w-46 h-56 rounded-2xl",
  },
  {
    src: "/images/hero.png",
    className: "right-24 -top-16 w-20 h-28 rounded-xl",
  },
  {
    src: "/images/hero.png",
    className: "right-10 bottom-12 w-48 h-60 rounded-3xl",
  },
];

export default function CommunitySection() {
  return (
    <Section className="my-24 md:my-48 md:mt-[300px] overflow-visible py-16 md:py-0">
      <Container className="relative">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 sm:w-80 sm:h-80 md:w-[68rem] md:h-[68rem] opacity-20 md:opacity-40 bg-radial from-white via-primary to-white blur-3xl rounded-full z-0" />

        {/* Desktop Floating images */}
        {images.map((img, i) => (
          <div
            key={i}
            className={`absolute z-10 shadow-lg overflow-hidden ${img.className} hidden lg:block`}
          >
            <Image
              src={img.src}
              alt="Community member"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80px, 120px"
            />
          </div>
        ))}

        {/* Mobile decorative images grid */}
        <div className="lg:hidden absolute inset-0 z-10 opacity-30">
          <div className="grid grid-cols-2 gap-4 h-full px-8 py-8">
            <div className="space-y-4">
              <div className="w-16 h-20 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/hero.png"
                  alt="Community"
                  width={64}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="w-20 h-24 bg-gray-200 rounded-xl overflow-hidden ml-4">
                <Image
                  src="/images/hero.png"
                  alt="Community"
                  width={80}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="w-16 h-20 bg-gray-200 rounded-lg overflow-hidden ml-auto">
                <Image
                  src="/images/hero.png"
                  alt="Community"
                  width={64}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="w-20 h-24 bg-gray-200 rounded-xl overflow-hidden mr-4">
                <Image
                  src="/images/hero.png"
                  alt="Community"
                  width={80}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Centered content */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-8xl font-extrabold text-gray-900 mb-6 md:mb-8 leading-tight">
            Meet{" "}
            <span className="block sm:inline">
              <br className="hidden sm:block" /> those who
            </span>
            <br />
            make our{" "}
            <span className="block sm:inline">
              <br className="hidden sm:block" />
              <span className="text-primary">Community</span>
            </span>
          </h2>
          <Button
            type="secondary"
            text="Explore The Communities"
            className="mt-2 w-full sm:w-80 md:w-[45%] text-sm sm:text-base lg:text-lg "
            link="/communities"
          />
        </div>
      </Container>
    </Section>
  );
}
