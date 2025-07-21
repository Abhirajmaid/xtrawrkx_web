import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function Button({
  text,
  type = "primary",
  className = "",
  link,
  onClick,
  disabled = false,
  ...props
}) {
  const baseClass =
    type === "primary"
      ? "btn-primary"
      : type === "secondary"
      ? "btn-secondary"
      : "";

  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  if (link && !disabled) {
    return (
      <Link
        href={link}
        className={`${baseClass} ${className} ${disabledClass}`}
        onClick={onClick}
        {...props}
      >
        {text}
        <span className="btn-icon">
          <Icon icon="solar:arrow-right-up-linear" width="18" height="18" />
        </span>
      </Link>
    );
  }

  return (
    <button
      className={`${baseClass} ${className} ${disabledClass}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {text}
      <span className="btn-icon">
        <Icon icon="solar:arrow-right-up-linear" width="18" height="18" />
      </span>
    </button>
  );
}
