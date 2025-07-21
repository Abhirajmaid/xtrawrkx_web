"use client";
import React, { use } from "react";
import { notFound } from "next/navigation";
import Section from "../../../../src/components/layout/Section";
import Container from "../../../../src/components/layout/Container";
import Hero from "../../../../src/components/common/Hero";
import {
  RelatedResources,
  ResourceSidebar,
} from "../../../../src/components/resources";
import { Icon } from "@iconify/react";
import {
  getResourceBySlug,
  getRelatedResources,
} from "../../../../src/data/ResourcesData";

const SingleResourcePage = ({ params }) => {
  const { slug } = use(params);
  const resource = getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  const relatedResources = getRelatedResources(resource);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero
        title={resource.title}
        subtitle={resource.description}
        description={resource.excerpt}
        backgroundImage={resource.image}
        showButton={false}
      />

      {/* Resource Details */}
      <Section className="bg-white py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Resource Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                      resource.type
                    )}`}
                  >
                    <Icon
                      icon={getTypeIcon(resource.type)}
                      className="inline mr-1"
                      width={16}
                    />
                    {resource.type.charAt(0).toUpperCase() +
                      resource.type.slice(1)}
                  </span>
                  <span className="text-sm text-brand-primary font-medium">
                    {resource.category}
                  </span>
                  {resource.featured && (
                    <span className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-6">
                    <span className="flex items-center">
                      <Icon
                        icon="solar:user-bold"
                        width={16}
                        className="mr-1"
                      />
                      {resource.author}
                    </span>
                    <span className="flex items-center">
                      <Icon
                        icon="solar:calendar-bold"
                        width={16}
                        className="mr-1"
                      />
                      {resource.publishedDate}
                    </span>
                    <span className="flex items-center">
                      <Icon
                        icon="solar:clock-circle-bold"
                        width={16}
                        className="mr-1"
                      />
                      {resource.readTime}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-gray-600 pb-6 border-b border-gray-200">
                  <span className="flex items-center">
                    <Icon icon="solar:eye-bold" width={16} className="mr-1" />
                    {resource.views.toLocaleString()} views
                  </span>
                  {resource.downloads > 0 && (
                    <span className="flex items-center">
                      <Icon
                        icon="solar:download-bold"
                        width={16}
                        className="mr-1"
                      />
                      {resource.downloads.toLocaleString()} downloads
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: resource.content }} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ResourceSidebar resource={resource} />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Related Resources */}
      <RelatedResources currentResource={resource} />
    </div>
  );
};

export default SingleResourcePage;
