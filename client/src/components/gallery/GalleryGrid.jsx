"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Section from "../layout/Section";
import Container from "../layout/Container";
import SectionHeader from "../common/SectionHeader";
import GalleryFilter from "./GalleryFilter";
import GalleryItem from "./GalleryItem";
import { galleryItems } from "../../data/GalleryData";

const GalleryGrid = () => {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Handle URL parameters for filtering
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (
      categoryParam &&
      ["events", "communities", "achievements", "team"].includes(categoryParam)
    ) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Filter gallery items based on selected category and search query
  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  return (
    <Section className="bg-white">
      <Container>
        <SectionHeader title="Our Gallery" label="Moments" className="mb-6" />

        <GalleryFilter
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchQuery}
          onClearFilters={handleClearFilters}
        />

        {/* Results Count */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-medium">{filteredItems.length}</span>{" "}
            of <span className="font-medium">{galleryItems.length}</span> items
          </p>
        </div>

        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <GalleryItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find any gallery items matching your current filters.
              Try adjusting your search criteria.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </Container>
    </Section>
  );
};

export default GalleryGrid;
