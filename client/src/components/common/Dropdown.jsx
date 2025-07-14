"use client";
import React, { useRef, useEffect } from "react";

export default function Dropdown({
  open,
  onClose,
  trigger,
  children,
  className = "",
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest("[data-dropdown-trigger]")
      ) {
        onClose();
      }
    }
    function handleScroll() {
      onClose();
    }
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={dropdownRef} className={className}>
      {children}
    </div>
  );
}
