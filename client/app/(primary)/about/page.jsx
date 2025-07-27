"use client";
import React from "react";
import Hero from "@/src/components/common/Hero";
import Stats from "@/src/components/about/Stats";
import Marquee from "@/src/components/common/Marquee";
import Purpose from "@/src/components/about/Purpose";
import CodeOfConduct from "@/src/components/about/CodeOfConduct";
import Values from "@/src/components/about/Values";
import Team from "@/src/components/about/Team";
import Slider from "@/src/components/about/Slider";
import FAQ from "@/src/components/about/FAQ";
import HowWeHelp from "@/src/components/about/HowWeHelp";
import CTASection from "@/src/components/common/CTASection";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Hero
        title="About xtrawrkx"
        description="At xtrawrkx, we help you solve next-level challenges, smart wrkx style. From advisory to execution, we build solutions to address xtra hard problems in automotive and manufacturing industries, especially around electric vehicles (EVs), drones, and consumer electronics."
      />
      <Stats />
      <Purpose />
      <CodeOfConduct />
      <Values />
      <Team />
      {/* <Slider /> */}
      <HowWeHelp />
      <FAQ />
      <Marquee />
      <CTASection />
    </div>
  );
}
