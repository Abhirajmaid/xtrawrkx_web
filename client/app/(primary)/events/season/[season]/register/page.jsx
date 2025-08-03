"use client";
import React, { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import { Icon } from "@iconify/react";
import Section from "@/src/components/layout/Section";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/common/Button";
import {
  eventRegistrationService,
  EventService,
} from "@/src/services/databaseService";
import { formatEventDate } from "@/src/utils/dateUtils";

const communityOptions = [
  { id: "none", name: "Not a member", discount: 0, freeSlots: 0 },
  { id: "xen", name: "XEN Community", discount: 0, freeSlots: 1 },
  { id: "xev-fin", name: "XEV.FiN Community", discount: 10, freeSlots: 0 },
  { id: "xevtg", name: "XEVTG Community", discount: 5, freeSlots: 0 },
  { id: "xd-d", name: "xD&D Community", discount: 15, freeSlots: 0 },
];

const designations = [
  "CEO/Founder",
  "CTO/VP Technology",
  "VP/Director",
  "Manager",
  "Senior Executive",
  "Executive",
  "Engineer",
  "Analyst",
  "Consultant",
  "Other",
];

export default function SeasonRegistration({ params }) {
  const { season } = use(params);
  const searchParams = useSearchParams();
  const fromEvent = searchParams.get("from");

  const [seasonEvents, setSeasonEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const eventService = new EventService();

  const [formData, setFormData] = useState({
    // Season Information
    season: season,
    selectedEvents: [], // Array of event IDs user wants to attend

    // Company Information
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    industry: "",
    companySize: "",
    companyCommunity: "none",

    // Primary Contact
    primaryContactName: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    primaryContactDesignation: "",

    // Personnel
    personnel: [
      {
        name: "",
        email: "",
        phone: "",
        designation: "",
        isAttending: true,
      },
    ],

    // Additional Information
    specialRequests: "",
    emergencyContact: "",
    emergencyPhone: "",

    // Agreement
    termsAccepted: false,
    privacyAccepted: false,
  });

  // Fetch events for the season
  useEffect(() => {
    const fetchSeasonEvents = async () => {
      try {
        setLoading(true);
        console.log("Fetching events for season:", season);

        const events = await eventService.getUpcomingEventsBySeason(season);
        console.log("Fetched season events:", events);

        if (events.length === 0) {
          setError(`No upcoming events found for season ${season}`);
          setLoading(false);
          return;
        }

        setSeasonEvents(events);

        // If coming from a specific event, pre-select it
        if (fromEvent) {
          const fromEventData = events.find((e) => e.slug === fromEvent);
          if (fromEventData) {
            setFormData((prev) => ({
              ...prev,
              selectedEvents: [fromEventData.id],
            }));
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching season events:", err);
        setError("Failed to load season events");
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonEvents();
  }, [season, fromEvent]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear errors
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEventSelection = (eventId) => {
    setFormData((prev) => ({
      ...prev,
      selectedEvents: prev.selectedEvents.includes(eventId)
        ? prev.selectedEvents.filter((id) => id !== eventId)
        : [...prev.selectedEvents, eventId],
    }));
  };

  const addPersonnel = () => {
    setFormData((prev) => ({
      ...prev,
      personnel: [
        ...prev.personnel,
        {
          name: "",
          email: "",
          phone: "",
          designation: "",
          isAttending: true,
        },
      ],
    }));
  };

  const removePersonnel = (index) => {
    setFormData((prev) => ({
      ...prev,
      personnel: prev.personnel.filter((_, i) => i !== index),
    }));
  };

  const updatePersonnel = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      personnel: prev.personnel.map((person, i) =>
        i === index ? { ...person, [field]: value } : person
      ),
    }));
  };

  const calculatePricing = () => {
    const basePrice = 4000; // ₹4,000 per person per event
    let totalCost = 0;
    let freeSlots = 0;
    let discountAmount = 0;

    const attendingCount = formData.personnel.filter(
      (p) => p.isAttending
    ).length;
    const selectedEventCount = formData.selectedEvents.length;
    const companyCommunity = communityOptions.find(
      (c) => c.id === formData.companyCommunity
    );

    // Calculate total cost for all selected events
    const totalEventAttendances = attendingCount * selectedEventCount;

    // Apply company-level community benefits
    if (formData.companyCommunity === "xen" && attendingCount > 0) {
      // First person gets free entry to all selected events for XEN companies
      const freeEventAttendances = selectedEventCount;
      const paidEventAttendances = totalEventAttendances - freeEventAttendances;
      freeSlots = freeEventAttendances;
      totalCost = paidEventAttendances * basePrice;
    } else {
      // Apply company discount to all event attendances
      const discountedPrice = basePrice * (1 - companyCommunity.discount / 100);
      totalCost = totalEventAttendances * discountedPrice;

      if (companyCommunity.discount > 0) {
        discountAmount = totalEventAttendances * (basePrice - discountedPrice);
      }
    }

    return {
      attendingCount,
      selectedEventCount,
      totalEventAttendances,
      baseAmount: totalEventAttendances * basePrice,
      discountAmount,
      freeSlots,
      totalCost,
      savings: totalEventAttendances * basePrice - totalCost,
      companyCommunity: companyCommunity.name,
    };
  };

  const validateForm = () => {
    const newErrors = {};

    // Season validation
    if (formData.selectedEvents.length === 0) {
      newErrors.selectedEvents = "Please select at least one event to attend";
    }

    // Company validation
    if (!formData.companyName.trim())
      newErrors.companyName = "Company name is required";
    if (!formData.companyEmail.trim())
      newErrors.companyEmail = "Company email is required";
    if (!formData.companyPhone.trim())
      newErrors.companyPhone = "Company phone is required";

    // Primary contact validation
    if (!formData.primaryContactName.trim())
      newErrors.primaryContactName = "Primary contact name is required";
    if (!formData.primaryContactEmail.trim())
      newErrors.primaryContactEmail = "Primary contact email is required";
    if (!formData.primaryContactPhone.trim())
      newErrors.primaryContactPhone = "Primary contact phone is required";

    // Personnel validation
    formData.personnel.forEach((person, index) => {
      if (person.isAttending) {
        if (!person.name.trim())
          newErrors[`personnel_${index}_name`] = "Name is required";
        if (!person.email.trim())
          newErrors[`personnel_${index}_email`] = "Email is required";
        if (!person.phone.trim())
          newErrors[`personnel_${index}_phone`] = "Phone is required";
        if (!person.designation.trim())
          newErrors[`personnel_${index}_designation`] =
            "Designation is required";
      }
    });

    // Terms validation
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must accept the terms and conditions";
    if (!formData.privacyAccepted)
      newErrors.privacyAccepted = "You must accept the privacy policy";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please correct the errors in the form before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const pricing = calculatePricing();

      // Get selected event details
      const selectedEventDetails = seasonEvents.filter((event) =>
        formData.selectedEvents.includes(event.id)
      );

      // Prepare registration data for database
      const registrationData = {
        // Season Information
        season: season,
        registrationType: "season",
        selectedEvents: formData.selectedEvents,
        selectedEventDetails: selectedEventDetails.map((event) => ({
          id: event.id,
          title: event.title,
          date: event.date,
          location: event.location,
          slug: event.slug,
        })),

        // Company Information
        companyName: formData.companyName,
        companyEmail: formData.companyEmail,
        companyPhone: formData.companyPhone,
        companyAddress: formData.companyAddress,
        industry: formData.industry,
        companySize: formData.companySize,
        companyCommunity: formData.companyCommunity,

        // Primary Contact
        primaryContactName: formData.primaryContactName,
        primaryContactEmail: formData.primaryContactEmail,
        primaryContactPhone: formData.primaryContactPhone,
        primaryContactDesignation: formData.primaryContactDesignation,

        // Personnel List
        personnel: formData.personnel.filter((p) => p.isAttending),

        // Additional Information
        specialRequests: formData.specialRequests,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,

        // Pricing Information
        totalCost: pricing.totalCost,
        baseAmount: pricing.baseAmount,
        discountAmount: pricing.discountAmount,
        freeSlots: pricing.freeSlots,
        attendingCount: pricing.attendingCount,
        selectedEventCount: pricing.selectedEventCount,
        totalEventAttendances: pricing.totalEventAttendances,

        // Agreement
        termsAccepted: formData.termsAccepted,
        privacyAccepted: formData.privacyAccepted,

        // Registration Status
        status: "pending",
        paymentStatus: "pending",
      };

      // Save season registration to database
      const registrationId =
        await eventRegistrationService.createSeasonRegistration(
          registrationData
        );

      console.log("Season registration saved with ID:", registrationId);
      alert(
        `Season registration successful! Your company has been registered for Season ${season} events. Registration ID: ${registrationId}`
      );

      // Redirect to success page or events list
      window.location.href = "/events";
    } catch (error) {
      console.error("Error submitting season registration:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="mdi:loading"
            className="text-brand-primary mx-auto mb-4 animate-spin"
            width={64}
          />
          <h3 className="text-xl font-semibold text-gray-600">
            Loading season events...
          </h3>
        </div>
      </div>
    );
  }

  if (error || seasonEvents.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="mdi:alert-circle"
            className="text-red-500 mx-auto mb-4"
            width={64}
          />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {error || `No events found for Season ${season}`}
          </h3>
          <p className="text-gray-500 mb-4">
            No upcoming events are available for registration in this season.
          </p>
          <Button text="Back to Events" type="primary" link="/events" />
        </div>
      </div>
    );
  }

  const pricing = calculatePricing();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Section className="bg-white border-b">
        <Container>
          <div className="py-6 pt-[100px]">
            <div className="flex items-center space-x-3 mb-4">
              <Button
                text="← Back to Events"
                type="secondary"
                link="/events"
                className="text-sm"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Season {season} Registration
            </h1>
            <p className="text-gray-600 mb-4">
              Register once for the entire season and choose which events to
              attend
            </p>
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <Icon icon="mdi:calendar-range" width={20} />
                <span>Season {season}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon icon="mdi:calendar-multiple" width={16} />
                <span>{seasonEvents.length} events available</span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <form onSubmit={handleSubmit}>
        <Container className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Selection */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Icon
                    icon="mdi:calendar-multiple"
                    width={24}
                    className="mr-2 text-brand-primary"
                  />
                  Select Events to Attend
                </h2>

                {errors.selectedEvents && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {errors.selectedEvents}
                  </div>
                )}

                <div className="space-y-4">
                  {seasonEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`border rounded-xl p-4 cursor-pointer transition-all ${
                        formData.selectedEvents.includes(event.id)
                          ? "border-brand-primary bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleEventSelection(event.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          <input
                            type="checkbox"
                            checked={formData.selectedEvents.includes(event.id)}
                            onChange={() => handleEventSelection(event.id)}
                            className="w-5 h-5 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {event.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Icon icon="mdi:calendar" width={16} />
                              <span>
                                {formatEventDate(event.date) || event.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon icon="mdi:map-marker" width={16} />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon icon="mdi:tag" width={16} />
                              <span>{event.category}</span>
                            </div>
                          </div>
                          {event.description && (
                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Information */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Icon
                    icon="solar:buildings-2-bold"
                    width={24}
                    className="mr-2 text-brand-primary"
                  />
                  Company Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors ${
                        errors.companyName
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Your company name"
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  {/* Company Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Email *
                    </label>
                    <input
                      type="email"
                      name="companyEmail"
                      value={formData.companyEmail}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors ${
                        errors.companyEmail
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="company@example.com"
                    />
                    {errors.companyEmail && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.companyEmail}
                      </p>
                    )}
                  </div>

                  {/* Company Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Phone *
                    </label>
                    <input
                      type="tel"
                      name="companyPhone"
                      value={formData.companyPhone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors ${
                        errors.companyPhone
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.companyPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.companyPhone}
                      </p>
                    )}
                  </div>

                  {/* Community Membership */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Community Membership
                    </label>
                    <select
                      name="companyCommunity"
                      value={formData.companyCommunity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      {communityOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                          {option.discount > 0 &&
                            ` (${option.discount}% discount)`}
                          {option.freeSlots > 0 &&
                            ` (${option.freeSlots} free slot)`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Company Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Address
                    </label>
                    <textarea
                      name="companyAddress"
                      value={formData.companyAddress}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                      placeholder="Complete company address"
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      placeholder="e.g., Electric Vehicles, Technology"
                    />
                  </div>

                  {/* Company Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Size
                    </label>
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">Select company size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-1000">201-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Primary Contact */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Icon
                    icon="solar:user-bold"
                    width={24}
                    className="mr-2 text-brand-primary"
                  />
                  Primary Contact Person
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Primary Contact Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      name="primaryContactName"
                      value={formData.primaryContactName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors ${
                        errors.primaryContactName
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Primary contact name"
                    />
                    {errors.primaryContactName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.primaryContactName}
                      </p>
                    )}
                  </div>

                  {/* Primary Contact Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      name="primaryContactEmail"
                      value={formData.primaryContactEmail}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors ${
                        errors.primaryContactEmail
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="contact@company.com"
                    />
                    {errors.primaryContactEmail && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.primaryContactEmail}
                      </p>
                    )}
                  </div>

                  {/* Primary Contact Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="primaryContactPhone"
                      value={formData.primaryContactPhone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors ${
                        errors.primaryContactPhone
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.primaryContactPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.primaryContactPhone}
                      </p>
                    )}
                  </div>

                  {/* Primary Contact Designation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation
                    </label>
                    <select
                      name="primaryContactDesignation"
                      value={formData.primaryContactDesignation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">Select designation</option>
                      {designations.map((designation) => (
                        <option key={designation} value={designation}>
                          {designation}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Personnel Information */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Icon
                      icon="solar:users-group-two-rounded-bold"
                      width={24}
                      className="mr-2 text-brand-primary"
                    />
                    Team Members
                  </h2>
                  <Button
                    text="Add Person"
                    type="secondary"
                    onClick={addPersonnel}
                    className="text-sm"
                  />
                </div>

                <div className="space-y-6">
                  {formData.personnel.map((person, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">
                          Person {index + 1}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={person.isAttending}
                              onChange={(e) =>
                                updatePersonnel(
                                  index,
                                  "isAttending",
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                            />
                            <span className="text-sm text-gray-600">
                              Attending
                            </span>
                          </label>
                          {formData.personnel.length > 1 && (
                            <Button
                              text="Remove"
                              type="danger"
                              onClick={() => removePersonnel(index)}
                              className="text-xs"
                            />
                          )}
                        </div>
                      </div>

                      {person.isAttending && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Name *
                            </label>
                            <input
                              type="text"
                              value={person.name}
                              onChange={(e) =>
                                updatePersonnel(index, "name", e.target.value)
                              }
                              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors ${
                                errors[`personnel_${index}_name`]
                                  ? "border-red-300 bg-red-50"
                                  : "border-gray-300"
                              }`}
                              placeholder="Full name"
                            />
                            {errors[`personnel_${index}_name`] && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors[`personnel_${index}_name`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email *
                            </label>
                            <input
                              type="email"
                              value={person.email}
                              onChange={(e) =>
                                updatePersonnel(index, "email", e.target.value)
                              }
                              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors ${
                                errors[`personnel_${index}_email`]
                                  ? "border-red-300 bg-red-50"
                                  : "border-gray-300"
                              }`}
                              placeholder="Email address"
                            />
                            {errors[`personnel_${index}_email`] && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors[`personnel_${index}_email`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone *
                            </label>
                            <input
                              type="tel"
                              value={person.phone}
                              onChange={(e) =>
                                updatePersonnel(index, "phone", e.target.value)
                              }
                              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors ${
                                errors[`personnel_${index}_phone`]
                                  ? "border-red-300 bg-red-50"
                                  : "border-gray-300"
                              }`}
                              placeholder="Phone number"
                            />
                            {errors[`personnel_${index}_phone`] && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors[`personnel_${index}_phone`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Designation *
                            </label>
                            <select
                              value={person.designation}
                              onChange={(e) =>
                                updatePersonnel(
                                  index,
                                  "designation",
                                  e.target.value
                                )
                              }
                              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors ${
                                errors[`personnel_${index}_designation`]
                                  ? "border-red-300 bg-red-50"
                                  : "border-gray-300"
                              }`}
                            >
                              <option value="">Select designation</option>
                              {designations.map((designation) => (
                                <option key={designation} value={designation}>
                                  {designation}
                                </option>
                              ))}
                            </select>
                            {errors[`personnel_${index}_designation`] && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors[`personnel_${index}_designation`]}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Icon
                    icon="solar:info-circle-bold"
                    width={24}
                    className="mr-2 text-brand-primary"
                  />
                  Additional Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests / Dietary Requirements
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                      placeholder="Any special requirements or dietary restrictions..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        placeholder="Emergency contact person"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        placeholder="Emergency contact number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Icon
                    icon="solar:shield-check-bold"
                    width={24}
                    className="mr-2 text-brand-primary"
                  />
                  Agreement
                </h2>

                <div className="space-y-4">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className={`w-5 h-5 text-brand-primary border-gray-300 rounded focus:ring-brand-primary mt-1 ${
                        errors.termsAccepted ? "border-red-500" : ""
                      }`}
                    />
                    <span className="text-sm text-gray-700">
                      I accept the{" "}
                      <a
                        href="#"
                        className="text-brand-primary hover:underline"
                      >
                        Terms and Conditions
                      </a>{" "}
                      for season registration
                    </span>
                  </label>
                  {errors.termsAccepted && (
                    <p className="text-red-500 text-sm">
                      {errors.termsAccepted}
                    </p>
                  )}

                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="privacyAccepted"
                      checked={formData.privacyAccepted}
                      onChange={handleInputChange}
                      className={`w-5 h-5 text-brand-primary border-gray-300 rounded focus:ring-brand-primary mt-1 ${
                        errors.privacyAccepted ? "border-red-500" : ""
                      }`}
                    />
                    <span className="text-sm text-gray-700">
                      I accept the{" "}
                      <a
                        href="#"
                        className="text-brand-primary hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                  {errors.privacyAccepted && (
                    <p className="text-red-500 text-sm">
                      {errors.privacyAccepted}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Pricing Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Icon
                      icon="solar:calculator-bold"
                      width={20}
                      className="mr-2 text-brand-primary"
                    />
                    Registration Summary
                  </h3>

                  <div className="space-y-4">
                    {/* Season Info */}
                    <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          Season {season}
                        </span>
                        <span className="text-sm text-brand-primary font-semibold">
                          {seasonEvents.length} events
                        </span>
                      </div>
                    </div>

                    {/* Selected Events */}
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Selected Events:</span>
                        <span className="font-medium">
                          {pricing.selectedEventCount}
                        </span>
                      </div>
                    </div>

                    {/* Attending Count */}
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">People Attending:</span>
                        <span className="font-medium">
                          {pricing.attendingCount}
                        </span>
                      </div>
                    </div>

                    {/* Community */}
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Community:</span>
                        <span className="font-medium">
                          {pricing.companyCommunity}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      {/* Base Amount */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Base Amount:</span>
                        <span className="font-medium">
                          ₹{pricing.baseAmount.toLocaleString()}
                        </span>
                      </div>

                      {/* Discount */}
                      {pricing.discountAmount > 0 && (
                        <div className="flex items-center justify-between text-sm text-green-600">
                          <span>Discount:</span>
                          <span>
                            -₹{pricing.discountAmount.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {/* Free Slots */}
                      {pricing.freeSlots > 0 && (
                        <div className="flex items-center justify-between text-sm text-green-600">
                          <span>Free Slots:</span>
                          <span>{pricing.freeSlots} event entries</span>
                        </div>
                      )}

                      {/* Total */}
                      <div className="flex items-center justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                        <span>Total Amount:</span>
                        <span>₹{pricing.totalCost.toLocaleString()}</span>
                      </div>

                      {/* Savings */}
                      {pricing.savings > 0 && (
                        <div className="text-center text-sm text-green-600 mt-2">
                          You save ₹{pricing.savings.toLocaleString()}!
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      text={
                        isSubmitting ? "Processing..." : "Complete Registration"
                      }
                      type="primary"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full mt-6"
                    />

                    {/* Help Text */}
                    <div className="text-xs text-gray-500 text-center mt-4">
                      <p>* Prices are per person per event</p>
                      <p>* Payment will be processed after registration</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </form>
    </div>
  );
}
