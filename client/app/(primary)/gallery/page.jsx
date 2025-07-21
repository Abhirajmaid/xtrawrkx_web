"use client";
import React, { Suspense } from "react";
import Hero from "@/src/components/common/Hero";
import GalleryGrid from "@/src/components/gallery/GalleryGrid";
import CTASection from "@/src/components/common/CTASection";

// Separate component that handles URL parameters
const GalleryContent = () => {
  return (
    <>
      <GalleryGrid />
      <CTASection />
    </>
  );
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero
        title="Gallery"
        description="Explore our collection of moments, achievements, and milestones that showcase the journey and impact of Xtrawrkx community."
      />
      <Suspense fallback={<div>Loading gallery...</div>}>
        <GalleryContent />
      </Suspense>
    </div>
  );
}
