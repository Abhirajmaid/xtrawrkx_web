"use client";
import Image from "next/image";
import Button from "../src/components/common/Button";
import HomeHero from "../src/components/home/HomeHero";
import ServiceCard from "../src/components/common/ServiceCard";
import CTASection from "@/src/components/common/CTASection";
import Marquee from "@/src/components/common/Marquee";
import EventSection from "@/src/components/home/EventSection";
import AboutHomeSection from "../src/components/home/AboutHomeSection";
import CommunitySection from "../src/components/home/CommunitySection";

export default function Home() {
  return (
    <>
      <HomeHero />
      <AboutHomeSection />
      <Marquee />
      <EventSection />
      <CommunitySection />
      <CTASection />
    </>
  );
}
