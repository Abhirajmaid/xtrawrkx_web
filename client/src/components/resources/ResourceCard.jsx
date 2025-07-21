import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Button from "../common/Button";

const ResourceCard = ({ resource, layout = "grid" }) => {
  resource.image = "/images/hero.jpg";

  const getTypeIcon = (type) => {
    switch (type) {
      case "whitepaper":
        return "solar:document-text-bold";
      case "article":
        return "solar:book-2-bold";
      case "report":
        return "solar:chart-square-bold";
      default:
        return "solar:document-bold";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "whitepaper":
        return "bg-blue-100 text-blue-800";
      case "article":
        return "bg-green-100 text-green-800";
      case "report":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (layout === "featured") {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48">
          <Image
            src={resource.image}
            alt={resource.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                resource.type
              )}`}
            >
              <Icon
                icon={getTypeIcon(resource.type)}
                className="inline mr-1"
                width={14}
              />
              {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
            </span>
          </div>
          {resource.featured && (
            <div className="absolute top-4 right-4">
              <span className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-3 py-1 rounded-full text-xs font-medium">
                Featured
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
              {resource.title}
            </h3>
          </div>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {resource.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {resource.publishedDate}
              </span>
              <Button
                text={resource.downloadUrl ? "Download" : "Read More"}
                type="primary"
                size="sm"
                link={
                  resource.downloadUrl
                    ? resource.downloadUrl
                    : `/resources/${resource.slug}`
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-40">
        <Image
          src={resource.image}
          alt={resource.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
              resource.type
            )}`}
          >
            <Icon
              icon={getTypeIcon(resource.type)}
              className="inline mr-1"
              width={12}
            />
            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
          </span>
        </div>
        {resource.featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-md font-semibold text-gray-900 mb-2 line-clamp-2">
          {resource.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {resource.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{resource.publishedDate}</span>
          <Button
            text={resource.downloadUrl ? "Download" : "Read More"}
            type="primary"
            size="xs"
            link={
              resource.downloadUrl
                ? resource.downloadUrl
                : `/resources/${resource.slug}`
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
