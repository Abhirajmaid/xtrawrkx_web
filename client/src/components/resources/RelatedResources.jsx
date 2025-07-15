import React from "react";
import Section from "../layout/Section";
import Container from "../layout/Container";
import SectionHeader from "../common/SectionHeader";
import ResourceCard from "./ResourceCard";
import Button from "../common/Button";
import { getRelatedResources } from "../../data/ResourcesData";

const RelatedResources = ({ currentResource, limit = 3 }) => {
  const relatedResources = getRelatedResources(currentResource, limit);

  if (relatedResources.length === 0) {
    return null;
  }

  return (
    <Section className="bg-gray-50 py-16">
      <Container>
        <SectionHeader
          title="Related Resources"
          label="You might also like"
          description="Explore more resources related to this topic"
          className="mb-12"
        />

        {/* Related Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} layout="grid" />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <Button text="View All Resources" type="primary" link="/resources" />
        </div>

        {/* Category Suggestions */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Looking for more resources in{" "}
            <span className="font-medium text-brand-primary">
              {currentResource.category}
            </span>
            ?
          </p>
          <Button
            text={`Browse ${currentResource.category} Resources`}
            type="secondary"
            link={`/resources?category=${currentResource.category}`}
          />
        </div>
      </Container>
    </Section>
  );
};

export default RelatedResources;
