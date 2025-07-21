"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "../common/Button";
import { navbarLinks } from "../../data/Navlinks";
import { Icon } from "@iconify/react";
import Dropdown from "../common/Dropdown";
import {
  servicesDropdownData,
  communitiesDropdownData,
  eventsDropdownData,
} from "../../data/Dropdown";
import { useBookMeetModal } from "../../hooks/useBookMeetModal";

// Component for the Book A Meet button
const BookConsultationButton = () => {
  const { openModal } = useBookMeetModal();

  return <Button text="Book Consultation" type="primary" onClick={openModal} />;
};

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // State for dynamic right column in events dropdown
  const [selectedEventMiddle, setSelectedEventMiddle] = useState(0);

  // Get events by category for dynamic right column
  const getEventsForCategory = (categoryIndex) => {
    const categories = Object.keys(eventsDropdownData.eventsByCategory);
    const selectedCategory = categories[categoryIndex];
    return eventsDropdownData.eventsByCategory[selectedCategory] || [];
  };

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
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 group cursor-pointer hover:text-brand-primary transition"
            >
              <Link
                href={item.slug}
                className="flex-1 pl-2 transition-all duration-200 border-l-4 border-transparent group-hover:border-brand-primary group-hover:pl-5 hover:no-underline"
              >
                <div className="block">
                  <span className="block text-sm font-medium">
                    {item.label}
                  </span>
                  <span className="text-xs text-gray-500 group-hover:text-brand-primary/70">
                    {item.category} • {item.subCompany}
                  </span>
                </div>
              </Link>
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
        <ul className="space-y-2 mb-6">
          {servicesDropdownData.rightList.map((item, idx) => (
            <li
              key={item.label + idx}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 group cursor-pointer hover:text-brand-primary transition"
            >
              <Link
                href={item.slug}
                className="flex-1 pl-2 transition-all duration-200 border-l-4 border-transparent group-hover:border-brand-primary group-hover:pl-5 hover:no-underline"
              >
                <div className="block">
                  <span className="block text-sm font-medium">
                    {item.label}
                  </span>
                  <span className="text-xs text-gray-500 group-hover:text-brand-primary/70">
                    {item.price} • {item.subtitle}
                  </span>
                </div>
              </Link>
              <Icon
                icon="solar:arrow-right-up-linear"
                width="22"
                className="opacity-70 group-hover:text-brand-primary"
              />
            </li>
          ))}
        </ul>
        <Button
          text="View All Modals"
          type="secondary"
          className="w-full"
          link="/modals"
        />
      </div>
    </div>
  );

  const communitiesDropdownContent = (
    <div className="bg-white rounded-2xl shadow-2xl mt-3 p-8 flex gap-8 border border-gray-100 w-full">
      {/* Left column */}
      <div className="w-1/4 flex flex-col">
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
      {/* Middle column - Enhanced community display */}
      <div className="w-1/2">
        <div className="text-xl font-normal mb-4 font-primary">
          {communitiesDropdownData.middleTitle}
        </div>
        <div className="space-y-3">
          {communitiesDropdownData.middleList.map((item) => {
            const isXEN = item.shortName === "XEN";
            const isXEVFIN = item.shortName === "XEV.FiN";
            const isXEVTG = item.shortName === "XEVTG";
            const isXDD = item.shortName === "xD&D";
            const borderColor = isXEN
              ? "group-hover:border-[#377ecc]"
              : isXEVFIN
              ? "group-hover:border-[#2d5a9e]"
              : isXEVTG
              ? "group-hover:border-green-500"
              : isXDD
              ? "group-hover:border-[#f5f37f]"
              : "group-hover:border-brand-primary";
            const textColor = isXEN
              ? "group-hover:text-[#377ecc]"
              : isXEVFIN
              ? "group-hover:text-[#2d5a9e]"
              : isXEVTG
              ? "group-hover:text-green-600"
              : isXDD
              ? "group-hover:text-[#d4d054]"
              : "group-hover:text-brand-primary";

            return (
              <div
                key={item.label}
                className="group cursor-pointer transition-all duration-200 hover:bg-gray-50 rounded-lg p-3 border border-transparent hover:border-gray-200"
              >
                <Link
                  href={item.slug}
                  className={`block hover:no-underline transition-all duration-200 border-l-4 border-transparent ${borderColor} pl-4 ${textColor}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Community Logo/Icon */}
                    <div
                      className={`flex-shrink-0 p-2 rounded-lg ${
                        isXEN
                          ? "bg-[#377ecc]/10"
                          : isXEVFIN
                          ? "bg-[#2d5a9e]/10"
                          : isXEVTG
                          ? "bg-green-500/10"
                          : isXDD
                          ? "bg-[#f5f37f]/20"
                          : "bg-gray-100"
                      } transition-colors group-hover:scale-105`}
                    >
                      {/* Community Logos */}
                      {isXEN ? (
                        <Image
                          src="/images/xen.png"
                          alt="XEN Logo"
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      ) : isXEVFIN ? (
                        <Image
                          src="/images/xevfin.png"
                          alt="XEV.FiN Logo"
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      ) : isXDD ? (
                        <Image
                          src="/images/xd&d.png"
                          alt="xD&D Logo"
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      ) : (
                        <Icon
                          icon={item.icon}
                          width="20"
                          className={`${
                            isXEVTG ? "text-green-600" : "text-gray-600"
                          } transition-colors`}
                        />
                      )}
                    </div>

                    {/* Community Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm group-hover:text-inherit">
                          {item.shortName}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            isXEN
                              ? "bg-[#377ecc]/10 text-[#377ecc]"
                              : isXEVFIN
                              ? "bg-[#2d5a9e]/10 text-[#2d5a9e]"
                              : isXEVTG
                              ? "bg-green-500/10 text-green-600"
                              : isXDD
                              ? "bg-[#f5f37f]/20 text-[#d4d054]"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.members}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-1 group-hover:text-inherit">
                        {item.category}
                      </div>
                      <div className="text-xs text-gray-600 group-hover:text-inherit truncate">
                        {item.primaryFeature}
                      </div>
                    </div>

                    {/* Arrow */}
                    <Icon
                      icon="solar:arrow-right-up-linear"
                      width="16"
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right column - Community Stats */}
      <div className="w-1/4">
        <div className="text-xl font-normal mb-4 font-primary">
          {communitiesDropdownData.rightTitle}
        </div>
        <div className="space-y-4">
          {communitiesDropdownData.rightList.map((stat, idx) => (
            <div key={stat.label} className="bg-gray-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-800 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-gray-600">{stat.subtitle}</div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button
            text="Join XEN (Free)"
            type="secondary"
            className="w-full text-sm border-[#377ecc] text-[#377ecc] hover:bg-[#377ecc] hover:text-white"
            link="/communities/xen"
          />
        </div>
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
              className={`flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 group cursor-pointer hover:text-brand-primary transition ${
                selectedEventMiddle === idx
                  ? "text-brand-primary font-semibold"
                  : ""
              }`}
              onMouseEnter={() => setSelectedEventMiddle(idx)}
              onClick={() => setSelectedEventMiddle(idx)}
            >
              <div className="flex-1 pl-2 transition-all duration-200 border-l-4 border-transparent group-hover:border-brand-primary group-hover:pl-5">
                <span className="block">{item.label}</span>
                <span className="text-xs text-gray-500 group-hover:text-brand-primary/70">
                  {item.count} event{item.count !== 1 ? "s" : ""}
                </span>
              </div>
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
          {getEventsForCategory(selectedEventMiddle).length > 0 ? (
            getEventsForCategory(selectedEventMiddle).map((item, idx) => (
              <li
                key={item.label + idx}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 group cursor-pointer hover:text-brand-primary transition"
              >
                <Link
                  href={item.slug}
                  className="flex-1 pl-2 transition-all duration-200 border-l-4 border-transparent group-hover:border-brand-primary group-hover:pl-5 hover:no-underline"
                >
                  <div className="block">
                    <span className="block text-sm font-medium">
                      {item.label}
                    </span>
                    <span className="text-xs text-gray-500 group-hover:text-brand-primary/70">
                      {item.date} • {item.location}
                    </span>
                  </div>
                </Link>
                <Icon
                  icon="solar:arrow-right-up-linear"
                  width="22"
                  className="opacity-70 group-hover:text-brand-primary"
                />
              </li>
            ))
          ) : (
            <li className="py-2 text-sm text-gray-500 italic">
              No events available in this category
            </li>
          )}
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
        <BookConsultationButton />
      </div>
    </nav>
  );
}
