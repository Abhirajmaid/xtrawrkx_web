"use client";
import React from "react";
import Section from "@/src/components/layout/Section";
import Container from "@/src/components/layout/Container";
import Hero from "@/src/components/common/Hero";
import Button from "@/src/components/common/Button";
import { Icon } from "@iconify/react";
import modalsData from "@/src/data/ModalsData";
import Marquee from "@/src/components/common/Marquee";
import CTASection from "@/src/components/common/CTASection";

export default function ModalsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero
        title="Engagement Models"
        description="Choose the perfect engagement model that fits your business stage and goals. From startup support to enterprise consulting, we have the right solution for your growth journey."
        backgroundImage="/images/hero1.png"
        showButton={true}
        buttonText="Get Started"
        buttonLink="/contact-us"
      />

      {/* Main Content */}
      <Section className="py-16">
        <Container>
          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {modalsData.map((modal) => (
              <div
                key={modal.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 ${
                  modal.popular ? "border-brand-primary" : "border-gray-100"
                }`}
              >
                {modal.popular && (
                  <div className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-center py-2 text-sm font-semibold">
                    Most Popular ⭐
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {modal.name}
                    </h3>
                    <div className="text-2xl font-bold text-brand-primary">
                      {modal.price}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 h-12">{modal.description}</p>

                  <div className="space-y-3 mb-6">
                    {modal.features.slice(0, 5).map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Icon
                          icon="solar:check-circle-bold"
                          className="text-green-500"
                          width={20}
                        />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    text="Learn More"
                    type={modal.popular ? "primary" : "secondary"}
                    className="w-full"
                    link={`/modals/${modal.slug}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Section */}
          <div className="bg-gray-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Not sure which model is right for you?
            </h2>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              Our experts can help you choose the perfect engagement model based
              on your specific needs, budget, and goals.
            </p>
            <div className="flex justify-center">
              <Button
                text="Schedule Consultation"
                type="primary"
                link="/contact-us"
              />
            </div>
          </div>
        </Container>
      </Section>

      <Marquee />
      <CTASection />
    </div>
  );
}
