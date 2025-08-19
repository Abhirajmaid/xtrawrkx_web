"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Section from "@/src/components/layout/Section";
import Container from "@/src/components/layout/Container";
import { eventRegistrationService } from "@/src/services/databaseService";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [viewMode, setViewMode] = useState("expanded"); // "expanded" or "compact"

  // Load registrations on component mount
  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const registrationsData =
        await eventRegistrationService.getRegistrations();
      setRegistrations(registrationsData);
      setError(null);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error loading registrations:", error);
      setError("Failed to load registrations. Please try again later.");
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Filter and sort registrations
  const filteredRegistrations = registrations
    .filter((registration) => {
      // Filter by registration type
      const matchesType =
        filterType === "All" ||
        (filterType === "event" &&
          registration.registrationType !== "season") ||
        (filterType === "season" && registration.registrationType === "season");

      // Filter by search term
      const matchesSearch =
        registration.companyName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        registration.primaryContactName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        registration.eventTitle
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        registration.season?.toString().includes(searchTerm);

      // Filter by status
      const matchesStatus =
        filterStatus === "All" || registration.status === filterStatus;

      return matchesType && matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "createdAt":
          aValue = new Date(a.createdAt || a.registrationDate);
          bValue = new Date(b.createdAt || b.registrationDate);
          break;
        case "companyName":
          aValue = (a.companyName || "").toLowerCase();
          bValue = (b.companyName || "").toLowerCase();
          break;
        case "eventTitle":
          aValue = (a.eventTitle || "").toLowerCase();
          bValue = (b.eventTitle || "").toLowerCase();
          break;
        case "status":
          aValue = (a.status || "").toLowerCase();
          bValue = (b.status || "").toLowerCase();
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Get registration statistics
  const getRegistrationStats = () => {
    const total = registrations.length;
    const confirmed = registrations.filter(
      (r) => r.status === "confirmed"
    ).length;
    const pending = registrations.filter((r) => r.status === "pending").length;
    const cancelled = registrations.filter(
      (r) => r.status === "cancelled"
    ).length;
    const eventRegistrations = registrations.filter(
      (r) => r.registrationType !== "season"
    ).length;
    const seasonRegistrations = registrations.filter(
      (r) => r.registrationType === "season"
    ).length;

    return {
      total,
      confirmed,
      pending,
      cancelled,
      eventRegistrations,
      seasonRegistrations,
    };
  };

  const stats = getRegistrationStats();

  // Export to CSV function
  const exportToCSV = (data) => {
    const headers = [
      "Company Name",
      "Company Email",
      "Company Phone",
      "Company Address",
      "Industry",
      "Company Size",
      "Company Community",
      "XEN Level",
      "Client Status",
      "Primary Contact Name",
      "Primary Contact Email",
      "Primary Contact Phone",
      "Primary Contact Designation",
      "Registration Type",
      "Season",
      "Event ID",
      "Event Title",
      "Event Date",
      "Event Location",
      "Selected Events Count",
      "Selected Events Details",
      "Total Attendees",
      "Ticket Type",
      "Personnel Details",
      "Total Cost",
      "Base Amount",
      "Discount Amount",
      "Savings",
      "Is Free",
      "Payment Status",
      "Registration Status",
      "Registration Date",
      "Last Updated",
      "Terms Accepted",
      "Privacy Accepted",
      "Special Requests",
      "Emergency Contact",
      "Emergency Phone",
      "LinkedIn URL",
      "Pitch Deck URL",
      "Attending Count",
      "Selected Event Count",
    ];

    const csvContent = [
      headers.join(","),
      ...data.map((registration) =>
        [
          `"${registration.companyName || "N/A"}"`,
          `"${registration.companyEmail || "N/A"}"`,
          `"${registration.companyPhone || "N/A"}"`,
          `"${registration.companyAddress || "N/A"}"`,
          `"${registration.industry || "N/A"}"`,
          `"${registration.companySize || "N/A"}"`,
          `"${registration.companyCommunity || "N/A"}"`,
          `"${registration.xenLevel || "N/A"}"`,
          `"${registration.clientStatus || "N/A"}"`,
          `"${registration.primaryContactName || "N/A"}"`,
          `"${registration.primaryContactEmail || "N/A"}"`,
          `"${registration.primaryContactPhone || "N/A"}"`,
          `"${registration.primaryContactDesignation || "N/A"}"`,
          `"${
            registration.registrationType === "season"
              ? "Season"
              : "Single Event"
          }"`,
          `"${registration.season || "N/A"}"`,
          `"${registration.eventId || "N/A"}"`,
          `"${registration.eventTitle || "N/A"}"`,
          `"${formatDate(registration.eventDate) || "N/A"}"`,
          `"${registration.eventLocation || "N/A"}"`,
          registration.selectedEventDetails
            ? registration.selectedEventDetails.length
            : 0,
          `"${
            registration.selectedEventDetails
              ? registration.selectedEventDetails.map((e) => e.title).join("; ")
              : "N/A"
          }"`,
          registration.personnel && registration.personnel.length > 0
            ? registration.personnel.filter((p) => p.isAttending).length
            : 1,
          `"${registration.ticketType === "gnp" ? "GNP" : "ASP"}"`,
          `"${
            registration.personnel && registration.personnel.length > 0
              ? registration.personnel
                  .filter((p) => p.isAttending)
                  .map((p) => `${p.name}(${p.email})`)
                  .join("; ")
              : "N/A"
          }"`,
          registration.totalCost || 0,
          registration.baseAmount || "N/A",
          registration.discountAmount || 0,
          registration.savings || 0,
          registration.isFree ? "Yes" : "No",
          `"${registration.paymentStatus || "N/A"}"`,
          `"${registration.status || "N/A"}"`,
          `"${formatDate(
            registration.createdAt || registration.registrationDate
          )}"`,
          `"${formatDate(registration.updatedAt) || "N/A"}"`,
          registration.termsAccepted ? "Yes" : "No",
          registration.privacyAccepted ? "Yes" : "No",
          `"${registration.specialRequests || "N/A"}"`,
          `"${registration.emergencyContact || "N/A"}"`,
          `"${registration.emergencyPhone || "N/A"}"`,
          `"${registration.linkedinUrl || "N/A"}"`,
          `"${registration.pitchDeckUrl || "N/A"}"`,
          registration.attendingCount || "N/A",
          registration.selectedEventCount || "N/A",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `event_registrations_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get registration type badge color
  const getTypeBadgeColor = (type) => {
    if (type === "season") {
      return "bg-purple-100 text-purple-800";
    }
    return "bg-blue-100 text-blue-800";
  };

  if (loading) {
    return (
      <Section className="py-16">
        <Container>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading registrations...</p>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="py-16">
        <Container>
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">
              <Icon icon="mdi:alert-circle" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Registrations
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadRegistrations}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container className="py-24">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Event Registrations
            </h1>
            <button
              onClick={() => loadRegistrations(true)}
              disabled={refreshing}
              className={`p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-colors ${
                refreshing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Refresh registrations"
            >
              <Icon
                icon="mdi:refresh"
                className={`text-xl ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            View all event registrations and track participation across our
            events and seasons.
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icon
                  icon="mdi:account-group"
                  className="text-blue-600 text-2xl"
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Registrations
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Icon
                  icon="mdi:check-circle"
                  className="text-green-600 text-2xl"
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.confirmed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Icon icon="mdi:clock" className="text-yellow-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Icon
                  icon="mdi:calendar-multiple"
                  className="text-purple-600 text-2xl"
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Season Registrations
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.seasonRegistrations}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icon icon="mdi:calendar" className="text-blue-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Single Event
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.eventRegistrations}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <Icon icon="mdi:cancel" className="text-red-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.cancelled}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Icon
                  icon="mdi:magnify"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search companies, contacts, events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="All">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="All">All Types</option>
                <option value="event">Single Event</option>
                <option value="season">Season</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="createdAt">Registration Date</option>
                <option value="companyName">Company Name</option>
                <option value="eventTitle">Event Title</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          {/* Sort Order Toggle */}
          <div className="mt-4 flex items-center justify-end">
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Icon
                icon={
                  sortOrder === "asc"
                    ? "mdi:sort-ascending"
                    : "mdi:sort-descending"
                }
                className="text-lg"
              />
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </button>
          </div>
        </div>

        {/* Results Count, View Mode Toggle and Export */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredRegistrations.length} of {registrations.length}{" "}
            registrations
          </p>
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <button
                onClick={() =>
                  setViewMode(viewMode === "expanded" ? "compact" : "expanded")
                }
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <Icon
                  icon={
                    viewMode === "expanded" ? "mdi:view-list" : "mdi:view-grid"
                  }
                />
                {viewMode === "expanded" ? "Compact" : "Expanded"}
              </button>
            </div>

            {/* {filteredRegistrations.length > 0 && (
              <button
                onClick={() => exportToCSV(filteredRegistrations)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Icon icon="mdi:download" />
                Export CSV
              </button>
            )} */}
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Horizontal scroll indicator */}
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
            <p className="text-sm text-blue-700 flex items-center gap-2">
              <Icon icon="mdi:drag-horizontal" className="text-lg" />
              <span>Scroll horizontally to view all columns</span>
            </p>
          </div>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table
              className={`w-full divide-y divide-gray-200 table-fixed ${
                viewMode === "expanded" ? "min-w-[1800px]" : "min-w-[1200px]"
              }`}
            >
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="w-12 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      viewMode === "expanded" ? "w-80" : "w-60"
                    }`}
                  >
                    Company & Contact
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      viewMode === "expanded" ? "w-48" : "w-36"
                    }`}
                  >
                    Type / Season
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      viewMode === "expanded" ? "w-64" : "w-48"
                    }`}
                  >
                    Event Details
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      viewMode === "expanded" ? "w-56" : "w-44"
                    }`}
                  >
                    Attendees & Personnel
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      viewMode === "expanded" ? "w-48" : "w-36"
                    }`}
                  >
                    Financial Details
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      viewMode === "expanded" ? "w-52" : "w-40"
                    }`}
                  >
                    Status & Dates
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      viewMode === "expanded" ? "w-56" : "w-44"
                    }`}
                  >
                    Additional Info
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRegistrations.map((registration) => (
                  <React.Fragment key={registration.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-2 py-2">
                        <button
                          onClick={() => {
                            const newExpanded = new Set(expandedRows);
                            if (newExpanded.has(registration.id)) {
                              newExpanded.delete(registration.id);
                            } else {
                              newExpanded.add(registration.id);
                            }
                            setExpandedRows(newExpanded);
                          }}
                          className="text-gray-500 hover:text-primary p-1 rounded"
                          title={
                            expandedRows.has(registration.id)
                              ? "Collapse"
                              : "Expand"
                          }
                        >
                          <Icon
                            icon={
                              expandedRows.has(registration.id)
                                ? "mdi:chevron-up"
                                : "mdi:chevron-down"
                            }
                            className="text-lg"
                          />
                        </button>
                      </td>
                      {/* Company & Contact */}
                      <td
                        className={`px-4 py-4 ${
                          viewMode === "expanded" ? "w-80" : "w-60"
                        }`}
                      >
                        <div className="space-y-1 text-wrap break-words">
                          <div className="text-sm font-medium text-gray-900">
                            <strong>Company:</strong>{" "}
                            {registration.companyName || "N/A"}
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Contact:</strong>{" "}
                            {registration.primaryContactName || "N/A"}
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Email:</strong>{" "}
                            {registration.primaryContactEmail || "N/A"}
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Phone:</strong>{" "}
                            {registration.primaryContactPhone || "N/A"}
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Designation:</strong>{" "}
                            {registration.primaryContactDesignation || "N/A"}
                          </div>
                          {registration.companyEmail && (
                            <div className="text-sm text-gray-600">
                              <strong>Company Email:</strong>{" "}
                              {registration.companyEmail}
                            </div>
                          )}
                          {registration.companyPhone && (
                            <div className="text-sm text-gray-600">
                              <strong>Company Phone:</strong>{" "}
                              {registration.companyPhone}
                            </div>
                          )}
                          {registration.companyAddress && (
                            <div className="text-sm text-gray-600">
                              <strong>Address:</strong>{" "}
                              {registration.companyAddress}
                            </div>
                          )}
                          {registration.industry && (
                            <div className="text-sm text-gray-600">
                              <strong>Industry:</strong> {registration.industry}
                            </div>
                          )}
                          {registration.companySize && (
                            <div className="text-sm text-gray-600">
                              <strong>Size:</strong> {registration.companySize}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Type / Season */}
                      <td
                        className={`px-4 py-4 ${
                          viewMode === "expanded" ? "w-48" : "w-36"
                        }`}
                      >
                        <div className="space-y-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(
                              registration.registrationType
                            )}`}
                          >
                            {registration.registrationType === "season"
                              ? "Season"
                              : "Single Event"}
                          </span>
                          {registration.registrationType === "season" && (
                            <div className="text-sm text-gray-600">
                              <strong>Season:</strong> {registration.season}
                            </div>
                          )}
                          {registration.companyCommunity &&
                            registration.companyCommunity !== "none" && (
                              <div className="text-sm text-gray-600">
                                <strong>Community:</strong>{" "}
                                {registration.companyCommunity}
                              </div>
                            )}
                          {registration.xenLevel && (
                            <div className="text-sm text-gray-600">
                              <strong>XEN Level:</strong>{" "}
                              {registration.xenLevel}
                            </div>
                          )}
                          {registration.clientStatus &&
                            registration.clientStatus !== "none" && (
                              <div className="text-sm text-gray-600">
                                <strong>Client Status:</strong>{" "}
                                {registration.clientStatus}
                              </div>
                            )}
                        </div>
                      </td>

                      {/* Event Details */}
                      <td
                        className={`px-4 py-4 ${
                          viewMode === "expanded" ? "w-64" : "w-48"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            <strong>Event:</strong>{" "}
                            {registration.eventTitle ||
                              `Season ${registration.season} Events`}
                          </div>
                          {registration.eventId && (
                            <div className="text-sm text-gray-600">
                              <strong>Event ID:</strong> {registration.eventId}
                            </div>
                          )}
                          {registration.eventDate && (
                            <div className="text-sm text-gray-600">
                              <strong>Event Date:</strong>{" "}
                              {formatDate(registration.eventDate)}
                            </div>
                          )}
                          {registration.eventLocation && (
                            <div className="text-sm text-gray-600">
                              <strong>Location:</strong> 📍{" "}
                              {registration.eventLocation}
                            </div>
                          )}
                          {registration.registrationType === "season" &&
                            registration.selectedEventDetails && (
                              <div className="text-sm text-gray-600">
                                <strong>Selected Events:</strong>{" "}
                                {registration.selectedEventDetails.length}{" "}
                                event(s)
                              </div>
                            )}
                          {registration.registrationType === "season" &&
                            registration.selectedEventDetails && (
                              <div className="text-sm text-gray-500">
                                {registration.selectedEventDetails.map(
                                  (event, idx) => (
                                    <div key={idx} className="ml-2 text-xs">
                                      • {event.title} ({formatDate(event.date)})
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      </td>

                      {/* Attendees & Personnel */}
                      <td
                        className={`px-4 py-4 ${
                          viewMode === "expanded" ? "w-56" : "w-44"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="text-sm text-gray-900">
                            <strong>Total Attendees:</strong>{" "}
                            {registration.personnel &&
                            registration.personnel.length > 0
                              ? registration.personnel.filter(
                                  (p) => p.isAttending
                                ).length
                              : 1}
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Ticket Type:</strong>{" "}
                            {registration.ticketType === "gnp" ? "GNP" : "ASP"}
                          </div>
                          {registration.personnel &&
                            registration.personnel.length > 0 && (
                              <div className="text-sm text-gray-600">
                                <strong>Personnel Details:</strong>
                                <div className="mt-1 space-y-1">
                                  {registration.personnel
                                    .filter((p) => p.isAttending)
                                    .slice(0, 2)
                                    .map((person, idx) => (
                                      <div
                                        key={idx}
                                        className="ml-2 text-xs bg-gray-50 p-1 rounded"
                                      >
                                        • {person.name} ({person.email}) -{" "}
                                        {person.designation || "N/A"}
                                        {person.dietaryRequirements &&
                                          person.dietaryRequirements !==
                                            "No restrictions" && (
                                            <span className="text-orange-600">
                                              {" "}
                                              - 🍽️ {person.dietaryRequirements}
                                            </span>
                                          )}
                                      </div>
                                    ))}
                                  {registration.personnel.filter(
                                    (p) => p.isAttending
                                  ).length > 2 && (
                                    <div className="ml-2 text-xs text-blue-600">
                                      +
                                      {registration.personnel.filter(
                                        (p) => p.isAttending
                                      ).length - 2}{" "}
                                      more...
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </td>

                      {/* Financial Details */}
                      <td
                        className={`px-4 py-4 ${
                          viewMode === "expanded" ? "w-48" : "w-36"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900">
                            <strong>Total Cost:</strong> ₹
                            {(registration.totalCost || 0).toLocaleString()}
                          </div>
                          {registration.baseAmount && (
                            <div className="text-sm text-gray-600">
                              <strong>Base Amount:</strong> ₹
                              {registration.baseAmount.toLocaleString()}
                            </div>
                          )}
                          {registration.discountAmount &&
                            registration.discountAmount > 0 && (
                              <div className="text-sm text-green-600">
                                <strong>Discount:</strong> ₹
                                {registration.discountAmount.toLocaleString()}
                              </div>
                            )}
                          {registration.savings && registration.savings > 0 && (
                            <div className="text-sm text-green-600">
                              <strong>Savings:</strong> ₹
                              {registration.savings.toLocaleString()}
                            </div>
                          )}
                          {registration.isFree && (
                            <div className="text-sm text-green-600 font-medium">
                              🎉 Free Registration
                            </div>
                          )}
                          {registration.paymentStatus && (
                            <div className="text-sm text-gray-600">
                              <strong>Payment:</strong>{" "}
                              {registration.paymentStatus}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status & Dates */}
                      <td
                        className={`px-4 py-4 ${
                          viewMode === "expanded" ? "w-52" : "w-40"
                        }`}
                      >
                        <div className="space-y-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                              registration.status
                            )}`}
                          >
                            <strong>Status:</strong>{" "}
                            {registration.status || "N/A"}
                          </span>
                          <div className="text-sm text-gray-600">
                            <strong>Registration Date:</strong>{" "}
                            {formatDate(
                              registration.createdAt ||
                                registration.registrationDate
                            )}
                          </div>
                          {registration.updatedAt && (
                            <div className="text-sm text-gray-600">
                              <strong>Last Updated:</strong>{" "}
                              {formatDate(registration.updatedAt)}
                            </div>
                          )}
                          {registration.termsAccepted && (
                            <div className="text-sm text-green-600">
                              ✓ Terms Accepted
                            </div>
                          )}
                          {registration.privacyAccepted && (
                            <div className="text-sm text-green-600">
                              ✓ Privacy Accepted
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Additional Info */}
                      <td
                        className={`px-4 py-4 ${
                          viewMode === "expanded" ? "w-56" : "w-44"
                        }`}
                      >
                        <div className="space-y-1">
                          {registration.specialRequests && (
                            <div className="text-sm text-gray-600">
                              <strong>Special Requests:</strong>{" "}
                              {registration.specialRequests}
                            </div>
                          )}
                          {registration.emergencyContact && (
                            <div className="text-sm text-gray-600">
                              <strong>Emergency Contact:</strong>{" "}
                              {registration.emergencyContact}
                            </div>
                          )}
                          {registration.emergencyPhone && (
                            <div className="text-sm text-gray-600">
                              <strong>Emergency Phone:</strong>{" "}
                              {registration.emergencyPhone}
                            </div>
                          )}
                          {registration.linkedinUrl && (
                            <div className="text-sm text-gray-600">
                              <strong>LinkedIn:</strong>
                              <a
                                href={registration.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline ml-1"
                              >
                                View Profile
                              </a>
                            </div>
                          )}
                          {registration.pitchDeckUrl && (
                            <div className="text-sm text-gray-600">
                              <strong>Pitch Deck:</strong>
                              <a
                                href={registration.pitchDeckUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline ml-1"
                              >
                                Download
                              </a>
                            </div>
                          )}
                          {registration.attendingCount && (
                            <div className="text-sm text-gray-600">
                              <strong>Attending Count:</strong>{" "}
                              {registration.attendingCount}
                            </div>
                          )}
                          {registration.selectedEventCount && (
                            <div className="text-sm text-gray-600">
                              <strong>Event Count:</strong>{" "}
                              {registration.selectedEventCount}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Row */}
                    {expandedRows.has(registration.id) && (
                      <tr className="bg-gray-50">
                        <td colSpan="8" className="px-4 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Personnel Details */}
                            {registration.personnel &&
                              registration.personnel.length > 0 && (
                                <div className="bg-white p-4 rounded-lg border">
                                  <h4 className="font-medium text-gray-900 mb-3">
                                    Complete Personnel List
                                  </h4>
                                  <div className="space-y-2">
                                    {registration.personnel
                                      .filter((p) => p.isAttending)
                                      .map((person, idx) => (
                                        <div
                                          key={idx}
                                          className="text-sm bg-gray-50 p-2 rounded"
                                        >
                                          <div className="font-medium">
                                            {person.name}
                                          </div>
                                          <div className="text-gray-600">
                                            Email: {person.email}
                                          </div>
                                          <div className="text-gray-600">
                                            Phone: {person.phone || "N/A"}
                                          </div>
                                          <div className="text-gray-600">
                                            Designation:{" "}
                                            {person.designation || "N/A"}
                                          </div>
                                          {person.dietaryRequirements &&
                                            person.dietaryRequirements !==
                                              "No restrictions" && (
                                              <div className="text-orange-600">
                                                🍽️ {person.dietaryRequirements}
                                              </div>
                                            )}
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}

                            {/* Selected Events Details */}
                            {registration.registrationType === "season" &&
                              registration.selectedEventDetails && (
                                <div className="bg-white p-4 rounded-lg border">
                                  <h4 className="font-medium text-gray-900 mb-3">
                                    Selected Events
                                  </h4>
                                  <div className="space-y-2">
                                    {registration.selectedEventDetails.map(
                                      (event, idx) => (
                                        <div
                                          key={idx}
                                          className="text-sm bg-gray-50 p-2 rounded"
                                        >
                                          <div className="font-medium">
                                            {event.title}
                                          </div>
                                          <div className="text-gray-600">
                                            Date: {formatDate(event.date)}
                                          </div>
                                          <div className="text-gray-600">
                                            Location: {event.location || "N/A"}
                                          </div>
                                          <div className="text-gray-600">
                                            Slug: {event.slug}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                            {/* Additional Details */}
                            <div className="bg-white p-4 rounded-lg border">
                              <h4 className="font-medium text-gray-900 mb-3">
                                Additional Information
                              </h4>
                              <div className="space-y-2 text-sm">
                                {registration.specialRequests && (
                                  <div>
                                    <strong>Special Requests:</strong>{" "}
                                    {registration.specialRequests}
                                  </div>
                                )}
                                {registration.emergencyContact && (
                                  <div>
                                    <strong>Emergency Contact:</strong>{" "}
                                    {registration.emergencyContact}
                                  </div>
                                )}
                                {registration.emergencyPhone && (
                                  <div>
                                    <strong>Emergency Phone:</strong>{" "}
                                    {registration.emergencyPhone}
                                  </div>
                                )}
                                {registration.linkedinUrl && (
                                  <div>
                                    <strong>LinkedIn:</strong>
                                    <a
                                      href={registration.linkedinUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline ml-1"
                                    >
                                      View Profile
                                    </a>
                                  </div>
                                )}
                                {registration.pitchDeckUrl && (
                                  <div>
                                    <strong>Pitch Deck:</strong>
                                    <a
                                      href={registration.pitchDeckUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline ml-1"
                                    >
                                      Download
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredRegistrations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">
                <Icon icon="mdi:clipboard-text-outline" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No registrations found
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "All" || filterType !== "All"
                  ? "Try adjusting your search criteria or filters."
                  : "There are no registrations to display at the moment."}
              </p>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
