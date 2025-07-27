"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import AdminLayout from "../../../../src/components/admin/AdminLayout";
import ProtectedRoute from "../../../../src/components/admin/ProtectedRoute";
import {
  eventService,
  resourceService,
  serviceService,
  eventRegistrationService,
} from "../../../../src/services/databaseService";
import Button from "../../../../src/components/common/Button";
import {
  formatDate,
  formatRelativeTime,
} from "../../../../src/utils/dateUtils";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    resources: 0,
    events: 0,
    services: 0,
    registrations: 0,
    resourcesByType: {
      whitepapers: 0,
      articles: 0,
      reports: 0,
    },
    eventsByStatus: {
      upcoming: 0,
      ongoing: 0,
      completed: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [recentResources, setRecentResources] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data concurrently
      const [
        resourcesCount,
        eventsCount,
        servicesCount,
        registrationsCount,
        allResources,
        allEvents,
        allRegistrations,
      ] = await Promise.all([
        resourceService.getCount(),
        eventService.getCount(),
        serviceService.getCount(),
        eventRegistrationService.getCount(),
        resourceService.getWithLimit(5, "createdAt", "desc"),
        eventService.getWithLimit(5, "createdAt", "desc"),
        eventRegistrationService.getWithLimit(10, "createdAt", "desc"),
      ]);

      // Calculate resource stats by type
      const resourcesByType = {
        whitepapers: 0,
        articles: 0,
        reports: 0,
      };

      // Get all resources to calculate type stats
      const allResourcesForStats = await resourceService.getAll();
      allResourcesForStats.forEach((resource) => {
        if (resource.type === "whitepaper") resourcesByType.whitepapers++;
        else if (resource.type === "article") resourcesByType.articles++;
        else if (resource.type === "report") resourcesByType.reports++;
      });

      // Calculate event stats by status
      const eventsByStatus = {
        upcoming: 0,
        ongoing: 0,
        completed: 0,
      };

      const now = new Date();
      const allEventsForStats = await eventService.getAll();
      allEventsForStats.forEach((event) => {
        const eventDate = new Date(event.date);
        const eventEndDate = event.endDate
          ? new Date(event.endDate)
          : eventDate;

        if (eventDate > now) {
          eventsByStatus.upcoming++;
        } else if (eventDate <= now && eventEndDate >= now) {
          eventsByStatus.ongoing++;
        } else {
          eventsByStatus.completed++;
        }
      });

      setStats({
        resources: resourcesCount,
        events: eventsCount,
        services: servicesCount,
        registrations: registrationsCount,
        resourcesByType,
        eventsByStatus,
      });

      setRecentResources(allResources);
      setRecentEvents(allEvents);

      // Generate recent activity from actual data
      const activities = [];

      // Add recent resources
      allResources.slice(0, 3).forEach((resource) => {
        activities.push({
          id: `resource-${resource.id}`,
          type: "resource",
          action: "created",
          title: `New ${resource.type}: ${resource.title}`,
          time: formatRelativeTime(resource.createdAt),
          item: resource,
        });
      });

      // Add recent events
      allEvents.slice(0, 3).forEach((event) => {
        activities.push({
          id: `event-${event.id}`,
          type: "event",
          action: "created",
          title: `New event: ${event.title}`,
          time: formatRelativeTime(event.createdAt),
          item: event,
        });
      });

      // Add recent registrations
      allRegistrations.slice(0, 2).forEach((registration) => {
        activities.push({
          id: `registration-${registration.id}`,
          type: "registration",
          action: "registered",
          title: `${registration.firstName} ${registration.lastName} registered for event`,
          time: formatRelativeTime(registration.createdAt),
          item: registration,
        });
      });

      // Sort activities by time (most recent first)
      activities.sort((a, b) => {
        const timeA = a.item.createdAt || new Date(0);
        const timeB = b.item.createdAt || new Date(0);
        return timeB - timeA;
      });

      setRecentActivity(activities.slice(0, 6));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      name: "Add Resource",
      href: "/admin/resources/new",
      icon: "solar:document-add-bold",
      color: "bg-blue-500",
      description: "Create new whitepaper, article, or report",
    },
    {
      name: "Create Event",
      href: "/admin/events/new",
      icon: "solar:calendar-add-bold",
      color: "bg-green-500",
      description: "Schedule a new event or workshop",
    },
    {
      name: "Add Service",
      href: "/admin/services/new",
      icon: "solar:widget-add-bold",
      color: "bg-purple-500",
      description: "Add a new business service",
    },
    {
      name: "View Analytics",
      href: "/admin/analytics",
      icon: "solar:chart-square-bold",
      color: "bg-orange-500",
      description: "Analyze performance metrics",
    },
  ];

  const statCards = [
    {
      name: "Total Resources",
      value: stats.resources,
      icon: "solar:document-text-bold",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      link: "/admin/resources",
      subtitle: `${stats.resourcesByType.whitepapers} whitepapers, ${stats.resourcesByType.articles} articles, ${stats.resourcesByType.reports} reports`,
    },
    {
      name: "Total Events",
      value: stats.events,
      icon: "solar:calendar-bold",
      color: "text-green-600",
      bgColor: "bg-green-100",
      link: "/admin/events",
      subtitle: `${stats.eventsByStatus.upcoming} upcoming, ${stats.eventsByStatus.ongoing} ongoing`,
    },
    {
      name: "Services",
      value: stats.services,
      icon: "solar:widget-bold",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      link: "/admin/services",
      subtitle: "Business services offered",
    },
    {
      name: "Registrations",
      value: stats.registrations,
      icon: "solar:users-group-rounded-bold",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      link: "/admin/events",
      subtitle: "Total event registrations",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "resource":
        return "solar:document-text-bold";
      case "event":
        return "solar:calendar-bold";
      case "service":
        return "solar:widget-bold";
      case "registration":
        return "solar:user-plus-bold";
      default:
        return "solar:bell-bold";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "resource":
        return "text-blue-600";
      case "event":
        return "text-green-600";
      case "service":
        return "text-purple-600";
      case "registration":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const getActivityBgColor = (type) => {
    switch (type) {
      case "resource":
        return "bg-blue-100";
      case "event":
        return "bg-green-100";
      case "service":
        return "bg-purple-100";
      case "registration":
        return "bg-orange-100";
      default:
        return "bg-gray-100";
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout title="Dashboard">
          <div className="animate-pulse">
            {/* Welcome Message Skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded mb-2 w-64"></div>
              <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions Skeleton */}
            <div className="mb-8">
              <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>

            {/* Bottom Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="ml-4 flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout title="Dashboard">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your content management system.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => (
            <div
              key={card.name}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => (window.location.href = card.link)}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <Icon icon={card.icon} width={24} className={card.color} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {card.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                  {card.subtitle && (
                    <p className="text-xs text-gray-500 mt-1">
                      {card.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <div key={action.name} className="relative group">
                <Button
                  text={action.name}
                  type="secondary"
                  link={action.href}
                  className="flex items-center justify-center py-4 w-full group-hover:shadow-md transition-shadow"
                  icon={action.icon}
                />
                <div className="absolute inset-x-0 -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-gray-500 text-center">
                    {action.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center">
                      <div
                        className={`p-2 rounded-full ${getActivityBgColor(
                          activity.type
                        )}`}
                      >
                        <Icon
                          icon={getActivityIcon(activity.type)}
                          width={16}
                          className={getActivityColor(activity.type)}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No recent activity
                  </p>
                )}
              </div>
              <div className="mt-6">
                <Button
                  text="View All Activity"
                  type="secondary"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                System Status
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database Status</span>
                  <span className="flex items-center text-green-600">
                    <Icon
                      icon="solar:check-circle-bold"
                      width={16}
                      className="mr-1"
                    />
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage Usage</span>
                  <span className="text-sm text-gray-900">2.3 GB / 10 GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="text-sm text-gray-900">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Users</span>
                  <span className="text-sm text-gray-900">
                    {stats.registrations}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  text="System Settings"
                  type="secondary"
                  className="w-full"
                  link="/admin/settings"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Content Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Resources */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Resources
              </h3>
              <Button
                text="View All"
                type="secondary"
                size="sm"
                link="/admin/resources"
              />
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentResources.length > 0 ? (
                  recentResources.map((resource) => (
                    <div key={resource.id} className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon
                            icon={
                              resource.type === "whitepaper"
                                ? "solar:document-text-bold"
                                : resource.type === "article"
                                ? "solar:book-2-bold"
                                : resource.type === "report"
                                ? "solar:chart-square-bold"
                                : "solar:document-bold"
                            }
                            width={20}
                            className="text-blue-600"
                          />
                        </div>
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {resource.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {resource.type} •{" "}
                          {formatRelativeTime(resource.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No resources yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Events
              </h3>
              <Button
                text="View All"
                type="secondary"
                size="sm"
                link="/admin/events"
              />
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentEvents.length > 0 ? (
                  recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Icon
                            icon="solar:calendar-bold"
                            width={20}
                            className="text-green-600"
                          />
                        </div>
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(event.date)} • {event.category}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No events yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
