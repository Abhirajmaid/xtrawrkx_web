"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import AdminLayout from "../../../../src/components/admin/AdminLayout";
import ProtectedRoute from "../../../../src/components/admin/ProtectedRoute";
import {
  ResourceService,
  EventService,
  ServiceService,
} from "../../../../src/services/databaseService";
import Button from "../../../../src/components/common/Button";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    resources: 0,
    events: 0,
    services: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [resourcesCount, eventsCount, servicesCount] = await Promise.all([
        ResourceService.getCount("resources"),
        EventService.getCount("events"),
        ServiceService.getCount("services"),
      ]);

      setStats({
        resources: resourcesCount,
        events: eventsCount,
        services: servicesCount,
        users: 15, // Mock data
      });

      // Mock recent activity
      setRecentActivity([
        {
          id: 1,
          type: "resource",
          action: "created",
          title: "New whitepaper published",
          time: "2 hours ago",
        },
        {
          id: 2,
          type: "event",
          action: "updated",
          title: "Event details updated",
          time: "4 hours ago",
        },
        {
          id: 3,
          type: "service",
          action: "created",
          title: "New service added",
          time: "1 day ago",
        },
        {
          id: 4,
          type: "user",
          action: "registered",
          title: "New user registered",
          time: "2 days ago",
        },
      ]);
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
    },
    {
      name: "Create Event",
      href: "/admin/events/new",
      icon: "solar:calendar-add-bold",
      color: "bg-green-500",
    },
    {
      name: "Add Service",
      href: "/admin/services/new",
      icon: "solar:widget-add-bold",
      color: "bg-purple-500",
    },
    {
      name: "View Analytics",
      href: "/admin/analytics",
      icon: "solar:chart-square-bold",
      color: "bg-orange-500",
    },
  ];

  const statCards = [
    {
      name: "Resources",
      value: stats.resources,
      icon: "solar:document-text-bold",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Events",
      value: stats.events,
      icon: "solar:calendar-bold",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "Services",
      value: stats.services,
      icon: "solar:widget-bold",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      name: "Users",
      value: stats.users,
      icon: "solar:users-group-rounded-bold",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
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
      case "user":
        return "solar:user-bold";
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
      case "user":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
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
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <Icon icon={card.icon} width={24} className={card.color} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {card.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
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
              <Button
                key={action.name}
                text={action.name}
                type="secondary"
                link={action.href}
                className="flex items-center justify-center py-4"
              />
            ))}
          </div>
        </div>

        {/* Recent Activity & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className={`p-2 rounded-full bg-gray-100`}>
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
                ))}
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

          {/* Quick Stats */}
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
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="text-sm text-gray-900">24</span>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  text="View System Settings"
                  type="secondary"
                  className="w-full"
                  link="/admin/settings"
                />
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
