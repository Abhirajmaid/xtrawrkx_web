import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function Button({
  text,
  type = "primary",
  className = "",
  link,
  onClick,
  ...props
}) {
  const baseClass =
    type === "primary"
      ? "btn-primary"
      : type === "secondary"
      ? "btn-secondary"
      : "";

  if (link) {
    return (
      <Link href={link} passHref legacyBehavior>
        <a className={`${baseClass} ${className}`} onClick={onClick} {...props}>
          {text}
          <span className="btn-icon">
            <Icon icon="solar:arrow-right-up-linear" width="18" height="18" />
          </span>
        </a>
      </Link>
    );
  }

  return (
    <button
      className={`${baseClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {text}
      <span className="btn-icon">
        <Icon icon="solar:arrow-right-up-linear" width="18" height="18" />
      </span>
    </button>
  );
}
