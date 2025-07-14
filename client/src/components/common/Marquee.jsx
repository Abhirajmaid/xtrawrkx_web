import React from "react";
import Section from "../layout/Section";
import Container from "../layout/Container";
import { Icon } from "@iconify/react";

const marqueeText = "connect";
const repeatCount = 10; // Adjust for smoothness/length

export default function Marquee() {
  return (
    <Section className="!overflow-hidden !py-4 bg-gradient-to-b from-secondary to-primary">
      <div
        className="flex w-max animate-marquee"
        style={{ animation: "marquee 18s linear infinite" }}
      >
        {Array.from({ length: repeatCount }).map((_, i) => (
          <span
            className="text-white text-4xl !font-light font-[Montserrat,Arial,sans-serif] mx-10 whitespace-nowrap tracking-wide flex items-center gap-3"
            key={i}
          >
            {marqueeText}
            <Icon icon="solar:arrow-right-up-linear" width="36" height="36" />
          </span>
        ))}
        {/* Duplicate for seamless looping */}
        {Array.from({ length: repeatCount }).map((_, i) => (
          <span
            className="text-white text-4xl !font-light font-[Montserrat,Arial,sans-serif] mx-10 whitespace-nowrap tracking-wide flex items-center gap-3"
            key={i + repeatCount}
          >
            {marqueeText}
            <Icon icon="solar:arrow-right-up-linear" width="36" height="36" />
          </span>
        ))}
      </div>
      <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
    </Section>
  );
}
