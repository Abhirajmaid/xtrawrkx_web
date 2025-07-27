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
import { resourceService } from "../../../src/services/databaseService";
import Hero from "@/src/components/common/Hero";

// Resource categories for filtering
const resourceCategories = [
  "All",
  "Finance",
  "Technology",
  "Manufacturing",
  "Market Analysis",
  "Sustainability",
  "Regulatory",
  "Investment",
];

// Resource types
const resourceTypes = [
  { value: "all", label: "All Resources" },
  { value: "whitepaper", label: "Whitepapers" },
  { value: "article", label: "Articles" },
  { value: "report", label: "Reports" },
];

// Separate component that uses useSearchParams
const ResourcesContent = () => {
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load resources from Firebase
  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true);
        const resourcesData = await resourceService.getResources();
        // Only show published resources on the public site
        const publishedResources = resourcesData.filter(
          (resource) => (resource.status || "published") === "published"
        );
        setResources(publishedResources);
        setError(null);
      } catch (error) {
        console.error("Error loading resources:", error);
        setError("Failed to load resources. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

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

  // Get featured resources
  const featuredResources = useMemo(() => {
    return resources.filter((resource) => resource.featured);
  }, [resources]);

  // Filter resources based on selected filters and search query
  const filteredResources = useMemo(() => {
    let filtered = resources;

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
          (resource.tags &&
            resource.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    }

    return filtered;
  }, [resources, selectedType, selectedCategory, searchQuery]);

  // Get resource counts by type for statistics
  const resourceStats = useMemo(() => {
    return {
      total: resources.length,
      whitepapers: resources.filter((r) => r.type === "whitepaper").length,
      articles: resources.filter((r) => r.type === "article").length,
      reports: resources.filter((r) => r.type === "report").length,
    };
  }, [resources]);

  const handleClearFilters = () => {
    setSelectedType("all");
    setSelectedCategory("All");
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Hero
          title="Resources"
          description="Discover insights, research, and expertise across whitepapers, articles, and reports"
        />
        <Section className="bg-white py-16">
          <Container>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 h-64 rounded-lg"
                  ></div>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Hero
          title="Resources"
          description="Discover insights, research, and expertise across whitepapers, articles, and reports"
        />
        <Section className="bg-white py-16">
          <Container>
            <div className="text-center py-12">
              <div className="text-red-500 text-xl font-semibold mb-4">
                {error}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  return (
    <>
      {/* Statistics Section */}
      <ResourcesStats resourceStats={resourceStats} />

      {/* Featured Resources Section */}
      {featuredResources.length > 0 && (
        <FeaturedResources featuredResources={featuredResources} />
      )}

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
            resourceTypes={resourceTypes}
            resourceCategories={resourceCategories}
          />

          {/* Resources Grid */}
          <ResourcesGrid
            resources={filteredResources}
            totalResources={resources.length}
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
