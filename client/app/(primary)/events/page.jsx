"use client";
import Hero from "@/src/components/common/Hero";
import Marquee from "@/src/components/common/Marquee";
import UpcomingEvents from "@/src/components/events/UpcomingEvents";
import PastEvents from "@/src/components/events/PastEvents";
import React from "react";
import EventSection from "@/src/components/home/EventSection";

const page = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero
        title="Our Events"
        description="Discover and participate in our latest events, workshops, and community gatherings. Stay updated and connect with like-minded professionals to grow, learn, and collaborate."
        backgroundImage="/images/hero1.png"
        showButton={true}
        buttonText="Get Started"
        buttonLink="/contact-us"
      />
      <EventSection />
      <UpcomingEvents />
      <PastEvents />
      <Marquee />
    </div>
  );
};

export default page;
