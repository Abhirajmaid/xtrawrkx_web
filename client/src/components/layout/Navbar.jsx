"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Button from "../common/Button";
import { navbarLinks } from "../../data/Navlinks";
import { Icon } from "@iconify/react";
import Dropdown from "../common/Dropdown";
import {
  servicesDropdownData,
  communitiesDropdownData,
  eventsDropdownData,
} from "../../data/Dropdown";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);

  // State for dynamic right column in events dropdown
  const [selectedEventMiddle, setSelectedEventMiddle] = useState(0);

  // Mock right lists for each middle item
  const eventsRightLists = [
    [
      {
        label: "Pre-Summit Mixer Hyderabad",
        slug: "/events/pre-summit-mixer-hyderabad",
      },
      {
        label: "Pre-Summit Mixer Ahmedabad",
        slug: "/events/pre-summit-mixer-ahmedabad",
      },
      {
        label: "Pre-Summit Mixer Bhubaneshwar",
        slug: "/events/pre-summit-mixer-bhubaneshwar",
      },
      {
        label: "Pre-Summit Mixer Chandhighar",
        slug: "/events/pre-summit-mixer-chandhighar",
      },
    ],
    [
      { label: "Summit 2024 Mumbai", slug: "/events/summit-2024-mumbai" },
      { label: "Summit 2024 Delhi", slug: "/events/summit-2024-delhi" },
      { label: "Summit 2024 Bangalore", slug: "/events/summit-2024-bangalore" },
    ],
    [
      {
        label: "International Visit Tokyo",
        slug: "/events/international-visit-tokyo",
      },
      {
        label: "International Visit Berlin",
        slug: "/events/international-visit-berlin",
      },
    ],
  ];

  // Close dropdown on outside click or scroll
  useEffect(() => {
    if (!openDropdown) return;

    function handleClick(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest('[data-dropdown-trigger="Services"]')
      ) {
        setOpenDropdown(null);
      }
    }
    function handleScroll() {
      setOpenDropdown(null);
    }
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [openDropdown]);

  const servicesDropdownContent = (
    <div className="bg-white rounded-2xl shadow-2xl p-8 mt-3 flex gap-8 border border-gray-100 w-full">
      {/* Left column */}
      <div className="w-1/3 flex flex-col justify-between">
        <div>
          <div className="text-xl font-normal mb-2 font-primary">
            {servicesDropdownData.leftTitle}
          </div>
          <div className="text-sm text-gray-600 mb-6 font-primary">
            {servicesDropdownData.description}
          </div>
          <Button
            text="Explore"
            type="primary"
            className="w-fit"
            link="/services"
          />
        </div>
      </div>
      {/* Middle column */}
      <div className="w-1/3">
        <div className="text-xl font-normal mb-2 font-primary">
          {servicesDropdownData.middleTitle}
        </div>
        <ul className="space-y-2">
          {servicesDropdownData.middleList.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0 group cursor-pointer hover:text-brand-primary transition"
            >
              <a
                href={item.slug}
                className="flex-1 pl-2 transition-all duration-200 border-l-4 border-transparent group-hover:border-brand-primary group-hover:pl-5 hover:no-underline text-sm"
              >
                {item.label}
              </a>
              <Icon
                icon="solar:arrow-right-up-linear"
                width="22"
                className="opacity-70 group-hover:text-brand-primary"
              />
            </li>
          ))}
        </ul>
      </div>
      {/* Right column */}
      <div className="w-1/3">
        <div className="text-xl font-normal mb-2 font-primary">
          {servicesDropdownData.rightTitle}
        </div>
        <ul className="space-y-2">
          {servicesDropdownData.rightList.map((item, idx) => (
            <li
              key={item.label + idx}
              className="flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0 group cursor-pointer hover:text-brand-primary transition"
            >
              <a
                href={item.slug}
                className="flex-1 pl-2 transition-all duration-200 border-l-4 border-transparent group-hover:border-brand-primary group-hover:pl-5 hover:no-underline text-sm"
              >
                {item.label}
              </a>
              <Icon
                icon="solar:arrow-right-up-linear"
                width="22"
                className="opacity-70 group-hover:text-brand-primary"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const communitiesDropdownContent = (
    <div className="bg-white rounded-2xl shadow-2xl mt-3 p-8 flex gap-8 border border-gray-100 w-full">
      {/* Left column */}
      <div className="w-1/3 flex flex-col justify-between">
        <div>
          <div className="text-xl font-normal mb-2 font-primary">
            {communitiesDropdownData.leftTitle}
          </div>
          <div className="text-sm text-gray-600 mb-6 font-primary">
            {communitiesDropdownData.description}
          </div>
        </div>
        <Button
          text="Explore"
          type="primary"
          className="w-fit"
          link="/communities"
        />
      </div>
      {/* Middle column */}
      <div className="w-1/2">
        <div className="text-xl font-normal mb-2 font-primary">
          {communitiesDropdownData.middleTitle}
        </div>
        <ul className="space-y-2">
          {communitiesDropdownData.middleList.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0 group cursor-pointer hover:text-brand-primary transition"
            >
              <a
                href={item.slug}
                className="flex-1 pl-2 transition-all duration-200 border-l-4 border-transparent group-hover:border-brand-primary group-hover:pl-5 hover:no-underline text-sm"
              >
                {item.label}
              </a>
              <Icon
                icon="solar:arrow-right-up-linear"
                width="22"
                className="opacity-70 group-hover:text-brand-primary"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const eventsDropdownContent = (
    <div className="bg-white rounded-2xl shadow-2xl mt-3 p-8 flex gap-8 border border-gray-100 w-full">
      {/* Left column */}
      <div className="w-1/3 flex flex-col justify-between">
        <div>
          <div className="text-xl font-normal mb-2 font-primary">
            {eventsDropdownData.leftTitle}
          </div>
          <div className="text-sm text-gray-600 mb-6 font-primary">
            {eventsDropdownData.description}
          </div>
          <Button
            text="Explore"
            type="primary"
            className="w-fit"
            link="/events"
          />
        </div>
      </div>
      {/* Middle column */}
      <div className="w-1/3">
        <div className="text-xl font-normal mb-2 font-primary">
          {eventsDropdownData.middleTitle}
        </div>
        <ul className="space-y-2">
          {eventsDropdownData.middleList.map((item, idx) => (
            <li
              key={item.label}
              className={`flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0 group cursor-pointer hover:text-brand-primary transition ${
                selectedEventMiddle === idx
                  ? "text-brand-primary font-semibold"
                  : ""
              }`}
              onMouseEnter={() => setSelectedEventMiddle(idx)}
              onClick={() => setSelectedEventMiddle(idx)}
            >
              <span className="flex-1 pl-2 transition-all duration-200 border-l-4 border-transparent group-hover:border-brand-primary group-hover:pl-5">
                {item.label}
              </span>
              <Icon
                icon="solar:arrow-right-up-linear"
                width="22"
                className="opacity-70 group-hover:text-brand-primary"
              />
            </li>
          ))}
        </ul>
      </div>
      {/* Right column */}
      <div className="w-1/3">
        <div className="text-xl font-normal mb-2 font-primary">
          {eventsDropdownData.rightTitle}
        </div>
        <ul className="space-y-2">
          {eventsRightLists[selectedEventMiddle].map((item, idx) => (
            <li
              key={item.label + idx}
              className="flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0 group cursor-pointer hover:text-brand-primary transition"
            >
              <a
                href={item.slug}
                className="flex-1 pl-2 transition-all duration-200 border-l-4 border-transparent group-hover:border-brand-primary group-hover:pl-5 hover:no-underline"
              >
                {item.label}
              </a>
              <Icon
                icon="solar:arrow-right-up-linear"
                width="22"
                className="opacity-70 group-hover:text-brand-primary"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-4 py-2 bg-white backdrop-blur-md rounded-full shadow-[0_4px_24px_0_rgba(0,0,0,0.12)] mx-auto w-6xl max-w-[1400px] gap-4">
      {/* Logo */}
      <div className="flex items-center">
        <div className="w-12 h-12 relative mr-4">
          <Image
            src="/logo.png"
            alt="xtrawrkx"
            fill
            className="rounded-full object-cover"
            priority
          />
        </div>
      </div>
      {/* Nav Links */}
      <ul className="flex items-center gap-6 flex-1 justify-center">
        {navbarLinks.map((link) => (
          <li key={link.label} className="static">
            <a
              href={link.href}
              data-dropdown-trigger={
                link.label === "Services"
                  ? "Services"
                  : link.label === "Communities"
                  ? "Communities"
                  : link.label === "Events"
                  ? "Events"
                  : undefined
              }
              className={
                "text-base font-primary font-medium text-brand-dark hover:text-brand-primary transition" +
                (link.hasDropdown ? " flex items-center gap-1" : "")
              }
              onClick={(e) => {
                if (
                  link.label === "Services" ||
                  link.label === "Communities" ||
                  link.label === "Events"
                ) {
                  e.preventDefault();
                  setOpenDropdown(
                    openDropdown === link.label ? null : link.label
                  );
                }
              }}
            >
              {link.label}
              {link.hasDropdown && (
                <Icon
                  icon="solar:alt-arrow-down-linear"
                  className={`transition-transform duration-200 ${
                    openDropdown === link.label ? "rotate-180" : ""
                  }`}
                  width="20"
                />
              )}
            </a>
            {/* Dropdown for Services */}
            {link.label === "Services" && (
              <Dropdown
                open={openDropdown === "Services"}
                onClose={() => setOpenDropdown(null)}
                className="absolute left-0 top-full z-50 w-full"
              >
                {servicesDropdownContent}
              </Dropdown>
            )}
            {/* Dropdown for Communities */}
            {link.label === "Communities" && (
              <Dropdown
                open={openDropdown === "Communities"}
                onClose={() => setOpenDropdown(null)}
                className="absolute left-0 top-full z-50 w-full"
              >
                {communitiesDropdownContent}
              </Dropdown>
            )}
            {/* Dropdown for Events */}
            {link.label === "Events" && (
              <Dropdown
                open={openDropdown === "Events"}
                onClose={() => setOpenDropdown(null)}
                className="absolute left-0 top-full z-50 w-full"
              >
                {eventsDropdownContent}
              </Dropdown>
            )}
          </li>
        ))}
      </ul>
      {/* CTA Button */}
      <div className="ml-4">
        <Button text="Book A Meet" type="primary" link="/contact-us" />
      </div>
    </nav>
  );
}
