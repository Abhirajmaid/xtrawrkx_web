import React from "react";
import Image from "next/image";
import Section from "../layout/Section";
import Container from "../layout/Container";
import Button from "../common/Button";
import { Icon } from "@iconify/react";

const XevtgPage = ({ community }) => {
  const talentStats = [
    { label: "Active TPOs", value: "150+", icon: "mdi:school" },
    { label: "HR Professionals", value: "200+", icon: "mdi:account-tie" },
    { label: "Job Placements", value: "1000+", icon: "mdi:briefcase-check" },
    { label: "Training Programs", value: "50+", icon: "mdi:certificate" },
  ];

  const memberCategories = [
    {
      name: "Training & Placement Officers",
      count: "150+",
      description: "TPOs from premier engineering and business schools",
      institutions: ["IITs", "NITs", "IIMs", "Top Engineering Colleges"],
      icon: "mdi:school",
    },
    {
      name: "HR & Talent Acquisition",
      count: "200+",
      description: "HR teams from leading EV companies and startups",
      companies: ["OEMs", "Startups", "Tier-1 Suppliers", "Tech Companies"],
      icon: "mdi:account-tie",
    },
    {
      name: "Training Organizations",
      count: "80+",
      description: "Specialized training providers for EV skills",
      focus: ["Technical Skills", "Soft Skills", "Industry Certifications"],
      icon: "mdi:certificate",
    },
  ];

  const skillDomains = [
    { domain: "Electric Powertrain", level: "Advanced", openings: "250+" },
    { domain: "Battery Technology", level: "Expert", openings: "180+" },
    { domain: "Autonomous Driving", level: "Intermediate", openings: "120+" },
    { domain: "Charging Infrastructure", level: "Advanced", openings: "200+" },
    { domain: "Software Engineering", level: "All Levels", openings: "300+" },
    { domain: "Manufacturing", level: "Advanced", openings: "150+" },
  ];

  const trainingPrograms = [
    {
      program: "EV Fundamentals Bootcamp",
      duration: "4 weeks",
      target: "Fresh Graduates",
      placement: "85%",
      partners: "15+ companies",
    },
    {
      program: "Battery Technology Certification",
      duration: "8 weeks",
      target: "Mid-level Engineers",
      placement: "92%",
      partners: "12+ companies",
    },
    {
      program: "Leadership in EV Industry",
      duration: "6 weeks",
      target: "Senior Professionals",
      placement: "78%",
      partners: "20+ companies",
    },
  ];

  const upcomingEvents = [
    {
      title: "EV Career Fair 2024",
      date: "Dec 5-6",
      type: "Recruitment",
      companies: "50+",
    },
    {
      title: "Skills Assessment Drive",
      date: "Dec 10",
      type: "Evaluation",
      participants: "200+",
    },
    {
      title: "HR Connect Summit",
      date: "Dec 15",
      type: "Networking",
      attendees: "100+",
    },
    {
      title: "Training Partners Meet",
      date: "Dec 20",
      type: "B2B",
      organizations: "30+",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Section className="relative w-full h-[95vh] min-h-[600px] flex items-center justify-center overflow-hidden p-0">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/hero_services.png"
            alt="XEVTG Network"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-800/80 to-green-700/90" />
        </div>

        <Container className="relative z-20 text-center text-white mt-20">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold mb-6 shadow-lg">
            <Icon icon="mdi:account-group" width={24} />
            EV Talent Group
          </div>

          {/* XEVTG Logo Placeholder - Add logo when available */}
          <div className="mb-6">
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
              <div className="w-[120px] h-[120px] bg-green-500/20 rounded-2xl flex items-center justify-center">
                <Icon
                  icon="mdi:account-group"
                  className="text-6xl text-white/80"
                />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 drop-shadow-lg">
            XEVTG
          </h1>
          <p className="text-2xl text-white/90 max-w-4xl mx-auto mb-4 drop-shadow">
            Bridging the talent gap in EV industry through strategic
            partnerships between institutions and companies
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

      {/* Talent Network Statistics */}
      <Section className="py-20 bg-gradient-to-br from-green-50 to-green-100">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Talent Pipeline Impact
            </h2>
            <p className="text-xl text-gray-600">
              Building the largest talent network for the EV ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {talentStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
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

      {/* Member Categories */}
      <Section className="py-20">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Network
            </h2>
            <p className="text-xl text-gray-600">
              Connecting institutions, companies, and training organizations
            </p>
          </div>

          <div className="space-y-12">
            {memberCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="bg-green-100 rounded-2xl p-6 flex-shrink-0">
                      <Icon
                        icon={category.icon}
                        className="text-green-600 text-4xl"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {category.name}
                        </h3>
                        <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                          {category.count}
                        </span>
                      </div>
                      <p className="text-lg text-gray-600 mb-6">
                        {category.description}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {(
                          category.institutions ||
                          category.companies ||
                          category.focus
                        ).map((item, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Skills in Demand */}
      <Section className="py-20 bg-gradient-to-br from-slate-50 via-white to-green-50/30">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Skills in Demand
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Current job market demands in the EV industry across different
                skill levels and domains.
              </p>

              <div className="space-y-4">
                {skillDomains.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {skill.domain}
                      </h3>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {skill.openings} openings
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Icon icon="mdi:chart-line" />
                      {skill.level} level positions
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Training Programs
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Specialized training programs designed to bridge the skill gap
                in EV industry.
              </p>

              <div className="space-y-6">
                {trainingPrograms.map((program, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {program.program}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {program.duration}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Target: {program.target}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-green-600">
                        <Icon icon="mdi:chart-line" />
                        {program.placement} placement rate
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <Icon icon="mdi:office-building" />
                        {program.partners} hiring partners
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  text="Explore Training Programs"
                  type="primary"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Upcoming Events */}
      <Section className="py-20">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600">
              Connect, recruit, and develop talent through our events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {event.title}
                  </h3>
                  <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {event.date}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
                  <Icon icon="mdi:tag" />
                  {event.type}
                </div>
                <div className="text-gray-600">
                  {event.companies &&
                    `${event.companies} companies participating`}
                  {event.participants &&
                    `${event.participants} participants expected`}
                  {event.attendees && `${event.attendees} HR professionals`}
                  {event.organizations &&
                    `${event.organizations} training organizations`}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              text="Register for Events"
              type="primary"
              className="text-lg px-8 py-4"
            />
          </div>
        </Container>
      </Section>

      {/* Success Metrics */}
      <Section className="py-20 bg-gradient-to-br from-slate-50 via-white to-green-50/30">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Measurable impact on EV talent development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                metric: "Average Salary Increase",
                value: "40%",
                description:
                  "Post-training salary improvement for participants",
                icon: "mdi:trending-up",
              },
              {
                metric: "Placement Rate",
                value: "88%",
                description: "Successfully placed candidates within 3 months",
                icon: "mdi:briefcase-check",
              },
              {
                metric: "Company Satisfaction",
                value: "94%",
                description: "Hiring partners satisfied with candidate quality",
                icon: "mdi:thumb-up",
              },
            ].map((story, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg text-center"
              >
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Icon icon={story.icon} className="text-green-600 text-3xl" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {story.value}
                </h3>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  {story.metric}
                </h4>
                <p className="text-gray-600">{story.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Call to Action */}
      <Section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <Container className="text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Bridge the Talent Gap?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join 350+ TPOs, HR professionals, and training organizations shaping
            the future of EV talent
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              text="Join XEVTG"
              type="primary"
              className="bg-white text-green-600 hover:bg-gray-100 text-lg"
            />
            <Button
              text="Schedule Demo"
              type="secondary"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-lg"
            />
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default XevtgPage;
