import React from "react";
import Button from "./Button";
import { Icon } from "@iconify/react";

export default function EventCard({
  background = "/images/hero.png",
  title,
  location,
  date,
  slug,
}) {
  return (
    <div
      className="relative rounded-2xl shadow-xl overflow-hidden w-full bg-gray-900"
      style={{ aspectRatio: "1/1" }}
    >
      {/* Full background image */}
      <img
        src={background}
        alt="event bg"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-black/10 to-black" />

      {/* Info (title, date, location) directly over image */}
      <div className="absolute left-0 right-0 bottom-20 flex flex-col items-center px-6">
        {/* Title */}
        <div className="w-full text-xl font-normal text-white mb-2 leading-tight drop-shadow-md">
          {title}
        </div>
        {/* Date and location row */}
        <div className="w-full flex justify-start gap-6">
          <div className="flex items-center gap-2 text-white drop-shadow">
            <span className="text-lg text-primary">
              <Icon icon="mdi:calendar-month-outline" width={24} height={24} />
            </span>
            <span className="font-medium text-base">{date}</span>
          </div>
          <div className="flex items-center gap-2 text-white drop-shadow">
            <span className="text-lg text-primary">
              <Icon icon="mdi:map-marker-outline" width={24} height={24} />
            </span>
            <span className="font-medium text-base">{location}</span>
          </div>
        </div>
      </div>
      {/* View More button */}
      <Button
        type="secondary"
        className="absolute left-1/2 bottom-4 cursor-pointer -translate-x-1/2 w-[92%]"
        text="View More"
        link={slug ? `/events/${slug}` : "#"}
      />
    </div>
  );
}
