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
    className: "left-12 bottom-12 w-40 h-48 rounded-3xl",
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
    className: "right-12 bottom-12 w-40 h-48 rounded-3xl",
  },
];

export default function CommunitySection() {
  return (
    <Section className="my-48 mt-[300px] overflow-visible">
      <Container className="relative">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-[68rem] md:h-[68rem] opacity-40 bg-radial from-white via-primary to-white blur-3xl rounded-full z-0" />
        {/* Floating images */}
        {images.map((img, i) => (
          <div
            key={i}
            className={`absolute z-10 shadow-lg overflow-hidden ${img.className} hidden md:block`}
            style={{}}
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
        {/* Centered content */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl md:text-8xl font-extrabold text-gray-900 mb-8">
            Meet <br /> those who
            <br />
            chose our <br />
            <span className="text-primary">Community</span>
          </h2>
          <Button
            type="secondary"
            text="Explore The Communities"
            className="mt-2 w-[45%] text-lg"
            link="/communities"
          />
        </div>
      </Container>
    </Section>
  );
}
