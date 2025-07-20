"use client";
import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Section from "../../../src/components/layout/Section";
import Container from "../../../src/components/layout/Container";
import SectionHeader from "../../../src/components/common/SectionHeader";
import {
  ResourcesStats,
  FeaturedResources,
  ResourceFilter,
  ResourcesGrid,
} from "../../../src/components/resources";
import {
  resourcesData,
  getFeaturedResources,
  getResourcesByType,
  getResourcesByCategory,
} from "../../../src/data/ResourcesData";
import Hero from "@/src/components/common/Hero";

// Separate component that uses useSearchParams
const ResourcesContent = () => {
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Handle URL parameters for filtering
  useEffect(() => {
    const typeParam = searchParams.get("type");
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    if (typeParam && ["whitepaper", "article", "report"].includes(typeParam)) {
      setSelectedType(typeParam);
    }
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  const featuredResources = getFeaturedResources();

  // Filter resources based on selected filters and search query
  const filteredResources = useMemo(() => {
    let filtered = resourcesData;

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((resource) => resource.type === selectedType);
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (resource) => resource.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.author.toLowerCase().includes(query) ||
          resource.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [selectedType, selectedCategory, searchQuery]);

  // Get resource counts by type for statistics
  const resourceStats = {
    total: resourcesData.length,
    whitepapers: getResourcesByType("whitepaper").length,
    articles: getResourcesByType("article").length,
    reports: getResourcesByType("report").length,
  };

  const handleClearFilters = () => {
    setSelectedType("all");
    setSelectedCategory("All");
    setSearchQuery("");
  };

  return (
    <>
      {/* Statistics Section */}
      <ResourcesStats resourceStats={resourceStats} />

      {/* Featured Resources Section */}
      <FeaturedResources />

      {/* All Resources Section */}
      <Section className="bg-white py-16">
        <Container>
          <SectionHeader
            title="All Resources"
            label="Library"
            description="Browse our complete collection of resources"
            className="mb-12"
          />

          {/* Filters */}
          <ResourceFilter
            selectedType={selectedType}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onTypeChange={setSelectedType}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchQuery}
          />

          {/* Resources Grid */}
          <ResourcesGrid
            resources={filteredResources}
            totalResources={resourcesData.length}
            onClearFilters={handleClearFilters}
          />
        </Container>
      </Section>
    </>
  );
};

const ResourcesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero
        title="Resources"
        description="Discover insights, research, and expertise across whitepapers, articles, and reports"
      />

      <Suspense fallback={<div>Loading resources...</div>}>
        <ResourcesContent />
      </Suspense>
    </div>
  );
};

export default ResourcesPage;
