import Image from "next/image";
import { Icon } from "@iconify/react";
import Button from "./Button";

export default function ServiceCard({
  name,
  image = "/images/hero.png",
  onFavorite,
  isFavorite,
  link,
  description,
  buttonText = "More Details",
}) {
  const handleCardClick = () => {
    if (link) {
      window.location.href = link;
    }
  };

  return (
    <div className="relative w-full h-[450px] bg-gray-200 rounded-2xl p-4 group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Background image - normal state */}
      <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
        <Image
          src={image}
          alt={`${name} service illustration`}
          fill
          className="object-cover opacity-80"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Background image - hover state (blurred) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Image
          src={image}
          alt={`${name} service illustration blurred`}
          fill
          className="object-cover filter blur-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Heart icon */}
      <button
        className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center cursor-pointer bg-white rounded-full z-999"
        onClick={(e) => {
          e.stopPropagation();
          onFavorite && onFavorite();
        }}
        aria-label={isFavorite ? "Unfavorite" : "Favorite"}
      >
        <Icon
          icon={isFavorite ? "solar:heart-bold" : "solar:heart-linear"}
          width={24}
          className={isFavorite ? "text-red-500" : "text-gray-700"}
        />
      </button>

      {/* Main content */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 flex flex-col justify-center items-center p-6 text-center">
        <h3 className="text-white text-2xl font-bold mb-4 drop-shadow-lg">
          {name}
        </h3>
        {description && (
          <p className="text-white/90 text-sm mb-6 line-clamp-3 drop-shadow">
            {description}
          </p>
        )}
        <Button
          text={buttonText}
          type="primary"
          size="sm"
          onClick={handleCardClick}
          className="mt-auto"
        />
      </div>
    </div>
  );
}
