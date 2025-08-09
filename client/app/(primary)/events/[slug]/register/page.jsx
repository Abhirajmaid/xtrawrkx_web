"use client";
import React, { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { Icon } from "@iconify/react";
import Section from "@/src/components/layout/Section";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/common/Button";
import RegistrationSuccess from "@/src/components/common/RegistrationSuccess";
import { eventsData, getEventBySlug } from "@/src/data/EventsData";
import {
  eventRegistrationService,
  EventService,
} from "@/src/services/databaseService";
import { formatEventDate } from "@/src/utils/dateUtils";
import Script from "next/script";

const communityOptions = [
  { id: "none", name: "Not a member", discount: 0, freeSlots: 0 },
  { id: "xen", name: "XEN Community", discount: 0, freeSlots: 1 },
  { id: "xev-fin", name: "XEV.FiN Community", discount: 10, freeSlots: 0 },
  { id: "xevtg", name: "XEVTG Community", discount: 5, freeSlots: 0 },
  { id: "xd-d", name: "xD&D Community", discount: 15, freeSlots: 0 },
];

const ticketTypes = [
  {
    id: "gnp",
    name: "General Networking Pass (GNP)",
    price: 8000,
    description: "Access to networking sessions and general event activities",
  },
  {
    id: "asp",
    name: "Active Support Pass (ASP)",
    price: 60000,
    description:
      "Full access to all sessions, workshops, and premium networking opportunities",
  },
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

export default function CompanyEventRegistration({ params }) {
  const { slug } = use(params);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const eventService = new EventService();

  // Fetch event by slug from Firebase with fallback to static data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        console.log("Fetching event with slug:", slug);

        // Try Firebase first
        const fetchedEvent = await eventService.getEventBySlug(slug);
        console.log("Fetched event from Firebase:", fetchedEvent);

        if (fetchedEvent) {
          setEvent(fetchedEvent);
          setError(null);
        } else {
          console.log("Event not found in Firebase, trying static data");
          // Fallback to static data
          const staticEvent = getEventBySlug(slug);
          console.log("Fetched event from static data:", staticEvent);

          if (staticEvent) {
            setEvent(staticEvent);
            setError(null);
          } else {
            console.log("Event not found in static data either");
            setError("Event not found");
          }
        }
      } catch (err) {
        console.error(
          "Error fetching event from Firebase, trying static data:",
          err
        );

        // Fallback to static data on error
        try {
          const staticEvent = getEventBySlug(slug);
          if (staticEvent) {
            console.log("Using static data as fallback:", staticEvent);
            setEvent(staticEvent);
            setError(null);
          } else {
            setError("Event not found");
          }
        } catch (staticErr) {
          console.error("Error with static data fallback:", staticErr);
          setError("Failed to load event");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  const [formData, setFormData] = useState({
    // Company Information
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    industry: "",
    companySize: "",
    companyCommunity: "none", // Company-level community membership

    // Ticket Information
    ticketType: "gnp", // Default to General Networking Pass

    // Primary Contact
    primaryContactName: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    primaryContactDesignation: "",

    // Personnel List (for seasonal events, this represents attendees under the company ticket)
    personnel: [
      {
        id: 1,
        name: "",
        email: "",
        phone: "",
        designation: "",
        dietaryRequirements: "No restrictions",
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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [successData, setSuccessData] = useState(null);

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

  const handlePersonnelChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      personnel: prev.personnel.map((person, i) =>
        i === index ? { ...person, [field]: value } : person
      ),
    }));

    // Clear errors
    if (errors[`personnel_${index}_${field}`]) {
      setErrors((prev) => ({ ...prev, [`personnel_${index}_${field}`]: "" }));
    }
  };

  const addPersonnel = () => {
    const newId = Math.max(...formData.personnel.map((p) => p.id)) + 1;
    setFormData((prev) => ({
      ...prev,
      personnel: [
        ...prev.personnel,
        {
          id: newId,
          name: "",
          email: "",
          phone: "",
          designation: "",
          dietaryRequirements: "No restrictions",
          isAttending: true,
        },
      ],
    }));
  };

  const removePersonnel = (index) => {
    if (formData.personnel.length > 1) {
      setFormData((prev) => ({
        ...prev,
        personnel: prev.personnel.filter((_, i) => i !== index),
      }));
    }
  };

  const calculatePricing = () => {
    const selectedTicket = ticketTypes.find(
      (t) => t.id === formData.ticketType
    );
    const basePrice = selectedTicket ? selectedTicket.price : 8000; // Default to GNP price
    let totalCost = basePrice;
    let discountAmount = 0;
    let isFree = false;

    const attendingCount = formData.personnel.filter(
      (p) => p.isAttending
    ).length;
    const companyCommunity = communityOptions.find(
      (c) => c.id === formData.companyCommunity
    );

    // Apply company-level community benefits to the ticket
    if (formData.companyCommunity === "xen") {
      // XEN companies get the ticket for free
      isFree = true;
      totalCost = 0;
      discountAmount = basePrice;
    } else if (companyCommunity && companyCommunity.discount > 0) {
      // Apply company discount to the ticket price
      discountAmount = basePrice * (companyCommunity.discount / 100);
      totalCost = basePrice - discountAmount;
    }

    return {
      attendingCount,
      ticketType: selectedTicket
        ? selectedTicket.name
        : "General Networking Pass (GNP)",
      baseAmount: basePrice,
      discountAmount,
      totalCost,
      savings: basePrice - totalCost,
      companyCommunity: companyCommunity.name,
      isFree,
    };
  };

  const validateForm = () => {
    const newErrors = {};

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

  const processPayment = (registrationData, registrationId, pricing) => {
    return new Promise((resolve, reject) => {
      // Enhanced validation with ad blocker detection
      if (!window.Razorpay) {
        console.error(
          "Razorpay SDK not loaded - possible ad blocker interference"
        );
        reject(
          new Error(
            "🚫 Payment gateway blocked! This usually happens due to:\n\n" +
              "1. Ad Blocker (most common) - Please disable ad blocker for this site\n" +
              "2. Browser security settings - Try incognito/private mode\n" +
              "3. Network restrictions - Try different network/device\n\n" +
              "After fixing, please refresh the page and try again."
          )
        );
        return;
      }

      if (!razorpayLoaded) {
        console.error("Razorpay script not fully loaded");
        reject(
          new Error(
            "🔄 Payment gateway still loading. Please wait a moment and try again.\n\n" +
              "If this persists, try:\n" +
              "1. Refreshing the page\n" +
              "2. Checking your internet connection\n" +
              "3. Disabling ad blocker"
          )
        );
        return;
      }

      // Validate amount
      if (!pricing.totalCost || pricing.totalCost <= 0) {
        console.error("Invalid amount:", pricing.totalCost);
        reject(
          new Error("Invalid payment amount. Please refresh and try again.")
        );
        return;
      }

      // Validate registration ID
      if (!registrationId) {
        console.error("Registration ID missing");
        reject(new Error("Registration error. Please try again."));
        return;
      }

      const amountInPaise = Math.round(pricing.totalCost * 100);

      console.log("Processing payment:", {
        registrationId,
        amount: pricing.totalCost,
        amountInPaise,
        eventTitle: event.title,
      });

      const options = {
        key: "rzp_live_JB7S2UmHSR0kL5", // Live Razorpay API Key
        amount: amountInPaise, // Amount in paise (must be integer)
        currency: "INR",
        name: "XtraWrkx Events",
        description: `${event.title} - ${pricing.ticketType}`,
        order_id: `event_${registrationId}_${Date.now()}`, // You might want to create this via Razorpay Orders API
        handler: async function (response) {
          console.log("Payment successful:", response);
          try {
            // Update registration with payment details
            const updatedRegistrationData = {
              ...registrationData,
              paymentStatus: "completed",
              status: "confirmed",
              paymentId: response.razorpay_payment_id,
              paymentSignature: response.razorpay_signature,
              orderId: response.razorpay_order_id,
              paidAt: new Date().toISOString(),
            };

            // Update the registration in database
            await eventRegistrationService.updateRegistration(
              registrationId,
              updatedRegistrationData
            );

            resolve(response);
          } catch (error) {
            console.error("Error updating payment status:", error);
            reject(
              new Error(
                "Payment completed but failed to update registration. Please contact support with payment ID: " +
                  response.razorpay_payment_id
              )
            );
          }
        },
        prefill: {
          name: formData.primaryContactName || "",
          email: formData.primaryContactEmail || "",
          contact: formData.primaryContactPhone || "",
        },
        notes: {
          registrationId: registrationId,
          eventTitle: event.title,
          companyName: formData.companyName || "",
        },
        theme: {
          color: "#3B82F6", // Brand primary color
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal dismissed by user");
            reject(new Error("Payment cancelled by user"));
          },
          escape: true,
          backdropclose: false,
        },
      };

      try {
        const razorpay = new window.Razorpay(options);

        // Enhanced error handling for different failure types
        razorpay.on("payment.failed", function (response) {
          console.error("Payment failed:", response.error);
          const error = response.error;

          let errorMessage = "❌ Payment Failed\n\n";

          if (error.code === "BAD_REQUEST_ERROR") {
            errorMessage += "🚫 Bad Request Error - This usually indicates:\n";
            errorMessage += "• Ad blocker corrupting payment data\n";
            errorMessage += "• Browser security blocking requests\n";
            errorMessage += "• Network interference\n\n";
            errorMessage += "Please disable ad blocker and try again.";
          } else if (error.code === "GATEWAY_ERROR") {
            errorMessage +=
              "🏦 Bank/Gateway Issue - Please try a different payment method.";
          } else if (error.code === "NETWORK_ERROR") {
            errorMessage +=
              "🌐 Network Issue - Please check your internet connection and try again.";
          } else if (
            error.description &&
            error.description.includes("blocked")
          ) {
            errorMessage +=
              "🚫 Payment blocked - Please check with your bank or try a different card.";
          } else if (error.description && error.description.includes("400")) {
            errorMessage +=
              "🚫 Request Error (400) - This indicates ad blocker interference:\n";
            errorMessage += "• Please disable ad blocker for this website\n";
            errorMessage += "• Try incognito/private browsing mode\n";
            errorMessage += "• Clear browser cache and try again";
          } else {
            const desc =
              error.description || error.reason || "Unknown payment error";
            errorMessage += `Details: ${desc}`;

            // Check if it might be ad blocker related
            if (
              desc.includes("400") ||
              desc.includes("Bad Request") ||
              desc.includes("blocked")
            ) {
              errorMessage +=
                "\n\n💡 This looks like ad blocker interference. Please disable ad blocker and try again.";
            }
          }

          errorMessage +=
            "\n\nTip: Try incognito mode, disable ad blocker, or contact support if issue persists.";

          reject(new Error(errorMessage));
        });

        // Add network error detection
        const originalOpen = razorpay.open;
        razorpay.open = function () {
          try {
            return originalOpen.call(this);
          } catch (networkError) {
            console.error("Network error opening Razorpay:", networkError);
            reject(
              new Error(
                "🌐 Network Error: Unable to connect to payment gateway.\n\n" +
                  "This often happens due to:\n" +
                  "1. Ad blocker blocking payment scripts\n" +
                  "2. Poor internet connectivity\n" +
                  "3. Firewall/proxy restrictions\n\n" +
                  "Please disable ad blocker and try again."
              )
            );
          }
        };

        razorpay.open();
      } catch (error) {
        console.error("Error creating/opening Razorpay:", error);
        let errorMessage = "🚫 Failed to open payment gateway.\n\n";

        if (error.message && error.message.includes("blocked")) {
          errorMessage +=
            "This is typically caused by ad blockers or browser security settings.\n\n";
          errorMessage += "Please:\n";
          errorMessage += "1. Disable ad blocker for this website\n";
          errorMessage += "2. Try incognito/private browsing mode\n";
          errorMessage += "3. Check your internet connection";
        } else {
          errorMessage += "Error: " + error.message + "\n\n";
          errorMessage += "Please refresh the page and try again.";
        }

        reject(new Error(errorMessage));
      }
    });
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

      // Prepare registration data for database
      const registrationData = {
        // Event Information
        eventId: event.id || event.slug, // Use event ID if available, fallback to slug
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,

        // Company Information
        companyName: formData.companyName,
        companyEmail: formData.companyEmail,
        companyPhone: formData.companyPhone,
        companyAddress: formData.companyAddress,
        industry: formData.industry,
        companySize: formData.companySize,
        companyCommunity: formData.companyCommunity,

        // Ticket Information
        ticketType: formData.ticketType,
        ticketName: pricing.ticketType,

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
        isFree: pricing.isFree,
        attendingCount: pricing.attendingCount,

        // Agreement
        termsAccepted: formData.termsAccepted,
        privacyAccepted: formData.privacyAccepted,

        // Registration Status
        status: pricing.isFree ? "confirmed" : "pending", // Free registrations are confirmed immediately
        paymentStatus: pricing.isFree ? "completed" : "pending",
      };

      // Save registration to database
      const registrationId = await eventRegistrationService.createRegistration(
        registrationData
      );

      console.log("Registration saved with ID:", registrationId);

      // If it's a free registration, complete immediately
      if (pricing.isFree) {
        // Show success page for free registrations
        setSuccessData({
          registrationId,
          companyName: formData.companyName,
          eventTitle: event.title,
          ticketType: pricing.ticketType,
          totalCost: 0,
        });
        setShowSuccessPage(true);

        // Reset form after successful free registration
        setFormData({
          companyName: "",
          companyEmail: "",
          companyPhone: "",
          companyAddress: "",
          industry: "",
          companySize: "",
          companyCommunity: "none",
          ticketType: "gnp",
          primaryContactName: "",
          primaryContactEmail: "",
          primaryContactPhone: "",
          primaryContactDesignation: "",
          personnel: [
            {
              id: 1,
              name: "",
              email: "",
              phone: "",
              designation: "",
              dietaryRequirements: "No restrictions",
              isAttending: true,
            },
          ],
          specialRequests: "",
          emergencyContact: "",
          emergencyPhone: "",
          termsAccepted: false,
          privacyAccepted: false,
        });
      } else {
        // Process payment for paid registrations
        try {
          await processPayment(registrationData, registrationId, pricing);

          // Show success page for paid registrations
          setSuccessData({
            registrationId,
            companyName: formData.companyName,
            eventTitle: event.title,
            ticketType: pricing.ticketType,
            totalCost: pricing.totalCost,
          });
          setShowSuccessPage(true);

          // Reset form after successful paid registration
          setFormData({
            companyName: "",
            companyEmail: "",
            companyPhone: "",
            companyAddress: "",
            industry: "",
            companySize: "",
            companyCommunity: "none",
            ticketType: "gnp",
            primaryContactName: "",
            primaryContactEmail: "",
            primaryContactPhone: "",
            primaryContactDesignation: "",
            personnel: [
              {
                id: 1,
                name: "",
                email: "",
                phone: "",
                designation: "",
                dietaryRequirements: "No restrictions",
                isAttending: true,
              },
            ],
            specialRequests: "",
            emergencyContact: "",
            emergencyPhone: "",
            termsAccepted: false,
            privacyAccepted: false,
          });
        } catch (paymentError) {
          console.error("Payment error:", paymentError);

          if (paymentError.message === "Payment cancelled by user") {
            alert(
              "💳 Payment was cancelled. Your registration has been saved and you can complete the payment later.\n\nRegistration ID: " +
                registrationId +
                "\n\nYou can contact support to complete payment if needed."
            );
          } else if (paymentError.message.includes("Payment gateway")) {
            alert(
              "🔄 " +
                paymentError.message +
                "\n\nRegistration ID: " +
                registrationId +
                "\n\nPlease try again in a moment."
            );
          } else if (paymentError.message.includes("Payment failed:")) {
            alert(
              "❌ " +
                paymentError.message +
                "\n\nRegistration ID: " +
                registrationId +
                "\n\nPlease try a different payment method or contact support."
            );
          } else {
            alert(
              "⚠️ Payment could not be completed. Your registration has been saved.\n\nRegistration ID: " +
                registrationId +
                "\n\nError: " +
                paymentError.message +
                "\n\nPlease contact support for assistance."
            );
          }
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(
        "There was an error processing your registration. Please try again. If the problem persists, please contact support."
      );
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
            Loading event...
          </h3>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="mdi:alert-circle"
            className="text-red-500 mx-auto mb-4"
            width={64}
          />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {error || "Event not found"}
          </h3>
          <p className="text-gray-500 mb-4">
            The event you're looking for doesn't exist or registration is not
            available.
          </p>
          <Button text="Back to Events" type="primary" link="/events" />
        </div>
      </div>
    );
  }

  // Show success page if registration is complete
  if (showSuccessPage && successData) {
    return (
      <RegistrationSuccess
        registrationData={successData}
        onRedirect={() => (window.location.href = "/events")}
        redirectDelay={5000}
      />
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
                text="← Back to Event"
                type="secondary"
                link={`/events/${slug}`}
                className="text-sm"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Company Registration
            </h1>
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <Icon icon="solar:calendar-bold" width={20} />
                <span>{event.title}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon icon="solar:calendar-bold" width={16} />
                <span>{formatEventDate(event.date) || event.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon icon="solar:map-point-bold" width={16} />
                <span>{event.location}</span>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`w-full border-2 rounded-lg py-3 px-4 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors ${
                        errors.companyName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter company name"
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Email *
                    </label>
                    <input
                      type="email"
                      name="companyEmail"
                      value={formData.companyEmail}
                      onChange={handleInputChange}
                      className={`w-full border-2 rounded-lg py-3 px-4 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors ${
                        errors.companyEmail
                          ? "border-red-500"
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Phone *
                    </label>
                    <input
                      type="tel"
                      name="companyPhone"
                      value={formData.companyPhone}
                      onChange={handleInputChange}
                      className={`w-full border-2 rounded-lg py-3 px-4 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors ${
                        errors.companyPhone
                          ? "border-red-500"
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors"
                    >
                      <option value="">Select industry</option>
                      <option value="automotive">Automotive</option>
                      <option value="technology">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="energy">Energy</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="consulting">Consulting</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Size
                    </label>
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-1000">201-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Community Membership
                    </label>
                    <select
                      name="companyCommunity"
                      value={formData.companyCommunity}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors"
                    >
                      {communityOptions.map((community) => (
                        <option key={community.id} value={community.id}>
                          {community.name}
                          {community.freeSlots > 0 && " (Free for 1 person)"}
                          {community.discount > 0 &&
                            ` (${community.discount}% discount)`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Address
                    </label>
                    <textarea
                      name="companyAddress"
                      value={formData.companyAddress}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors resize-none"
                      placeholder="Enter company address"
                    />
                  </div>
                </div>
              </div>

              {/* Ticket Selection */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Icon
                    icon="solar:ticket-bold"
                    width={24}
                    className="mr-2 text-brand-primary"
                  />
                  Ticket Selection
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ticketTypes.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.ticketType === ticket.id
                          ? "border-brand-primary bg-brand-primary/5"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={() =>
                        handleInputChange({
                          target: { name: "ticketType", value: ticket.id },
                        })
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <input
                              type="radio"
                              name="ticketType"
                              value={ticket.id}
                              checked={formData.ticketType === ticket.id}
                              onChange={handleInputChange}
                              className="text-brand-primary"
                            />
                            <h3 className="font-semibold text-gray-900">
                              {ticket.name}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {ticket.description}
                          </p>
                          <div className="text-2xl font-bold text-brand-primary">
                            ₹{ticket.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="primaryContactName"
                      value={formData.primaryContactName}
                      onChange={handleInputChange}
                      className={`w-full border-2 rounded-lg py-3 px-4 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors ${
                        errors.primaryContactName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter full name"
                    />
                    {errors.primaryContactName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.primaryContactName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="primaryContactEmail"
                      value={formData.primaryContactEmail}
                      onChange={handleInputChange}
                      className={`w-full border-2 rounded-lg py-3 px-4 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors ${
                        errors.primaryContactEmail
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="contact@example.com"
                    />
                    {errors.primaryContactEmail && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.primaryContactEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="primaryContactPhone"
                      value={formData.primaryContactPhone}
                      onChange={handleInputChange}
                      className={`w-full border-2 rounded-lg py-3 px-4 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors ${
                        errors.primaryContactPhone
                          ? "border-red-500"
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation
                    </label>
                    <select
                      name="primaryContactDesignation"
                      value={formData.primaryContactDesignation}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors"
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

              {/* Personnel List */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Icon
                      icon="solar:users-group-rounded-bold"
                      width={24}
                      className="mr-2 text-brand-primary"
                    />
                    Event Attendees
                  </h2>
                  <Button
                    text="+ Add Person"
                    type="primary"
                    onClick={addPersonnel}
                    className="text-sm"
                  />
                </div>

                <div className="space-y-6">
                  {formData.personnel.map((person, index) => (
                    <div
                      key={person.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">
                          Attendee {index + 1}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={person.isAttending}
                              onChange={(e) =>
                                handlePersonnelChange(
                                  index,
                                  "isAttending",
                                  e.target.checked
                                )
                              }
                              className="rounded"
                            />
                            <span className="text-sm text-gray-600">
                              Attending
                            </span>
                          </label>
                          {formData.personnel.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePersonnel(index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Icon
                                icon="solar:trash-bin-minimalistic-bold"
                                width={16}
                              />
                            </button>
                          )}
                        </div>
                      </div>

                      {person.isAttending && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={person.name}
                              onChange={(e) =>
                                handlePersonnelChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors ${
                                errors[`personnel_${index}_name`]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter full name"
                            />
                            {errors[`personnel_${index}_name`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`personnel_${index}_name`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email *
                            </label>
                            <input
                              type="email"
                              value={person.email}
                              onChange={(e) =>
                                handlePersonnelChange(
                                  index,
                                  "email",
                                  e.target.value
                                )
                              }
                              className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors ${
                                errors[`personnel_${index}_email`]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="email@example.com"
                            />
                            {errors[`personnel_${index}_email`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`personnel_${index}_email`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone *
                            </label>
                            <input
                              type="tel"
                              value={person.phone}
                              onChange={(e) =>
                                handlePersonnelChange(
                                  index,
                                  "phone",
                                  e.target.value
                                )
                              }
                              className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors ${
                                errors[`personnel_${index}_phone`]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="+91 98765 43210"
                            />
                            {errors[`personnel_${index}_phone`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`personnel_${index}_phone`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Designation *
                            </label>
                            <select
                              value={person.designation}
                              onChange={(e) =>
                                handlePersonnelChange(
                                  index,
                                  "designation",
                                  e.target.value
                                )
                              }
                              className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors ${
                                errors[`personnel_${index}_designation`]
                                  ? "border-red-500"
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
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`personnel_${index}_designation`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Dietary Requirements
                            </label>
                            <select
                              value={person.dietaryRequirements}
                              onChange={(e) =>
                                handlePersonnelChange(
                                  index,
                                  "dietaryRequirements",
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors"
                            >
                              <option value="No restrictions">
                                No restrictions
                              </option>
                              <option value="Vegetarian">Vegetarian</option>
                              <option value="Vegan">Vegan</option>
                              <option value="Gluten-free">Gluten-free</option>
                              <option value="Halal">Halal</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div className="lg:col-span-1 flex items-center">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm">
                              <span className="text-blue-700 font-medium">
                                Company Benefit:{" "}
                                {formData.companyCommunity === "xen"
                                  ? "FREE Ticket"
                                  : formData.companyCommunity !== "none"
                                  ? `${
                                      communityOptions.find(
                                        (c) =>
                                          c.id === formData.companyCommunity
                                      )?.discount || 0
                                    }% OFF Ticket`
                                  : "No discount"}
                              </span>
                            </div>
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
                    icon="solar:document-text-bold"
                    width={24}
                    className="mr-2 text-brand-primary"
                  />
                  Additional Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests or Requirements
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors resize-none"
                      placeholder="Any special accommodation needs, accessibility requirements, or other requests..."
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
                        className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors"
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
                        className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-colors"
                        placeholder="+91 98765 43210"
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
                  Terms & Conditions
                </h2>

                <div className="space-y-4">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the{" "}
                      <a
                        href="/terms-of-service"
                        className="text-brand-primary hover:underline"
                      >
                        Terms and Conditions
                      </a>{" "}
                      for event registration and attendance *
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
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the{" "}
                      <a
                        href="/privacy-policy"
                        className="text-brand-primary hover:underline"
                      >
                        Privacy Policy
                      </a>{" "}
                      and consent to data processing *
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

            {/* Pricing Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Pricing Summary */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Icon
                      icon="solar:calculator-bold"
                      width={20}
                      className="mr-2 text-brand-primary"
                    />
                    Registration Summary
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Selected Ticket:</span>
                      <span className="font-medium text-right">
                        {pricing.ticketType}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Attendees:</span>
                      <span className="font-medium">
                        {pricing.attendingCount}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Base Amount:</span>
                      <span>₹{pricing.baseAmount.toLocaleString()}</span>
                    </div>

                    {pricing.isFree && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>XEN Member (Free Ticket):</span>
                        <span>-₹{pricing.baseAmount.toLocaleString()}</span>
                      </div>
                    )}

                    {pricing.discountAmount > 0 && !pricing.isFree && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>{pricing.companyCommunity} Discount:</span>
                        <span>-₹{pricing.discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount:</span>
                        <span className="text-brand-primary">
                          {pricing.isFree
                            ? "FREE"
                            : `₹${pricing.totalCost.toLocaleString()}`}
                        </span>
                      </div>

                      {pricing.savings > 0 && (
                        <div className="text-sm text-green-600 text-right">
                          You save ₹{pricing.savings.toLocaleString()}!
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Community Benefits */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Icon
                      icon="solar:users-group-rounded-bold"
                      width={20}
                      className="mr-2 text-blue-600"
                    />
                    Community Benefits
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Icon
                        icon="solar:check-circle-bold"
                        width={16}
                        className="text-green-500"
                      />
                      <span>XEN Companies: FREE ticket (any pass)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon
                        icon="solar:check-circle-bold"
                        width={16}
                        className="text-green-500"
                      />
                      <span>xD&D Companies: 15% discount on ticket price</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon
                        icon="solar:check-circle-bold"
                        width={16}
                        className="text-green-500"
                      />
                      <span>
                        XEV.FiN Companies: 10% discount on ticket price
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon
                        icon="solar:check-circle-bold"
                        width={16}
                        className="text-green-500"
                      />
                      <span>XEVTG Companies: 5% discount on ticket price</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  text={
                    isSubmitting
                      ? "Processing..."
                      : pricing.isFree
                      ? "Complete Registration (FREE)"
                      : `Complete Registration (₹${pricing.totalCost.toLocaleString()})`
                  }
                  type="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full text-center py-4"
                />
              </div>
            </div>
          </div>
        </Container>
      </form>

      {/* Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => console.error("Failed to load Razorpay SDK")}
      />
    </div>
  );
}
