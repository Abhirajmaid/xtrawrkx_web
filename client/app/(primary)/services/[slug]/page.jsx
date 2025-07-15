"use client";
import { notFound } from "next/navigation";
import Image from "next/image";
import Section from "@/src/components/layout/Section";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/common/Button";
import { Icon } from "@iconify/react";
import servicesData, { engagementModels } from "@/src/data/ServicesData";
import ServiceCard from "@/src/components/common/ServiceCard";

export default function ServicePage({ params }) {
  const { slug } = params;

  // Find the service by slug
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  // Get related services (same category or sub-company)
  const relatedServices = servicesData
    .filter(
      (s) =>
        s.slug !== slug &&
        (s.category === service.category || s.subCompany === service.subCompany)
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden p-0">
        {/* Background image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/hero_services.png"
            alt={service.name}
            fill
            className="object-cover object-center"
            priority
          />
          {/* Overlay for text readability */}
          {/* <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" /> */}
        </div>

        {/* Service Info Overlay */}
        <Container className="relative z-20 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
            <Icon icon="mdi:briefcase-variant" width={20} />
            {service.category}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            {service.name}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 drop-shadow">
            {service.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              text="Get Started"
              type="primary"
              className="bg-gradient-to-r from-brand-primary to-brand-secondary"
              link="/contact-us"
            />
            <Button
              text="Download Brochure"
              type="secondary"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
            />
          </div>
        </Container>
      </Section>

      {/* Service Details Section */}
      <Section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Service Overview */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Service Overview
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p className="text-lg leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Key Highlights */}
                  {service.highlights && service.highlights.length > 0 && (
                    <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl p-6 mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Key Highlights
                      </h3>
                      <ul className="space-y-3">
                        {service.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Icon
                              icon="mdi:check-circle"
                              className="text-brand-primary mt-0.5 flex-shrink-0"
                              width={20}
                            />
                            <span className="text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  {service.tags && service.tags.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Related Topics
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {service.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-brand-primary hover:text-white transition-colors cursor-pointer"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Case Studies */}
              {service.caseStudies && service.caseStudies.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Case Studies
                  </h2>
                  <div className="space-y-6">
                    {service.caseStudies.map((caseStudy, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                      >
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {caseStudy.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {caseStudy.summary}
                        </p>
                        {caseStudy.url && (
                          <Button
                            text="Read Full Case Study"
                            type="secondary"
                            link={caseStudy.url}
                            className="text-sm"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonials */}
              {service.testimonials && service.testimonials.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Client Testimonials
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {service.testimonials.map((testimonial, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl p-6"
                      >
                        <div className="flex items-start gap-4">
                          <Icon
                            icon="mdi:format-quote-close"
                            className="text-brand-primary flex-shrink-0 mt-1"
                            width={24}
                          />
                          <div>
                            <p className="text-gray-700 italic mb-4">
                              "{testimonial.quote}"
                            </p>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {testimonial.author}
                              </p>
                              <p className="text-sm text-gray-600">
                                {testimonial.company}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Partners */}
              {service.partners && service.partners.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Technology Partners
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {service.partners.map((partner, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-4 shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow"
                      >
                        <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-600">
                            {partner.name.charAt(0)}
                          </span>
                        </div>
                        <h3 className="font-medium text-gray-900 text-sm">
                          {partner.name}
                        </h3>
                        {partner.url && (
                          <a
                            href={partner.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-brand-primary hover:underline mt-1 block"
                          >
                            Visit Website
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Service Info Card */}
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl p-6 mb-8 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Service Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="mdi:tag"
                      className="text-brand-primary"
                      width={24}
                    />
                    <div>
                      <p className="font-medium text-gray-900">Category</p>
                      <p className="text-gray-600">{service.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Icon
                      icon="mdi:office-building"
                      className="text-brand-primary"
                      width={24}
                    />
                    <div>
                      <p className="font-medium text-gray-900">Delivered by</p>
                      <p className="text-gray-600">{service.subCompany}</p>
                    </div>
                  </div>

                  {service.featured && (
                    <div className="flex items-center gap-3">
                      <Icon
                        icon="mdi:star"
                        className="text-brand-primary"
                        width={24}
                      />
                      <div>
                        <p className="font-medium text-gray-900">Status</p>
                        <p className="text-gray-600">Featured Service</p>
                      </div>
                    </div>
                  )}

                  {service.updatedAt && (
                    <div className="flex items-center gap-3">
                      <Icon
                        icon="mdi:calendar-clock"
                        className="text-brand-primary"
                        width={24}
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          Last Updated
                        </p>
                        <p className="text-gray-600">
                          {new Date(service.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    text="Get Started"
                    type="primary"
                    className="w-full mb-3"
                    link="/contact-us"
                  />
                  <Button
                    text="Schedule Consultation"
                    type="secondary"
                    className="w-full"
                    link="/contact-us"
                  />
                </div>
              </div>

              {/* Engagement Models */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  How We Work
                </h3>
                <p className="text-gray-600 mb-4">
                  Choose the engagement model that fits your needs best.
                </p>
                <div className="space-y-3">
                  {engagementModels.map((model, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-3 hover:border-brand-primary transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-900">
                          {model.name}
                        </h4>
                        <span className="text-sm font-semibold text-brand-primary">
                          {model.price}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{model.subtitle}</p>
                    </div>
                  ))}
                </div>
                <Button
                  text="View All Models"
                  type="secondary"
                  link="/modals"
                  className="w-full mt-4"
                />
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Need Help?
                </h3>
                <p className="text-gray-600 mb-4">
                  Have questions about this service? Get in touch with our
                  experts.
                </p>
                <Button
                  text="Contact Us"
                  type="secondary"
                  link="/contact-us"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <Section className="py-20 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Related Services
              </h2>
              <p className="text-xl text-gray-600">
                Discover more services that might interest you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedServices.map((relatedService, index) => (
                <div
                  key={index}
                  className="group transform transition-all duration-300 hover:scale-105"
                >
                  <ServiceCard
                    name={relatedService.name}
                    image={relatedService.image}
                    description={relatedService.description}
                    link={`/services/${relatedService.slug}`}
                    isFavorite={relatedService.isFavorite}
                    onFavorite={() => {}}
                  />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </div>
  );
}
