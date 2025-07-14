import Image from "next/image";
import Section from "../layout/Section";
import Button from "../common/Button";
import { Icon } from "@iconify/react";

export default function HomeHero() {
  return (
    <Section className="relative bg-[#E3E3E3] w-full h-[105vh] min-h-[700px] flex flex-col items-center justify-center !overflow-x-hidden p-0">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/images/homeHero.png"
          alt="Home Hero background"
          fill
          className=" object-top"
          priority
        />
      </div>

      {/* Main content area - centered for subtitle and button */}
      <div className="relative z-20 flex flex-col items-center justify-end text-center w-full mx-auto px-4 h-full">
        {/* Subtitle text */}
        <div className="text-dark text-center mb-2 font-heading font-extralight text-2xl md:text-6xl">
          <p>From Complexity to Clarity</p>
          <p>We Build What Matters.</p>
        </div>
        <Button text="GET STARTED" type="primary" />
      </div>

      {/* Action cards at bottom */}
      <div className="absolute bottom-20 left-0 right-0 z-20 px-4">
        <div className="w-[95%] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left cards */}
          <div className="relative flex w-full md:w-[26%] min-h-[220px]">
            {/* Business Advisory and Consulting card (upper left) */}
            <div
              className="absolute left-0 -top-10 bg-gradient-to-b from-[#BDBDBD]/90 to-[#E3E3E3]/80 rounded-2xl shadow-md w-[180px] h-[220px] flex flex-col justify-between items-center p-4 border border-white/40"
              style={{ zIndex: 10 }}
            >
              <div className="flex flex-col items-center justify-center flex-1">
                <div
                  className="text-white text-base font-bold text-center leading-tight mb-2 drop-shadow-sm"
                  style={{ opacity: 0.95 }}
                >
                  Business
                  <br />
                  Advisory and
                  <br />
                  Consulting
                </div>
              </div>
              <button className="mt-2 w-full bg-white rounded-full px-4 py-1 text-xs font-medium text-gray-800 flex items-center justify-center gap-1 border border-gray-200 shadow-sm hover:bg-gray-100 transition">
                Read More
                <span className="ml-1 text-base">
                  <Icon
                    icon="ic:round-arrow-forward"
                    className="text-gray-700"
                  />
                </span>
              </button>
            </div>
            {/* Financial Analysis and Reporting card (lower right, slightly to the right and down) */}
            <div
              className="absolute right-0 bottom-0 bg-gradient-to-b from-[#E3E3E3]/90 to-[#BDBDBD]/80 rounded-2xl shadow-md w-[180px] h-[220px] flex flex-col justify-between items-center p-4 border border-white/40"
              style={{ zIndex: 20 }}
            >
              <div className="flex flex-col items-center justify-center flex-1">
                <div
                  className="text-white text-base font-bold text-center leading-tight mb-2 drop-shadow-sm"
                  style={{ opacity: 0.95 }}
                >
                  Financial
                  <br />
                  Analysis and
                  <br />
                  Reporting
                </div>
              </div>
              <button className="mt-2 w-full bg-white rounded-full px-4 py-1 text-xs font-medium text-gray-800 flex items-center justify-center gap-1 border border-gray-200 shadow-sm hover:bg-gray-100 transition">
                Read More
                <span className="ml-1 text-base">
                  <Icon
                    icon="ic:round-arrow-forward"
                    className="text-gray-700"
                  />
                </span>
              </button>
            </div>
          </div>
          {/* Center text (spacer for symmetry, or you can add a logo or text here if needed) */}
          {/* Optionally, add a logo or central text here */}
          {/* <div className="hidden md:flex flex-col items-center justify-center w-[20%]">
          </div> */}
          {/* Right cards */}
          <div className="relative flex w-full md:w-[26%] min-h-[220px]">
            {/* Contract Manufacturing card (lower left) */}
            <div
              className="absolute left-0 bottom-0 bg-gradient-to-b from-[#E3E3E3]/80 to-[#BDBDBD]/80 rounded-2xl shadow-md w-[180px] h-[220px] flex flex-col justify-between items-center p-4 border border-white/40"
              style={{ zIndex: 10 }}
            >
              <div className="flex flex-col items-center justify-center flex-1">
                <div
                  className="text-white text-base font-bold text-center leading-tight mb-1 drop-shadow-sm"
                  style={{ opacity: 0.85 }}
                >
                  Contract
                  <br />
                  Manufacturing
                </div>
              </div>
              <button className="mt-2 w-full bg-white rounded-full px-4 py-1 text-xs font-medium text-gray-800 flex items-center justify-center gap-1 border border-gray-200 shadow-sm hover:bg-gray-100 transition">
                Read More
                <span className="ml-1 text-base">
                  <Icon
                    icon="ic:round-arrow-forward"
                    className="text-gray-700"
                  />
                </span>
              </button>
            </div>
            {/* Management Consulting card (upper right) */}
            <div
              className="absolute right-0 -top-10 bg-gradient-to-b from-[#A6A6A6]/80 to-[#E3E3E3]/80 rounded-2xl shadow-md w-[180px] h-[220px] flex flex-col justify-between items-center p-4 border border-white/40"
              style={{ zIndex: 20 }}
            >
              <div className="flex flex-col items-center justify-center flex-1">
                <div
                  className="text-white text-base font-bold text-center leading-tight mb-1 drop-shadow-sm"
                  style={{ opacity: 0.85 }}
                >
                  Management
                  <br />
                  Consulting
                </div>
              </div>
              <button className="mt-2 w-full bg-white rounded-full px-4 py-1 text-xs font-medium text-gray-800 flex items-center justify-center gap-1 border border-gray-200 shadow-sm hover:bg-gray-100 transition">
                Read More
                <span className="ml-1 text-base">
                  <Icon
                    icon="ic:round-arrow-forward"
                    className="text-gray-700"
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Down arrow indicator */}
      {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 cursor-pointer animate-bounce">
          <Icon icon="solar:arrow-down-linear" width="20" height="20" />
        </div>
      </div> */}
    </Section>
  );
}
