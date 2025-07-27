"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "../common/Button";
import { navbarLinks } from "../../data/Navlinks";
import { Icon } from "@iconify/react";
import Dropdown from "../common/Dropdown";
import {
  getServicesDropdownData,
  communitiesDropdownData,
  getEventsDropdownData,
} from "../../data/Dropdown";
import { useBookMeetModal } from "../../hooks/useBookMeetModal";

// Component for the Book A Meet button
const BookConsultationButton = () => {
  const { openModal } = useBookMeetModal();

  return <Button text="Book Consultation" type="primary" onClick={openModal} />;
};

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // State for dynamic dropdown data
  const [servicesDropdownData, setServicesDropdownData] = useState(null);
  const [eventsDropdownData, setEventsDropdownData] = useState(null);
  const [dropdownLoading, setDropdownLoading] = useState({
    services: false,
    events: false,
  });
  const [dropdownErrors, setDropdownErrors] = useState({
    services: null,
    events: null,
  });

  // State for dynamic right column in events dropdown
  const [selectedEventMiddle, setSelectedEventMiddle] = useState(0);

  // Fetch dropdown data when needed
  const fetchServicesDropdownData = async () => {
    if (servicesDropdownData) return; // Already loaded

    setDropdownLoading((prev) => ({ ...prev, services: true }));
    try {
      const data = await getServicesDropdownData();
      setServicesDropdownData(data);
      setDropdownErrors((prev) => ({ ...prev, services: null }));
    } catch (error) {
      console.error("Error loading services dropdown:", error);
      setDropdownErrors((prev) => ({ ...prev, services: error.message }));
    } finally {
      setDropdownLoading((prev) => ({ ...prev, services: false }));
    }
  };

  const fetchEventsDropdownData = async () => {
    if (eventsDropdownData) return; // Already loaded

    setDropdownLoading((prev) => ({ ...prev, events: true }));
    try {
      const data = await getEventsDropdownData();
      setEventsDropdownData(data);
      setDropdownErrors((prev) => ({ ...prev, events: null }));
    } catch (error) {
      console.error("Error loading events dropdown:", error);
      setDropdownErrors((prev) => ({ ...prev, events: error.message }));
    } finally {
      setDropdownLoading((prev) => ({ ...prev, events: false }));
    }
  };

  // Get events by category for dynamic right column
  const getEventsForCategory = (categoryIndex) => {
    if (!eventsDropdownData?.eventsByCategory) return [];
    const categories = Object.keys(eventsDropdownData.eventsByCategory);
    const selectedCategory = categories[categoryIndex];
    return eventsDropdownData.eventsByCategory[selectedCategory] || [];
  };

  // Handle dropdown opening with data fetching
  const handleDropdownOpen = (dropdownName) => {
    setOpenDropdown(dropdownName);

    // Fetch data when dropdown is opened
    if (dropdownName === "Services") {
      fetchServicesDropdownData();
    } else if (dropdownName === "Events") {
      fetchEventsDropdownData();
    }
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

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
        setOpenDropdown(null);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu and dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("nav")) {
        setIsMobileMenuOpen(false);
        setOpenDropdown(null);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  const servicesDropdownContent = (
    <div className="bg-white rounded-2xl shadow-2xl p-8 mt-3 flex gap-8 border border-gray-100 w-full">
      {/* Left column */}
      <div className="w-1/3 flex flex-col justify-between">
        <div>
          <div className="text-xl font-normal mb-2 font-primary">
            {servicesDropdownData?.leftTitle}
          </div>
          <div className="text-sm text-gray-600 mb-6 font-primary">
            {servicesDropdownData?.description}
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
          {servicesDropdownData?.middleTitle || "What we do"}
        </div>
        {dropdownLoading.services ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : dropdownErrors.services ? (
          <div className="text-red-500 text-sm py-4">
            Failed to load services
          </div>
        ) : (
          <ul className="space-y-2">
            {servicesDropdownData?.middleList?.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 group cursor-pointer hover:text-brand-primary transition"
              >
                <Link
                  href={item.slug}
                  className="flex-1 pl-2 transition-all duration-200 border-l-4 border-transparent group-hover:border-brand-primary group-hover:pl-5 hover:no-underline"
                  onClick={() => setOpenDropdown(null)}
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
            )) || []}
          </ul>
        )}
      </div>
      {/* Right column */}
      <div className="w-1/3">
        <div className="text-xl font-normal mb-2 font-primary">
          {servicesDropdownData?.rightTitle}
        </div>
        <ul className="space-y-2 mb-6">
          {servicesDropdownData?.rightList.map((item, idx) => (
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
                    {item.subtitle}
                  </span>
                  <span className="text-sm font-bold text-brand-primary block">
                    {item.price}
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
    </div>
  );

  const communitiesDropdownContent = (
    <div className="bg-white rounded-2xl shadow-2xl p-8 mt-3 flex gap-8 border border-gray-100 w-full">
      {/* Left column */}
      <div className="w-1/3 flex flex-col justify-between">
        <div>
          <div className="text-xl font-normal mb-2 font-primary">
            {communitiesDropdownData.leftTitle}
          </div>
          <div className="text-sm text-gray-600 mb-6 font-primary">
            {communitiesDropdownData.description}
          </div>
          <Button
            text="Join Communities"
            type="outline"
            className="w-full text-sm border-[#377ecc] text-[#377ecc] hover:bg-[#377ecc] hover:text-white"
            link="/communities/xen"
          />
        </div>
      </div>
      {/* Middle column */}
      <div className="w-1/3">
        <div className="text-xl font-normal mb-2 font-primary">
          {communitiesDropdownData.middleTitle}
        </div>
        <ul className="space-y-2">
          {communitiesDropdownData.middleList.map((item) => {
            const IconComponent = item.icon;
            return (
              <li
                key={item.label}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 group cursor-pointer hover:text-brand-primary transition"
              >
                <Link
                  href={item.slug}
                  className="flex items-center gap-3 flex-1 pl-2 transition-all duration-200 border-l-4 border-transparent group-hover:border-brand-primary group-hover:pl-5 hover:no-underline"
                >
                  <div
                    className={`p-2 rounded-lg w-10 h-10 flex items-center justify-center ${item.color}`}
                  >
                    <Icon
                      icon={IconComponent}
                      width="20"
                      className="text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="block text-sm font-medium">
                        {item.shortName}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item.members}+ members
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 group-hover:text-brand-primary/70 block mt-1">
                      {item.primaryFeature}
                    </span>
                  </div>
                </Link>
                <Icon
                  icon="solar:arrow-right-up-linear"
                  width="22"
                  className="opacity-70 group-hover:text-brand-primary"
                />
              </li>
            );
          })}
        </ul>
      </div>
      {/* Right column */}
      <div className="w-1/3">
        <div className="text-xl font-normal mb-2 font-primary">
          {communitiesDropdownData.rightTitle}
        </div>
        <ul className="space-y-2 mb-6">
          {communitiesDropdownData.rightList.map((stat, idx) => (
            <li
              key={stat.label + idx}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 group"
            >
              <div className="flex-1 pl-2">
                <div className="block">
                  <span className="block text-sm font-medium">
                    {stat.label}
                  </span>
                  <span className="text-xs text-gray-500">{stat.subtitle}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-brand-primary">
                  {stat.value}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <Button
          text="Join XEN"
          type="outline"
          className="w-full text-sm border-[#377ecc] text-[#377ecc] hover:bg-[#377ecc] hover:text-white"
          link="/communities/xen"
        />
      </div>
    </div>
  );

  const eventsDropdownContent = (
    <div className="bg-white rounded-2xl shadow-2xl mt-3 p-8 flex gap-8 border border-gray-100 w-full">
      {/* Left column */}
      <div className="w-1/3 flex flex-col justify-between">
        <div>
          <div className="text-xl font-normal mb-2 font-primary">
            {eventsDropdownData?.leftTitle}
          </div>
          <div className="text-sm text-gray-600 mb-6 font-primary">
            {eventsDropdownData?.description}
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
          {eventsDropdownData?.middleTitle || "Event Categories"}
        </div>
        {dropdownLoading.events ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : dropdownErrors.events ? (
          <div className="text-red-500 text-sm py-4">Failed to load events</div>
        ) : (
          <ul className="space-y-2">
            {eventsDropdownData?.middleList?.map((item, idx) => (
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
            )) || []}
          </ul>
        )}
      </div>
      {/* Right column */}
      <div className="w-1/3">
        <div className="text-xl font-normal mb-2 font-primary">
          {eventsDropdownData?.rightTitle || "Upcoming Events"}
        </div>
        {dropdownLoading.events ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : dropdownErrors.events ? (
          <div className="text-red-500 text-sm py-4">Failed to load events</div>
        ) : (
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
                    onClick={() => setOpenDropdown(null)}
                  >
                    <div className="block">
                      <span className="block text-sm font-medium">
                        {item.label}
                      </span>
                      <span className="text-xs text-gray-500 group-hover:text-brand-primary/70">
                        {item.date instanceof Date
                          ? item.date.toLocaleDateString()
                          : item.date}{" "}
                        • {item.location}
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
                {eventsDropdownData
                  ? "No events available in this category"
                  : "Loading events..."}
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );

  // Mobile dropdown content (simplified)
  const renderMobileDropdownContent = (type) => {
    switch (type) {
      case "Services":
        return (
          <div className="bg-white border-t border-gray-200 px-4 py-4">
            {dropdownLoading.services ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            ) : dropdownErrors.services ? (
              <div className="text-red-500 text-sm py-2">
                Failed to load services
              </div>
            ) : (
              <ul className="space-y-2">
                {servicesDropdownData?.middleList?.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.slug}
                      className="block py-2 text-sm text-gray-700 hover:text-brand-primary hover:bg-gray-50 rounded px-2"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setOpenDropdown(null);
                      }}
                    >
                      <div>{item.label}</div>
                      <div className="text-xs text-gray-500">
                        {item.category} • {item.subCompany}
                      </div>
                    </Link>
                  </li>
                )) || []}
              </ul>
            )}
          </div>
        );

      case "Communities":
        return (
          <div className="bg-white border-t border-gray-200 px-4 py-4">
            <ul className="space-y-2">
              {communitiesDropdownData.middleList.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.slug}
                    className="block py-2 text-sm text-gray-700 hover:text-brand-primary hover:bg-gray-50 rounded px-2"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    <div>{item.shortName}</div>
                    <div className="text-xs text-gray-500">
                      {item.members}+ members
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );

      case "Events":
        return (
          <div className="bg-white border-t border-gray-200 px-4 py-4">
            {dropdownLoading.events ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            ) : dropdownErrors.events ? (
              <div className="text-red-500 text-sm py-2">
                Failed to load events
              </div>
            ) : (
              <ul className="space-y-2">
                {eventsDropdownData?.middleList?.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.slug}
                      className="block py-2 text-sm text-gray-700 hover:text-brand-primary hover:bg-gray-50 rounded px-2"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setOpenDropdown(null);
                      }}
                    >
                      <div>{item.label}</div>
                      <div className="text-xs text-gray-500">
                        {item.count} events
                      </div>
                    </Link>
                  </li>
                )) || []}
              </ul>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden lg:flex items-center justify-between px-4 py-2 bg-white backdrop-blur-md rounded-full shadow-[0_4px_24px_0_rgba(0,0,0,0.12)] mx-auto w-6xl max-w-[1400px] gap-4">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-12 h-12 relative mr-4">
            <Image
              src="/logo_full.png"
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
                    handleDropdownOpen(
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

      {/* Mobile Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-white shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 relative mr-3">
              <Image
                src="/logo.png"
                alt="xtrawrkx"
                fill
                className="rounded-full object-cover"
                priority
              />
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <Icon
              icon={
                isMobileMenuOpen
                  ? "solar:close-square-linear"
                  : "solar:hamburger-menu-linear"
              }
              width="24"
              className="text-gray-700"
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white">
            {navbarLinks.map((link) => (
              <div key={link.label}>
                <div className="border-b border-gray-100">
                  {link.hasDropdown ? (
                    <button
                      onClick={() => {
                        const newDropdown =
                          openDropdown === link.label ? null : link.label;
                        setOpenDropdown(newDropdown);

                        // Fetch data when dropdown is opened
                        if (newDropdown === "Services") {
                          fetchServicesDropdownData();
                        } else if (newDropdown === "Events") {
                          fetchEventsDropdownData();
                        }
                      }}
                      className="w-full flex items-center justify-between px-4 py-4 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">{link.label}</span>
                      <Icon
                        icon="solar:alt-arrow-down-linear"
                        className={`transition-transform duration-200 ${
                          openDropdown === link.label ? "rotate-180" : ""
                        }`}
                        width="20"
                      />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="block px-4 py-4 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setOpenDropdown(null);
                      }}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>

                {/* Mobile Dropdown Content */}
                {link.hasDropdown && openDropdown === link.label && (
                  <div className="border-b border-gray-100">
                    {renderMobileDropdownContent(link.label)}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile CTA Button */}
            <div className="p-4 border-t border-gray-200">
              <BookConsultationButton />
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setOpenDropdown(null);
          }}
        />
      )}
    </>
  );
}
