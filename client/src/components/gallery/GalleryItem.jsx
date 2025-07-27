"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

const GalleryItem = ({ item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (date) => {
    // Handle both Date objects and date strings
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      events: "bg-blue-100 text-blue-800",
      communities: "bg-green-100 text-green-800",
      achievements: "bg-yellow-100 text-yellow-800",
      team: "bg-purple-100 text-purple-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  // Ensure we have a valid image URL
  const imageUrl =
    typeof item.image === "string" && item.image.trim() !== ""
      ? item.image
      : "/images/hero.png";

  return (
    <>
      {/* Gallery Item Card */}
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative h-96 overflow-hidden">
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-transparent bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <Icon
              icon="solar:eye-bold"
              width={40}
              className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${getCategoryColor(
                item.category
              )}`}
            >
              {item.category}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4 line-clamp-2">
            {item.title}
          </h3>
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {item.title}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Icon
                  icon="solar:close-circle-bold"
                  width={24}
                  className="text-gray-600"
                />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="relative h-64 md:h-96 min-w-[500px] mb-6 rounded-lg overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {formatDate(item.date)}
                  </span>
                </div>
                {item.description && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Description
                    </h4>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryItem;
