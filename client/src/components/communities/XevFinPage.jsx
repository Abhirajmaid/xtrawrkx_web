import React from "react";
import Image from "next/image";
import Section from "../layout/Section";
import Container from "../layout/Container";
import Button from "../common/Button";
import { Icon } from "@iconify/react";

const XevFinPage = ({ community }) => {
  const investmentStats = [
    {
      label: "Total Funding Raised",
      value: "₹250+ Cr",
      icon: "mdi:currency-inr",
    },
    { label: "Active Investors", value: "250+", icon: "mdi:account-tie" },
    { label: "Successful Exits", value: "25+", icon: "mdi:trending-up" },
    { label: "Average Funding", value: "₹5 Cr", icon: "mdi:chart-line" },
  ];

  const investorTypes = [
    {
      name: "Angel Investors",
      count: "120+",
      description: "Individual investors backing early-stage startups",
    },
    {
      name: "Venture Capital",
      count: "50+",
      description: "Institutional investors for growth-stage companies",
    },
    {
      name: "Private Equity",
      count: "30+",
      description: "Large-scale investments for mature companies",
    },
    {
      name: "NBFCs",
      count: "25+",
      description: "Non-banking financial companies",
    },
    {
      name: "Investment Banks",
      count: "15+",
      description: "Financial institutions providing advisory services",
    },
    {
      name: "Franchise Owners",
      count: "35+",
      description: "Successful franchise operators seeking partnerships",
    },
  ];

  const fundingStages = [
    {
      stage: "Pre-Seed",
      range: "₹10L - ₹50L",
      focus: "MVP Development & Market Validation",
    },
    {
      stage: "Seed",
      range: "₹50L - ₹5Cr",
      focus: "Product-Market Fit & Initial Scaling",
    },
    {
      stage: "Series A",
      range: "₹5Cr - ₹25Cr",
      focus: "Market Expansion & Team Building",
    },
    {
      stage: "Series B+",
      range: "₹25Cr+",
      focus: "Scale Operations & New Markets",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Section className="relative w-full h-[95vh] min-h-[600px] flex items-center justify-center overflow-hidden p-0">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/hero_services.png"
            alt="XEV.FiN Network"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2d5a9e]/95 via-[#2d5a9e]/85 to-[#24487a]/90" />
        </div>

        <Container className="relative z-20 text-center text-white mt-20">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#2d5a9e] to-[#24487a] text-white px-8 py-3 rounded-full text-lg font-semibold mb-6 shadow-lg">
            <Icon icon="mdi:finance" width={24} />
            Electric Vehicle Finance Network
          </div>

          {/* XEV.FiN Logo */}
          <div className="mb-6">
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
              <Image
                src="/images/xevfin.png"
                alt="XEV.FiN Logo"
                width={120}
                height={120}
                className="mx-auto"
                priority
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 drop-shadow-lg">
            XEV.FiN
          </h1>
          <p className="text-2xl text-white/90 max-w-4xl mx-auto mb-4 drop-shadow">
            Connect with 250+ Angel investor syndicates, VCs, PE firms, IBs,
            NBFCs and Franchise Owners
          </p>
          <div className="flex justify-center">
            <Button
              text="Join the Community"
              type="primary"
              className="text-lg"
              onClick={() => {
                window.open("https://forms.gle/feK3siB7oorSFzXr5", "_blank");
              }}
            />
          </div>
        </Container>
      </Section>

      {/* Investment Statistics */}
      <Section className="py-20 bg-gradient-to-br from-[#2d5a9e]/10 to-[#2d5a9e]/20">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Network Impact
            </h2>
            <p className="text-xl text-gray-600">
              Driving the EV revolution through strategic investments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {investmentStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="bg-gradient-to-br from-[#2d5a9e] to-[#24487a] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Icon icon={stat.icon} className="text-3xl text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Investor Network */}
      <Section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Investor Network
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Connect with a diverse ecosystem of financial partners committed
                to advancing electric vehicle innovation.
              </p>

              <div className="space-y-6">
                {investorTypes.map((type, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl"
                  >
                    <div className="bg-[#2d5a9e]/10 rounded-lg p-3 flex-shrink-0">
                      <Icon
                        icon="mdi:account-cash"
                        className="text-[#2d5a9e] text-2xl"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {type.name}
                        </h3>
                        <span className="bg-[#2d5a9e]/10 text-[#2d5a9e] px-3 py-1 rounded-full text-sm font-medium">
                          {type.count}
                        </span>
                      </div>
                      <p className="text-gray-600">{type.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Funding Stages
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                From idea to scale, we support startups at every stage of their
                funding journey.
              </p>

              <div className="space-y-4">
                {fundingStages.map((stage, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-6 hover:border-[#2d5a9e]/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {stage.stage}
                      </h3>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {stage.range}
                      </span>
                    </div>
                    <p className="text-gray-600">{stage.focus}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Application Process */}
      <Section className="py-20 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How to Join
            </h2>
            <p className="text-xl text-gray-600">
              Your path to securing funding in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Apply",
                description:
                  "Submit your startup application with pitch deck and financials",
              },
              {
                step: "02",
                title: "Screen",
                description:
                  "Our expert panel reviews your application and business model",
              },
              {
                step: "03",
                title: "Pitch",
                description:
                  "Present to our network of investors in monthly meetups",
              },
              {
                step: "04",
                title: "Fund",
                description:
                  "Connect with interested investors and close your funding round",
              },
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-[#2d5a9e] to-[#24487a] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-lg">
                    {process.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {process.title}
                </h3>
                <p className="text-gray-600">{process.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              text="Start Your Application"
              type="primary"
              className="text-lg px-8 py-4"
            />
          </div>
        </Container>
      </Section>

      {/* Success Stories */}
      <Section className="py-20">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Startups that have successfully raised funding through our network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                company: "EcoCharge Solutions",
                amount: "₹15 Cr",
                stage: "Series A",
                description: "EV charging infrastructure startup",
              },
              {
                company: "GreenDrive Tech",
                amount: "₹8 Cr",
                stage: "Seed",
                description: "Electric vehicle manufacturing",
              },
              {
                company: "PowerCell Innovations",
                amount: "₹25 Cr",
                stage: "Series B",
                description: "Battery technology solutions",
              },
            ].map((story, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="bg-green-100 rounded-lg p-4 mb-6">
                  <Icon
                    icon="mdi:trending-up"
                    className="text-green-600 text-3xl"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {story.company}
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-[#2d5a9e]/10 text-[#2d5a9e] px-3 py-1 rounded-full text-sm font-medium">
                    {story.amount}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {story.stage}
                  </span>
                </div>
                <p className="text-gray-600">{story.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default XevFinPage;
