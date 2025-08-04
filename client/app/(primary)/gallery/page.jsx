"use client";
import React, { Suspense } from "react";
import Hero from "@/src/components/common/Hero";
import {
  GalleryStatsSection,
  FeaturedGallerySection,
  AllGallerySection,
} from "@/src/components/gallery";
import Marquee from "@/src/components/common/Marquee";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero
        title="Gallery"
        description="Explore our collection of moments, achievements, and milestones that showcase the journey and impact of Xtrawrkx community."
      />

      {/* Gallery Statistics Section */}
      <GalleryStatsSection />

      {/* Featured Gallery Section */}
      <FeaturedGallerySection />

      {/* All Gallery Section - Needs Suspense for useSearchParams */}
      <Suspense fallback={<div></div>}>
        <AllGallerySection />
      </Suspense>

      {/* Marquee */}
      <Marquee />
    </div>
  );
}
