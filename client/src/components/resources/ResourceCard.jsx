import React from "react";
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
          <img
            src={resource.image}
            alt={resource.title}
            className="w-full h-full object-cover"
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
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-brand-primary font-medium">
              {resource.category}
            </span>
            <span className="text-sm text-gray-500">{resource.readTime}</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
            {resource.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{resource.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Icon icon="solar:user-bold" width={16} className="mr-1" />
              {resource.author}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Icon icon="solar:eye-bold" width={16} className="mr-1" />
                {resource.views.toLocaleString()}
              </span>
              {resource.downloads > 0 && (
                <span className="flex items-center">
                  <Icon
                    icon="solar:download-bold"
                    width={16}
                    className="mr-1"
                  />
                  {resource.downloads.toLocaleString()}
                </span>
              )}
            </div>
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
        <img
          src={resource.image}
          alt={resource.title}
          className="w-full h-full object-cover"
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
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-brand-primary font-medium">
            {resource.category}
          </span>
          <span className="text-sm text-gray-500">{resource.readTime}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {resource.title}
        </h3>
        <p className="text-gray-600 mb-3 line-clamp-2">{resource.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <Icon icon="solar:user-bold" width={14} className="mr-1" />
            {resource.author}
          </span>
          <span>{resource.publishedDate}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center">
              <Icon icon="solar:eye-bold" width={14} className="mr-1" />
              {resource.views.toLocaleString()}
            </span>
            {resource.downloads > 0 && (
              <span className="flex items-center">
                <Icon icon="solar:download-bold" width={14} className="mr-1" />
                {resource.downloads.toLocaleString()}
              </span>
            )}
          </div>
          <Button
            text={resource.downloadUrl ? "Download" : "Read"}
            type="secondary"
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
  );
};

export default ResourceCard;
