import React from "react";
import Section from "../layout/Section";
import Container from "../layout/Container";
import { Icon } from "@iconify/react";
import SectionHeader from "../common/SectionHeader";
import { engagementModels } from "../../data/ServicesData";

const EngagementModels = () => {
  return (
    <Section className="bg-white py-16">
      <Container>
        <SectionHeader
          title="Our Engagement Models"
          label=" How we do it"
          className="mb-[60px]"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {engagementModels.map((model, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ${
                model.popular
                  ? "border-2 border-brand-primary z-10 scale-105"
                  : "border border-gray-200"
              }`}
            >
              {/* Most Popular Banner */}
              {model.popular && (
                <div className="absolute top-0 left-0 w-full bg-brand-primary text-white text-center py-2 text-xs font-semibold tracking-wide z-20">
                  Most Popular ★
                </div>
              )}
              {/* Header */}
              <div
                className={`px-6 py-4 pt-${model.popular ? "8" : "4"} bg-white`}
                style={model.popular ? { paddingTop: "2.5rem" } : {}}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        model.headerStyle === "primary"
                          ? "text-dark"
                          : "text-gray-900"
                      }`}
                    >
                      {model.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        model.headerStyle === "primary"
                          ? "text-brand-primary/80"
                          : "text-gray-600"
                      }`}
                    >
                      {model.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    {model.price}
                  </span>
                  <span className="text-gray-600 ml-2">/ {model.period}</span>
                </div>
              </div>

              {/* Get Started Button */}
              <div className="px-6 py-4 border-b border-gray-100">
                <button
                  className={`w-full py-3 rounded-full font-medium transition-colors ${
                    model.popular || model.headerStyle === "primary"
                      ? "bg-brand-primary text-white hover:bg-brand-primary/90"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Get started
                </button>
              </div>

              {/* Features */}
              <div className="px-6 py-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  What you get:
                </h4>
                <ul className="space-y-2">
                  {model.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <span className="text-brand-primary mr-3 mt-0.5">
                        <Icon icon="solar:check-circle-bold" width={18} />
                      </span>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default EngagementModels;
