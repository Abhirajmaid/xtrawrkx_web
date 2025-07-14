import React from "react";
import Navbar from "@/src/components/layout/Navbar";
import Marquee from "@/src/components/common/Marquee";
import Footer from "@/src/components/layout/Footer";
import ContactForm from "@/src/components/contact/ContactForm";
import ContactInfo from "@/src/components/contact/ContactInfo";
import NewsletterSection from "@/src/components/contact/NewsletterSection";
import Hero from "@/src/components/common/Hero";

export default function ContactUsPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Hero
        title="Contact Us"
        description="Since its founding in 1963, BCG has been a pioneer in business strategy. Today, we work closely with clients to empower their organizations to grow, build sustainable competitive advantage, and drive positive societal impact."
      />
      <Marquee />
      <ContactForm />
      <ContactInfo />
      <NewsletterSection />
      <Marquee />
    </div>
  );
}
