import Section from "../layout/Section";
import Container from "../layout/Container";
import EventCard from "../common/EventCard";
import { useState } from "react";
import { Icon } from "@iconify/react";
import SectionHeader from "../common/SectionHeader";

const events = [
  {
    background: "/images/hero.png",
    title: "Pre Summit Mixer Bengaluru 2025",
    date: "24th January",
    location: "Bengaluru",
  },
  {
    background: "/images/hero.png",
    title: "XEV FIN SUMMIT ON SUMMITS",
    date: "22nd Feb",
    location: "Dharamshala",
  },
  {
    background: "/images/hero.png",
    title: "XEV.FIN Summit on Summits Mixer",
    date: "-",
    location: "Mumbai",
  },
];

export default function EventSection() {
  const [current, setCurrent] = useState(1); // Center card

  const prev = () => setCurrent((c) => (c === 0 ? events.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === events.length - 1 ? 0 : c + 1));

  // Animation helpers
  const getCardStyle = (idx) => {
    if (idx === current) {
      return {
        transform: "translateX(-50%) scale(1) translateY(0)",
        zIndex: 20,
        opacity: 1,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      };
    } else if (idx === (current + events.length - 1) % events.length) {
      return {
        transform: "translateX(-70%) scale(0.85) translateY(30px)",
        zIndex: 10,
        opacity: 0.7,
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
      };
    } else if (idx === (current + 1) % events.length) {
      return {
        transform: "translateX(-30%) scale(0.85) translateY(30px)",
        zIndex: 10,
        opacity: 0.7,
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
      };
    } else {
      return {
        transform: "translateX(-50%) scale(0.7) translateY(60px)",
        zIndex: 0,
        opacity: 0,
        pointerEvents: "none",
      };
    }
  };

  return (
    <Section className="relative py-16">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <SectionHeader
            label="FEATURED EVENTS"
            title="Our Events"
            className="mb-8 !w-[40%]"
          />
          <button className="bg-gray-200 cursor-pointer text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-300 transition flex items-center gap-2">
            All Events
            <span>
              <Icon icon="solar:arrow-right-up-linear" width={18} height={18} />
            </span>
          </button>
        </div>

        <div className="relative flex items-center justify-center min-h-[420px] h-[520px]">
          {/* Cards with animation */}
          <div className="relative flex items-center justify-center w-full h-full">
            {events.map((event, idx) => (
              <div
                key={idx}
                className="absolute left-1/2 top-0 w-full max-w-[520px] h-[100px] transition-all duration-500 ease-in-out"
                style={{
                  ...getCardStyle(idx),
                  transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
                  transformOrigin: "center bottom",
                  pointerEvents: idx === current ? "auto" : "none",
                  // Make far left and right cards much further away and more faded
                  ...(idx === (current + events.length - 1) % events.length
                    ? {
                        transform:
                          "translateX(-120%) scale(0.7) translateY(60px)",
                        zIndex: 5,
                        opacity: 1,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      }
                    : {}),
                  ...(idx === (current + 1) % events.length
                    ? {
                        transform:
                          "translateX(20%) scale(0.7) translateY(60px)",
                        zIndex: 5,
                        opacity: 1,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      }
                    : {}),
                }}
              >
                <EventCard {...event} />
              </div>
            ))}
          </div>
        </div>
        {/* Navigation arrows below cards */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            className="bg-white border cursor-pointer border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-gray-100 transition"
            onClick={prev}
            aria-label="Previous"
          >
            <span className="text-2xl">
              <Icon icon="mdi:arrow-left" width={24} height={24} />
            </span>
          </button>
          {/* Dots */}
          <div className="flex items-center justify-center gap-2">
            {events.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  idx === current ? "bg-pink-500" : "bg-gray-300"
                }`}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to event ${idx + 1}`}
              />
            ))}
          </div>
          <button
            className="bg-white cursor-pointer border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-gray-100 transition"
            onClick={next}
            aria-label="Next"
          >
            <span className="text-2xl">
              <Icon icon="mdi:arrow-right" width={24} height={24} />
            </span>
          </button>
        </div>
      </Container>
    </Section>
  );
}
