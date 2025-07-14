import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { footerNavLinks, footerBottomLinks } from "../../data/Navlinks";

export default function Footer() {
  return (
    <footer className="w-full mt-16 pb-10">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-10 md:gap-0 justify-between items-start">
        {/* Columns */}
        <div className="flex flex-1 justify-between flex-wrap gap-8">
          {/* Logo */}
          <div className="mb-8 md:mb-0 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="xtrawrkx"
              width={72}
              height={72}
              className=""
              priority
            />
          </div>
          {/* Render columns from data */}
          {footerNavLinks.map((col) => (
            <div key={col.title}>
              <div className="font-bold mb-2 font-primary">{col.title}</div>
              <ul className="space-y-1 text-brand-dark font-primary">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* Divider */}
      <div className="border-t border-brand-gray w-[80%] mx-auto my-8" />
      {/* Bottom section */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Language */}
        <div className="flex items-center gap-2 text-brand-dark font-primary text-sm">
          <Icon icon="mdi:earth" width="18" />
          <span>IND</span>
          <Icon icon="mdi:chevron-down" width="18" />
        </div>
        {/* Links */}
        <div className="flex flex-wrap gap-6 text-brand-dark font-primary text-sm justify-center">
          {footerBottomLinks.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        {/* Socials */}
        <div className="flex gap-4">
          <a
            href="#"
            aria-label="LinkedIn"
            className="rounded-full bg-brand-dark hover:bg-brand-gray/40 transition-colors w-10 h-10 flex items-center justify-center"
          >
            <Icon icon="mdi:linkedin" width="24" className="text-white" />
          </a>
          <a
            href="#"
            aria-label="Facebook"
            className="rounded-full bg-brand-dark hover:bg-brand-gray/40 transition-colors w-10 h-10 flex items-center justify-center"
          >
            <Icon icon="mdi:facebook" width="24" className="text-white" />
          </a>
          <a
            href="#"
            aria-label="YouTube"
            className="rounded-full bg-brand-dark hover:bg-brand-gray/40 transition-colors w-10 h-10 flex items-center justify-center"
          >
            <Icon icon="mdi:youtube" width="24" className="text-white" />
          </a>
          <a
            href="#"
            aria-label="X"
            className="rounded-full bg-brand-dark hover:bg-brand-gray/40 transition-colors w-10 h-10 flex items-center justify-center"
          >
            <Icon icon="mdi:twitter" width="24" className="text-white" />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="rounded-full bg-brand-dark hover:bg-brand-gray/40 transition-colors w-10 h-10 flex items-center justify-center"
          >
            <Icon icon="mdi:instagram" width="24" className="text-white" />
          </a>
        </div>
      </div>
    </footer>
  );
}
