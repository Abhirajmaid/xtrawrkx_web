"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import AdminLayout from "@/src/components/admin/AdminLayout";
import ProtectedRoute from "@/src/components/admin/ProtectedRoute";
import {
  eventService,
  eventRegistrationService,
} from "@/src/services/databaseService";
import { uploadImage } from "@/src/services/cloudinaryService";
import { formatDate } from "@/src/utils/dateUtils";
import Button from "@/src/components/common/Button";

export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [bulkSelection, setBulkSelection] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("events");
  const [selectedEventForRegistrations, setSelectedEventForRegistrations] =
    useState(null);

  const categories = [
    "All",
    "Summit",
    "Workshop",
    "Conference",
    "Competition",
    "Networking",
  ];
  const statusOptions = [
    "All",
    "upcoming",
    "ongoing",
    "completed",
    "cancelled",
  ];

  // Load events and registrations
  useEffect(() => {
    loadEvents();
    loadRegistrations();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await eventService.getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRegistrations = async () => {
    try {
      const registrationsData =
        await eventRegistrationService.getRegistrations();
      setRegistrations(registrationsData);
    } catch (error) {
      console.error("Error loading registrations:", error);
    }
  };

  // Filter and sort events
  const filteredEvents = events
    .filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "All" || event.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "category":
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case "capacity":
          aValue = parseInt(a.capacity) || 0;
          bValue = parseInt(b.capacity) || 0;
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

  // Get event statistics
  const getEventStats = () => {
    const total = events.length;
    const upcoming = events.filter((e) => e.status === "upcoming").length;
    const ongoing = events.filter((e) => e.status === "ongoing").length;
    const completed = events.filter((e) => e.status === "completed").length;
    const cancelled = events.filter((e) => e.status === "cancelled").length;
    const totalCapacity = events.reduce(
      (sum, e) => sum + (parseInt(e.capacity) || 0),
      0
    );
    const avgCapacity = total > 0 ? Math.round(totalCapacity / total) : 0;

    return {
      total,
      upcoming,
      ongoing,
      completed,
      cancelled,
      totalCapacity,
      avgCapacity,
    };
  };

  const stats = getEventStats();

  // Handle bulk selection
  const handleBulkSelect = (eventId) => {
    setBulkSelection((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    if (bulkSelection.length === filteredEvents.length) {
      setBulkSelection([]);
    } else {
      setBulkSelection(filteredEvents.map((e) => e.id));
    }
  };

  // Handle bulk actions
  const handleBulkDelete = async () => {
    if (
      confirm(`Are you sure you want to delete ${bulkSelection.length} events?`)
    ) {
      try {
        await Promise.all(bulkSelection.map((id) => eventService.delete(id)));
        setBulkSelection([]);
        loadEvents();
      } catch (error) {
        console.error("Error deleting events:", error);
      }
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    try {
      await Promise.all(
        bulkSelection.map((id) => {
          return eventService.updateEventStatus(id, newStatus);
        })
      );
      setBulkSelection([]);
      loadEvents();
    } catch (error) {
      console.error("Error updating event status:", error);
    }
  };

  // Handle individual event actions
  const handleDelete = async (eventId) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await eventService.delete(eventId);
        await loadEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setIsEditModalOpen(true);
  };

  const handleDuplicate = async (event) => {
    try {
      const duplicatedEvent = {
        ...event,
        title: `${event.title} (Copy)`,
        slug: `${event.slug}-copy`,
        id: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await eventService.createEvent(duplicatedEvent);
      loadEvents();
    } catch (error) {
      console.error("Error duplicating event:", error);
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Event Management
              </h1>
              <p className="text-gray-600">
                Manage your events, workshops, and conferences
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Button
                text="Add Event"
                type="primary"
                link="/admin/events/new"
                icon="mdi:plus"
                className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
              />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("events")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "events"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Events Management
                </button>
                <button
                  onClick={() => setActiveTab("registrations")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "registrations"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Event Registrations
                </button>
              </nav>
            </div>
          </div>

          {activeTab === "events" && (
            <>
              {/* Modern Statistics Dashboard */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Event Overview
                  </h3>
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                  {/* Total Events */}
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-4 translate-x-4"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                          <Icon
                            icon="mdi:calendar-multiple"
                            width={20}
                            className="text-primary"
                          />
                        </div>
                        <div className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                          Total
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 mb-1">
                          {stats.total}
                        </p>
                        <p className="text-sm text-gray-600">Events</p>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Events */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-100/50 rounded-full -translate-y-4 translate-x-4"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-green-100 rounded-xl">
                          <Icon
                            icon="mdi:calendar-clock"
                            width={20}
                            className="text-green-600"
                          />
                        </div>
                        <div className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                          Upcoming
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-700 mb-1">
                          {stats.upcoming}
                        </p>
                        <p className="text-sm text-green-600">Scheduled</p>
                      </div>
                    </div>
                  </div>

                  {/* Ongoing Events */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100/50 rounded-full -translate-y-4 translate-x-4"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-blue-100 rounded-xl">
                          <Icon
                            icon="mdi:calendar-today"
                            width={20}
                            className="text-blue-600"
                          />
                        </div>
                        <div className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full">
                          Live
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-700 mb-1">
                          {stats.ongoing}
                        </p>
                        <p className="text-sm text-blue-600">Active</p>
                      </div>
                    </div>
                  </div>

                  {/* Completed Events */}
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gray-100/50 rounded-full -translate-y-4 translate-x-4"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-gray-100 rounded-xl">
                          <Icon
                            icon="mdi:calendar-check"
                            width={20}
                            className="text-gray-600"
                          />
                        </div>
                        <div className="text-xs text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-full">
                          Done
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-700 mb-1">
                          {stats.completed}
                        </p>
                        <p className="text-sm text-gray-600">Finished</p>
                      </div>
                    </div>
                  </div>

                  {/* Cancelled Events */}
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-100/50 rounded-full -translate-y-4 translate-x-4"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-red-100 rounded-xl">
                          <Icon
                            icon="mdi:calendar-remove"
                            width={20}
                            className="text-red-600"
                          />
                        </div>
                        <div className="text-xs text-red-600 font-medium bg-red-100 px-2 py-1 rounded-full">
                          Cancelled
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-700 mb-1">
                          {stats.cancelled}
                        </p>
                        <p className="text-sm text-red-600">Cancelled</p>
                      </div>
                    </div>
                  </div>

                  {/* Total Capacity */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100/50 rounded-full -translate-y-4 translate-x-4"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-purple-100 rounded-xl">
                          <Icon
                            icon="mdi:account-group"
                            width={20}
                            className="text-purple-600"
                          />
                        </div>
                        <div className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full">
                          Capacity
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-700 mb-1">
                          {stats.totalCapacity.toLocaleString()}
                        </p>
                        <p className="text-sm text-purple-600">
                          Avg: {stats.avgCapacity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Insights */}
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Icon
                          icon="mdi:chart-line"
                          width={24}
                          className="text-primary"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Quick Insights
                        </h4>
                        <p className="text-sm text-gray-600">
                          {stats.upcoming > 0
                            ? `${stats.upcoming} upcoming events to manage`
                            : stats.ongoing > 0
                            ? `${stats.ongoing} events currently running`
                            : "No active events at the moment"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {stats.total > 0 && (
                        <div className="text-center">
                          <p className="text-lg font-bold text-primary">
                            {Math.round((stats.completed / stats.total) * 100)}%
                          </p>
                          <p className="text-xs text-gray-600">Success Rate</p>
                        </div>
                      )}

                      {stats.upcoming > 0 && (
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">
                            {stats.upcoming}
                          </p>
                          <p className="text-xs text-gray-600">Next Events</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters and Search */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Icon
                      icon="mdi:magnify"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      width={20}
                    />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  {/* Status Filter */}
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  {/* Sort */}
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split("-");
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="date-desc">Date (Newest)</option>
                    <option value="date-asc">Date (Oldest)</option>
                    <option value="title-asc">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                    <option value="category-asc">Category (A-Z)</option>
                    <option value="capacity-desc">Capacity (High-Low)</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-2 ${
                        viewMode === "grid"
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      <Icon icon="mdi:view-grid" width={20} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-2 ${
                        viewMode === "list"
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      <Icon icon="mdi:view-list" width={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bulk Actions */}
              {bulkSelection.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800 font-medium">
                      {bulkSelection.length} event
                      {bulkSelection.length > 1 ? "s" : ""} selected
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleBulkStatusUpdate("upcoming")}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        Mark Upcoming
                      </button>
                      <button
                        onClick={() => handleBulkStatusUpdate("completed")}
                        className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                      >
                        Mark Completed
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Delete Selected
                      </button>
                      <button
                        onClick={() => setBulkSelection([])}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Events Display */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Icon
                    icon="mdi:calendar-remove"
                    width={64}
                    className="text-gray-400 mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No events found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onDuplicate={handleDuplicate}
                      onSelect={handleBulkSelect}
                      selected={bulkSelection.includes(event.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left">
                            <input
                              type="checkbox"
                              checked={
                                bulkSelection.length === filteredEvents.length
                              }
                              onChange={handleSelectAll}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Event
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Capacity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEvents.map((event) => (
                          <EventRow
                            key={event.id}
                            event={event}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onDuplicate={handleDuplicate}
                            onSelect={handleBulkSelect}
                            selected={bulkSelection.includes(event.id)}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "registrations" && (
            <RegistrationManagement
              registrations={registrations}
              events={events}
              onLoadRegistrations={loadRegistrations}
              selectedEvent={selectedEventForRegistrations}
              onSelectEvent={setSelectedEventForRegistrations}
            />
          )}
        </div>

        {/* Create/Edit Modal */}
        {(isCreateModalOpen || isEditModalOpen) && (
          <EventModal
            isOpen={isCreateModalOpen || isEditModalOpen}
            onClose={() => {
              setIsCreateModalOpen(false);
              setIsEditModalOpen(false);
              setCurrentEvent(null);
            }}
            event={currentEvent}
            onSave={loadEvents}
          />
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}

// Registration Management Component
function RegistrationManagement({
  registrations,
  events,
  onLoadRegistrations,
  selectedEvent,
  onSelectEvent,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("registrationDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [bulkSelection, setBulkSelection] = useState([]);
  const [showRegistrationDetails, setShowRegistrationDetails] = useState(null);

  const filteredRegistrations = registrations.filter((registration) => {
    if (selectedEvent && registration.eventId !== selectedEvent) return false;

    const matchesSearch =
      registration.companyName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      registration.primaryContactName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      registration.primaryContactEmail
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      registration.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || registration.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getRegistrationStats = () => {
    const filtered = selectedEvent
      ? registrations.filter((r) => r.eventId === selectedEvent)
      : registrations;

    const total = filtered.length;
    const confirmed = filtered.filter((r) => r.status === "confirmed").length;
    const pending = filtered.filter((r) => r.status === "pending").length;
    const cancelled = filtered.filter((r) => r.status === "cancelled").length;
    const totalRevenue = filtered.reduce(
      (sum, r) => sum + (r.totalCost || 0),
      0
    );
    const totalAttendees = filtered.reduce(
      (sum, r) =>
        sum +
        (r.personnel ? r.personnel.filter((p) => p.isAttending).length : 1),
      0
    );
    const avgRevenuePerRegistration =
      total > 0 ? Math.round(totalRevenue / total) : 0;
    const conversionRate =
      total > 0 ? Math.round((confirmed / total) * 100) : 0;

    return {
      total,
      confirmed,
      pending,
      cancelled,
      totalRevenue,
      totalAttendees,
      avgRevenuePerRegistration,
      conversionRate,
    };
  };

  const stats = getRegistrationStats();

  const handleStatusUpdate = async (registrationId, newStatus) => {
    try {
      await eventRegistrationService.updateRegistrationStatus(
        registrationId,
        newStatus
      );
      onLoadRegistrations();
    } catch (error) {
      console.error("Error updating registration status:", error);
      alert("Error updating registration status");
    }
  };

  const handleDeleteRegistration = async (registrationId) => {
    if (confirm("Are you sure you want to delete this registration?")) {
      try {
        await eventRegistrationService.delete(
          "event_registrations",
          registrationId
        );
        onLoadRegistrations();
      } catch (error) {
        console.error("Error deleting registration:", error);
        alert("Error deleting registration");
      }
    }
  };

  const handleBulkRegistrationSelect = (registrationId) => {
    setBulkSelection((prev) =>
      prev.includes(registrationId)
        ? prev.filter((id) => id !== registrationId)
        : [...prev, registrationId]
    );
  };

  const handleSelectAllRegistrations = () => {
    if (bulkSelection.length === filteredRegistrations.length) {
      setBulkSelection([]);
    } else {
      setBulkSelection(filteredRegistrations.map((r) => r.id));
    }
  };

  const handleBulkRegistrationStatusUpdate = async (newStatus) => {
    try {
      await Promise.all(
        bulkSelection.map((id) =>
          eventRegistrationService.updateRegistrationStatus(id, newStatus)
        )
      );
      setBulkSelection([]);
      onLoadRegistrations();
    } catch (error) {
      console.error("Error updating registration statuses:", error);
      alert("Error updating registration statuses");
    }
  };

  const handleBulkDeleteRegistrations = async () => {
    if (
      confirm(
        `Are you sure you want to delete ${bulkSelection.length} registrations?`
      )
    ) {
      try {
        await Promise.all(
          bulkSelection.map((id) => eventRegistrationService.delete(id))
        );
        setBulkSelection([]);
        onLoadRegistrations();
      } catch (error) {
        console.error("Error deleting registrations:", error);
        alert("Error deleting registrations");
      }
    }
  };

  const getStatusColor = (status) => {
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

  return (
    <div>
      {/* Modern Registration Statistics Dashboard */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Registration Overview
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {selectedEvent
                ? `Showing data for selected event`
                : "All events registration data"}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {/* Total Registrations */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-4 translate-x-4"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Icon
                    icon="mdi:account-multiple"
                    width={20}
                    className="text-primary"
                  />
                </div>
                <div className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                  Total
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.total}
                </p>
                <p className="text-sm text-gray-600">Registrations</p>
              </div>
            </div>
          </div>

          {/* Confirmed Registrations */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-100/50 rounded-full -translate-y-4 translate-x-4"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Icon
                    icon="mdi:check-circle"
                    width={20}
                    className="text-green-600"
                  />
                </div>
                <div className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                  Confirmed
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700 mb-1">
                  {stats.confirmed}
                </p>
                <p className="text-sm text-green-600">Approved</p>
              </div>
            </div>
          </div>

          {/* Pending Registrations */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-100/50 rounded-full -translate-y-4 translate-x-4"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-yellow-100 rounded-xl">
                  <Icon
                    icon="mdi:clock"
                    width={20}
                    className="text-yellow-600"
                  />
                </div>
                <div className="text-xs text-yellow-600 font-medium bg-yellow-100 px-2 py-1 rounded-full">
                  Pending
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-700 mb-1">
                  {stats.pending}
                </p>
                <p className="text-sm text-yellow-600">Awaiting</p>
              </div>
            </div>
          </div>

          {/* Cancelled Registrations */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-100/50 rounded-full -translate-y-4 translate-x-4"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-red-100 rounded-xl">
                  <Icon icon="mdi:cancel" width={20} className="text-red-600" />
                </div>
                <div className="text-xs text-red-600 font-medium bg-red-100 px-2 py-1 rounded-full">
                  Cancelled
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700 mb-1">
                  {stats.cancelled}
                </p>
                <p className="text-sm text-red-600">Declined</p>
              </div>
            </div>
          </div>

          {/* Total Attendees */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100/50 rounded-full -translate-y-4 translate-x-4"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <Icon
                    icon="mdi:account-group"
                    width={20}
                    className="text-purple-600"
                  />
                </div>
                <div className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full">
                  Attendees
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700 mb-1">
                  {stats.totalAttendees}
                </p>
                <p className="text-sm text-purple-600">People</p>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100/50 rounded-full -translate-y-4 translate-x-4"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <Icon
                    icon="mdi:currency-usd"
                    width={20}
                    className="text-emerald-600"
                  />
                </div>
                <div className="text-xs text-emerald-600 font-medium bg-emerald-100 px-2 py-1 rounded-full">
                  Revenue
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700 mb-1">
                  ₹{stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-emerald-600">
                  Avg: ₹{stats.avgRevenuePerRegistration.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Insights */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Icon
                  icon="mdi:chart-donut"
                  width={24}
                  className="text-primary"
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Registration Insights
                </h4>
                <p className="text-sm text-gray-600">
                  {stats.pending > 0
                    ? `${stats.pending} registrations awaiting approval`
                    : stats.confirmed > 0
                    ? `${stats.confirmed} confirmed registrations ready`
                    : "No registrations to process"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {stats.total > 0 && (
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">
                    {stats.conversionRate}%
                  </p>
                  <p className="text-xs text-gray-600">Conversion Rate</p>
                </div>
              )}

              {stats.totalRevenue > 0 && (
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-600">
                    ₹{stats.avgRevenuePerRegistration.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">Avg Revenue</p>
                </div>
              )}

              {stats.totalAttendees > 0 && (
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">
                    {Math.round(
                      (stats.totalAttendees / (stats.total || 1)) * 10
                    ) / 10}
                  </p>
                  <p className="text-xs text-gray-600">Avg Attendees</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search companies, contacts..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Event
            </label>
            <select
              value={selectedEvent || ""}
              onChange={(e) => onSelectEvent(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Events</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="All">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort by
            </label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="registrationDate-desc">
                Registration Date (Newest)
              </option>
              <option value="registrationDate-asc">
                Registration Date (Oldest)
              </option>
              <option value="companyName-asc">Company Name (A-Z)</option>
              <option value="companyName-desc">Company Name (Z-A)</option>
              <option value="totalCost-desc">Total Cost (High-Low)</option>
              <option value="totalCost-asc">Total Cost (Low-High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions for Registrations */}
      {bulkSelection.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {bulkSelection.length} registration
              {bulkSelection.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkRegistrationStatusUpdate("confirmed")}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Approve All
              </button>
              <button
                onClick={() => handleBulkRegistrationStatusUpdate("pending")}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              >
                Mark Pending
              </button>
              <button
                onClick={() => handleBulkRegistrationStatusUpdate("cancelled")}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Reject All
              </button>
              <button
                onClick={handleBulkDeleteRegistrations}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete All
              </button>
              <button
                onClick={() => setBulkSelection([])}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registrations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      bulkSelection.length === filteredRegistrations.length &&
                      filteredRegistrations.length > 0
                    }
                    onChange={handleSelectAllRegistrations}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company & Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.map((registration) => (
                <tr
                  key={registration.id}
                  className={`hover:bg-gray-50 ${
                    bulkSelection.includes(registration.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={bulkSelection.includes(registration.id)}
                      onChange={() =>
                        handleBulkRegistrationSelect(registration.id)
                      }
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {registration.companyName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.primaryContactName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.primaryContactEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {registration.eventTitle || "Event Not Found"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {registration.personnel
                        ? registration.personnel.filter((p) => p.isAttending)
                            .length
                        : 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{(registration.totalCost || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          registration.status
                        )}`}
                      >
                        {registration.status?.charAt(0).toUpperCase() +
                          registration.status?.slice(1)}
                      </span>
                      {registration.status === "pending" && (
                        <div className="flex gap-1">
                          <button
                            onClick={() =>
                              handleStatusUpdate(registration.id, "confirmed")
                            }
                            className="p-1 text-green-600 hover:bg-green-100 rounded"
                            title="Approve Registration"
                          >
                            <Icon icon="mdi:check" width={14} />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(registration.id, "cancelled")
                            }
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Reject Registration"
                          >
                            <Icon icon="mdi:close" width={14} />
                          </button>
                        </div>
                      )}
                      {registration.status === "confirmed" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(registration.id, "cancelled")
                          }
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Cancel Registration"
                        >
                          <Icon icon="mdi:close" width={14} />
                        </button>
                      )}
                      {registration.status === "cancelled" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(registration.id, "confirmed")
                          }
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          title="Reactivate Registration"
                        >
                          <Icon icon="mdi:check" width={14} />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(registration.registrationDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowRegistrationDetails(registration)}
                        className="text-primary hover:text-blue-900"
                        title="View Details"
                      >
                        <Icon icon="mdi:eye" width={16} />
                      </button>
                      <button
                        onClick={() => {
                          const csvData = `Company,Contact,Email,Event,Attendees,Cost,Status,Date
${registration.companyName || "N/A"},${
                            registration.primaryContactName || "N/A"
                          },${registration.primaryContactEmail || "N/A"},${
                            registration.eventTitle || "N/A"
                          },${
                            registration.personnel
                              ? registration.personnel.filter(
                                  (p) => p.isAttending
                                ).length
                              : 1
                          },₹${(
                            registration.totalCost || 0
                          ).toLocaleString()},${registration.status},${
                            registration.registrationDate
                              ? registration.registrationDate instanceof Date
                                ? registration.registrationDate.toLocaleDateString()
                                : new Date(
                                    registration.registrationDate
                                  ).toLocaleDateString()
                              : ""
                          }`;
                          const blob = new Blob([csvData], {
                            type: "text/csv",
                          });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `registration-${registration.id}.csv`;
                          a.click();
                          window.URL.revokeObjectURL(url);
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="Export Registration"
                      >
                        <Icon icon="mdi:download" width={16} />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteRegistration(registration.id)
                        }
                        className="text-red-600 hover:text-red-900"
                        title="Delete Registration"
                      >
                        <Icon icon="mdi:delete" width={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRegistrations.length === 0 && (
          <div className="text-center py-12">
            <Icon
              icon="mdi:account-multiple-outline"
              width={48}
              className="mx-auto text-gray-400 mb-4"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No registrations found
            </h3>
            <p className="text-gray-500">
              {searchTerm || selectedEvent || filterStatus !== "All"
                ? "Try adjusting your filters"
                : "No registrations have been made yet"}
            </p>
          </div>
        )}
      </div>

      {/* Registration Details Modal */}
      {showRegistrationDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Registration Details
                </h2>
                <button
                  onClick={() => setShowRegistrationDetails(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icon icon="mdi:close" width={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Company Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Company Name
                    </label>
                    <p className="text-sm text-gray-900">
                      {showRegistrationDetails.companyName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Industry
                    </label>
                    <p className="text-sm text-gray-900">
                      {showRegistrationDetails.industry || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Company Size
                    </label>
                    <p className="text-sm text-gray-900">
                      {showRegistrationDetails.companySize || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <p className="text-sm text-gray-900">
                      {showRegistrationDetails.website || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Primary Contact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Primary Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="text-sm text-gray-900">
                      {showRegistrationDetails.primaryContactName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="text-sm text-gray-900">
                      {showRegistrationDetails.primaryContactEmail || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <p className="text-sm text-gray-900">
                      {showRegistrationDetails.primaryContactPhone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Position
                    </label>
                    <p className="text-sm text-gray-900">
                      {showRegistrationDetails.primaryContactPosition || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Event Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Event Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Event
                    </label>
                    <p className="text-sm text-gray-900">
                      {showRegistrationDetails.eventTitle || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Registration Date
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(showRegistrationDetails.registrationDate)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Total Cost
                    </label>
                    <p className="text-sm text-gray-900">
                      ₹
                      {(
                        showRegistrationDetails.totalCost || 0
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        showRegistrationDetails.status
                      )}`}
                    >
                      {showRegistrationDetails.status?.charAt(0).toUpperCase() +
                        showRegistrationDetails.status?.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personnel */}
              {showRegistrationDetails.personnel &&
                showRegistrationDetails.personnel.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Attendees
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Name
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Email
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Position
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Attending
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {showRegistrationDetails.personnel.map(
                            (person, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {person.name || "N/A"}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {person.email || "N/A"}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {person.position || "N/A"}
                                </td>
                                <td className="px-4 py-2 text-sm">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      person.isAttending
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {person.isAttending ? "Yes" : "No"}
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Additional Information */}
              {showRegistrationDetails.additionalInfo && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Additional Information
                  </h3>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {showRegistrationDetails.additionalInfo}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => setShowRegistrationDetails(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const csvData = `Company,Contact,Email,Event,Attendees,Cost,Status,Date
${showRegistrationDetails.companyName || "N/A"},${
                    showRegistrationDetails.primaryContactName || "N/A"
                  },${showRegistrationDetails.primaryContactEmail || "N/A"},${
                    showRegistrationDetails.eventTitle || "N/A"
                  },${
                    showRegistrationDetails.personnel
                      ? showRegistrationDetails.personnel.filter(
                          (p) => p.isAttending
                        ).length
                      : 1
                  },₹${(
                    showRegistrationDetails.totalCost || 0
                  ).toLocaleString()},${showRegistrationDetails.status},${
                    showRegistrationDetails.registrationDate
                      ? showRegistrationDetails.registrationDate instanceof Date
                        ? showRegistrationDetails.registrationDate.toLocaleDateString()
                        : new Date(
                            showRegistrationDetails.registrationDate
                          ).toLocaleDateString()
                      : ""
                  }`;
                  const blob = new Blob([csvData], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `registration-${showRegistrationDetails.id}.csv`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Event Card Component
function EventCard({
  event,
  onEdit,
  onDelete,
  onDuplicate,
  onSelect,
  selected,
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Summit":
        return "bg-blue-100 text-blue-800";
      case "Workshop":
        return "bg-green-100 text-green-800";
      case "Conference":
        return "bg-purple-100 text-purple-800";
      case "Competition":
        return "bg-orange-100 text-orange-800";
      case "Networking":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-2 transition-all ${
        selected
          ? "border-primary bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(event.id)}
          className="absolute top-4 left-4 z-10 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <img
          src={event.heroImage || event.background || "/images/hero.png"}
          alt={event.title}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
              event.category
            )}`}
          >
            {event.category}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              event.status
            )}`}
          >
            {event.status}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:calendar" width={16} />
            <span>
              {event.date
                ? event.date instanceof Date
                  ? event.date.toLocaleDateString()
                  : event.date
                : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="mdi:map-marker" width={16} />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="mdi:account-group" width={16} />
            <span>{event.capacity} capacity</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="mdi:currency-inr" width={16} />
            <span>{event.price}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(event)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Icon icon="mdi:pencil" width={16} />
            Edit
          </button>
          <button
            onClick={() => onDuplicate(event)}
            className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Icon icon="mdi:content-copy" width={16} />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Icon icon="mdi:delete" width={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Event Row Component for List View
function EventRow({
  event,
  onEdit,
  onDelete,
  onDuplicate,
  onSelect,
  selected,
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Summit":
        return "bg-blue-100 text-blue-800";
      case "Workshop":
        return "bg-green-100 text-green-800";
      case "Conference":
        return "bg-purple-100 text-purple-800";
      case "Competition":
        return "bg-orange-100 text-orange-800";
      case "Networking":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <tr className={selected ? "bg-blue-50" : "hover:bg-gray-50"}>
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(event.id)}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img
            src={event.heroImage || event.background || "/images/hero.png"}
            alt={event.title}
            className="w-12 h-12 rounded-lg object-cover mr-4"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {event.title}
            </div>
            <div className="text-sm text-gray-500">{event.venue}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
            event.category
          )}`}
        >
          {event.category}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {event.date
          ? event.date instanceof Date
            ? event.date.toLocaleDateString()
            : event.date
          : ""}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {event.location}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            event.status
          )}`}
        >
          {event.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {event.capacity}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(event)}
            className="text-primary hover:text-blue-900"
          >
            <Icon icon="mdi:pencil" width={16} />
          </button>
          <button
            onClick={() => onDuplicate(event)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Icon icon="mdi:content-copy" width={16} />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="text-red-600 hover:text-red-900"
          >
            <Icon icon="mdi:delete" width={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// Event Modal Component
function EventModal({ isOpen, onClose, event, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Summit",
    date: "",
    time: "",
    location: "",
    venue: "",
    price: "",
    capacity: "",
    description: "",
    longDescription: "",
    heroImage: "",
    background: "",
    status: "upcoming",
    agenda: [],
    speakers: [],
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState({});
  const [uploadingField, setUploadingField] = useState(null);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        slug: event.slug || "",
        category: event.category || "Summit",
        date: event.date ? String(event.date) : "",
        time: event.time ? String(event.time) : "",
        location: event.location || "",
        venue: event.venue || "",
        price: event.price ? String(event.price) : "",
        capacity: event.capacity ? String(event.capacity) : "",
        description: event.description || "",
        longDescription: event.longDescription || "",
        heroImage: event.heroImage || "",
        background: event.background || "",
        status: event.status || "upcoming",
        agenda: event.agenda || [],
        speakers: event.speakers || [],
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        category: "Summit",
        date: "",
        time: "",
        location: "",
        venue: "",
        price: "",
        capacity: "",
        description: "",
        longDescription: "",
        heroImage: "",
        background: "",
        status: "upcoming",
        agenda: [],
        speakers: [],
      });
    }
    setErrors({});
    setActiveTab("basic");
  }, [event]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.date.trim()) newErrors.date = "Date is required";
    if (!formData.time.trim()) newErrors.time = "Time is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.venue.trim()) newErrors.venue = "Venue is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    if (!formData.capacity.trim()) newErrors.capacity = "Capacity is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadingField(field);
      const result = await uploadImage(file, {
        folder: "events",
      });
      setFormData((prev) => ({
        ...prev,
        [field]: result.url,
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrors((prev) => ({
        ...prev,
        [field]: `Upload failed: ${error.message}`,
      }));
    } finally {
      setUploading(false);
      setUploadingField(null);
    }
  };

  // Agenda management
  const addAgendaItem = () => {
    setFormData((prev) => ({
      ...prev,
      agenda: [
        ...prev.agenda,
        { time: "", title: "", description: "", speaker: "" },
      ],
    }));
  };

  const updateAgendaItem = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeAgendaItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index),
    }));
  };

  // Speaker management
  const addSpeaker = () => {
    setFormData((prev) => ({
      ...prev,
      speakers: [
        ...prev.speakers,
        { name: "", title: "", company: "", bio: "", image: "" },
      ],
    }));
  };

  const updateSpeaker = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      speakers: prev.speakers.map((speaker, i) =>
        i === index ? { ...speaker, [field]: value } : speaker
      ),
    }));
  };

  const removeSpeaker = (index) => {
    setFormData((prev) => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index),
    }));
  };

  const handleSpeakerImageUpload = async (index, file) => {
    if (!file) return;

    try {
      setUploading(true);
      setUploadingField(`speaker-${index}`);
      const result = await uploadImage(file, {
        folder: "events/speakers",
      });
      updateSpeaker(index, "image", result.url);
    } catch (error) {
      console.error("Error uploading speaker image:", error);
      setErrors((prev) => ({
        ...prev,
        [`speaker-${index}`]: `Upload failed: ${error.message}`,
      }));
    } finally {
      setUploading(false);
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setActiveTab("basic"); // Go to basic tab if there are validation errors
      return;
    }

    try {
      setSaving(true);
      if (event) {
        await eventService.update(event.id, formData);
      } else {
        await eventService.createEvent(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
      setErrors({ submit: `Failed to save event: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: "basic", name: "Basic Info" },
    { id: "content", name: "Content" },
    { id: "media", name: "Media" },
    { id: "agenda", name: "Agenda" },
    { id: "speakers", name: "Speakers" },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary px-6 py-4 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white text-2xl"
          >
            ×
          </button>
          <h2 className="text-2xl font-bold">
            {event ? " Edit Event" : " Create New Event"}
          </h2>
          <p className="text-blue-100 mt-1">
            {event
              ? "Update event information"
              : "Fill in the details to create a new event"}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary bg-white"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(95vh-180px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Error Display */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <div className="flex items-center gap-2">
                  <span>❌</span>
                  {errors.submit}
                </div>
              </div>
            )}

            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                        errors.title
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter event title"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                        errors.slug
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="event-url-slug"
                    />
                    {errors.slug && (
                      <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Summit">Summit</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Conference">Conference</option>
                      <option value="Competition">Competition</option>
                      <option value="Networking">Networking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="text"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                        errors.date
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g., 24th Jan 2025"
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="text"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                        errors.time
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g., 6:00 PM - 9:00 PM"
                    />
                    {errors.time && (
                      <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                        errors.location
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="City, State/Country"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Venue *
                    </label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                        errors.venue
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Venue name"
                    />
                    {errors.venue && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.venue}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                        errors.price
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g., Free, ₹5,000"
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                        errors.capacity
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="100"
                    />
                    {errors.capacity && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.capacity}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === "content" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none ${
                      errors.description
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Brief description that appears in event cards..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Detailed Description
                  </label>
                  <textarea
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleInputChange}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Detailed description that appears on the event page..."
                  />
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === "media" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Hero Image
                    </label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "heroImage")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {uploadingField === "heroImage" && (
                        <div className="flex items-center gap-2 text-primary">
                          <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                          Uploading...
                        </div>
                      )}
                      {errors.heroImage && (
                        <p className="text-red-500 text-sm">
                          {errors.heroImage}
                        </p>
                      )}
                      {formData.heroImage && (
                        <div className="relative">
                          <img
                            src={formData.heroImage}
                            alt="Hero"
                            className="w-full h-40 object-cover rounded-xl border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                heroImage: "",
                              }))
                            }
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Background Image
                    </label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "background")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {uploadingField === "background" && (
                        <div className="flex items-center gap-2 text-primary">
                          <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                          Uploading...
                        </div>
                      )}
                      {errors.background && (
                        <p className="text-red-500 text-sm">
                          {errors.background}
                        </p>
                      )}
                      {formData.background && (
                        <div className="relative">
                          <img
                            src={formData.background}
                            alt="Background"
                            className="w-full h-40 object-cover rounded-xl border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                background: "",
                              }))
                            }
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Agenda Tab */}
            {activeTab === "agenda" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Event Agenda
                  </h3>
                  <button
                    type="button"
                    onClick={addAgendaItem}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
                  >
                    <span>+</span> Add Item
                  </button>
                </div>

                {formData.agenda.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>📅 No agenda items yet</p>
                    <p className="text-sm">
                      Click "Add Item" to create your event schedule
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {formData.agenda.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-gray-800">
                          Agenda Item {index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeAgendaItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time
                          </label>
                          <input
                            type="text"
                            value={item.time}
                            onChange={(e) =>
                              updateAgendaItem(index, "time", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="e.g., 10:00 AM"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Speaker
                          </label>
                          <input
                            type="text"
                            value={item.speaker}
                            onChange={(e) =>
                              updateAgendaItem(index, "speaker", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Speaker name"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) =>
                              updateAgendaItem(index, "title", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Session title"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={item.description}
                            onChange={(e) =>
                              updateAgendaItem(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            placeholder="Brief description"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers Tab */}
            {activeTab === "speakers" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Event Speakers
                  </h3>
                  <button
                    type="button"
                    onClick={addSpeaker}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
                  >
                    <span>+</span> Add Speaker
                  </button>
                </div>

                {formData.speakers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p> No speakers added yet</p>
                    <p className="text-sm">
                      Click "Add Speaker" to add event speakers
                    </p>
                  </div>
                )}

                <div className="space-y-6">
                  {formData.speakers.map((speaker, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-6 rounded-xl border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium text-gray-800">
                          Speaker {index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeSpeaker(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Speaker Photo
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleSpeakerImageUpload(index, e.target.files[0])
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700"
                          />
                          {uploadingField === `speaker-${index}` && (
                            <div className="flex items-center gap-2 text-primary mt-2">
                              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                              Uploading...
                            </div>
                          )}
                          {speaker.image && (
                            <div className="mt-3 relative inline-block">
                              <img
                                src={speaker.image}
                                alt={speaker.name}
                                className="w-20 h-20 object-cover rounded-full border-2 border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  updateSpeaker(index, "image", "")
                                }
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={speaker.name}
                            onChange={(e) =>
                              updateSpeaker(index, "name", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Speaker name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={speaker.title}
                            onChange={(e) =>
                              updateSpeaker(index, "title", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Job title"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            value={speaker.company}
                            onChange={(e) =>
                              updateSpeaker(index, "company", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Company name"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bio
                          </label>
                          <textarea
                            value={speaker.bio}
                            onChange={(e) =>
                              updateSpeaker(index, "bio", e.target.value)
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            placeholder="Speaker biography"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
              <div className="text-sm text-gray-500">
                {activeTab !== "basic" &&
                  "* Required fields are in the Basic Info tab"}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:from-primary/90 hover:to-secondary/90 disabled:opacity-50 font-medium transition-all flex items-center gap-2 cursor-pointer"
                >
                  {saving && (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  )}
                  {saving
                    ? "Saving..."
                    : event
                    ? " Update Event"
                    : " Create Event"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
