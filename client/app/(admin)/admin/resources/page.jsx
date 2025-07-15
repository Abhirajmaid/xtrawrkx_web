"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import AdminLayout from "../../../../src/components/admin/AdminLayout";
import ProtectedRoute from "../../../../src/components/admin/ProtectedRoute";
import { ResourceService } from "../../../../src/services/databaseService";
import Button from "../../../../src/components/common/Button";

const ResourcesManagement = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedResources, setSelectedResources] = useState([]);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const resourcesData = await ResourceService.getResources();
      setResources(resourcesData);
    } catch (error) {
      console.error("Error loading resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await ResourceService.delete("resources", id);
        setResources(resources.filter((resource) => resource.id !== id));
      } catch (error) {
        console.error("Error deleting resource:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedResources.length === 0) return;

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedResources.length} resources?`
      )
    ) {
      try {
        await Promise.all(
          selectedResources.map((id) => ResourceService.delete("resources", id))
        );
        setResources(
          resources.filter(
            (resource) => !selectedResources.includes(resource.id)
          )
        );
        setSelectedResources([]);
      } catch (error) {
        console.error("Error deleting resources:", error);
      }
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || resource.type === filterType;
    return matchesSearch && matchesType;
  });

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

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout title="Resources">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout title="Resources">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Resources Management
            </h2>
            <Button
              text="Add Resource"
              type="primary"
              link="/admin/resources/new"
              className="flex items-center"
            />
          </div>
          <p className="text-gray-600 mt-2">
            Manage your whitepapers, articles, and reports
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Icon
                    icon="solar:magnifer-bold"
                    width={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="whitepaper">Whitepapers</option>
                  <option value="article">Articles</option>
                  <option value="report">Reports</option>
                </select>
                {selectedResources.length > 0 && (
                  <Button
                    text={`Delete Selected (${selectedResources.length})`}
                    type="danger"
                    onClick={handleBulkDelete}
                    className="flex items-center"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resources List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {filteredResources.length} Resources Found
            </h3>
          </div>

          {filteredResources.length === 0 ? (
            <div className="p-12 text-center">
              <Icon
                icon="solar:document-bold"
                width={48}
                className="mx-auto text-gray-400 mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No resources found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first resource"}
              </p>
              <Button
                text="Add Resource"
                type="primary"
                link="/admin/resources/new"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={
                          selectedResources.length === filteredResources.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedResources(
                              filteredResources.map((r) => r.id)
                            );
                          } else {
                            setSelectedResources([]);
                          }
                        }}
                        className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResources.map((resource) => (
                    <tr key={resource.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedResources.includes(resource.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedResources([
                                ...selectedResources,
                                resource.id,
                              ]);
                            } else {
                              setSelectedResources(
                                selectedResources.filter(
                                  (id) => id !== resource.id
                                )
                              );
                            }
                          }}
                          className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Icon
                              icon={getTypeIcon(resource.type)}
                              width={20}
                              className="text-gray-600"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {resource.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {resource.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                            resource.type
                          )}`}
                        >
                          {resource.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {resource.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {resource.publishedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Icon
                              icon="solar:eye-bold"
                              width={14}
                              className="mr-1"
                            />
                            {resource.views?.toLocaleString() || 0}
                          </span>
                          {resource.downloads > 0 && (
                            <span className="flex items-center">
                              <Icon
                                icon="solar:download-bold"
                                width={14}
                                className="mr-1"
                              />
                              {resource.downloads.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            text="Edit"
                            type="secondary"
                            size="sm"
                            link={`/admin/resources/${resource.id}/edit`}
                          />
                          <button
                            onClick={() => handleDelete(resource.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded"
                          >
                            <Icon
                              icon="solar:trash-bin-trash-bold"
                              width={16}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default ResourcesManagement;
