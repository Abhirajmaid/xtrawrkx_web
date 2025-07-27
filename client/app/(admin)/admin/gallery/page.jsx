"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import AdminLayout from "@/src/components/admin/AdminLayout";
import ProtectedRoute from "@/src/components/admin/ProtectedRoute";
import { galleryService } from "@/src/services/databaseService";
import { uploadImage } from "@/src/services/cloudinaryService";
import Button from "@/src/components/common/Button";

export default function GalleryManagement() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bulkSelection, setBulkSelection] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("grid");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const categories = ["All", "events", "communities", "achievements", "team"];

  // Load gallery items
  useEffect(() => {
    loadGalleryItems();
  }, []);

  const loadGalleryItems = async () => {
    try {
      setLoading(true);
      const items = await galleryService.getGalleryItems();
      setGalleryItems(items);
    } catch (error) {
      console.error("Error loading gallery items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    try {
      setUploading(true);
      const result = await uploadImage(file, "gallery");
      return result.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Handle save/update
  const handleSave = async (itemData) => {
    try {
      setSaving(true);
      if (currentItem) {
        await galleryService.updateGalleryItem(currentItem.id, itemData);
      } else {
        await galleryService.createGalleryItem(itemData);
      }
      await loadGalleryItems();
      setIsEditModalOpen(false);
      setCurrentItem(null);
    } catch (error) {
      console.error("Error saving gallery item:", error);
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this gallery item?")) {
      try {
        await galleryService.deleteGalleryItem(id);
        await loadGalleryItems();
      } catch (error) {
        console.error("Error deleting gallery item:", error);
      }
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${bulkSelection.length} selected items?`
      )
    ) {
      try {
        await Promise.all(
          bulkSelection.map((id) => galleryService.deleteGalleryItem(id))
        );
        setBulkSelection([]);
        await loadGalleryItems();
      } catch (error) {
        console.error("Error bulk deleting gallery items:", error);
      }
    }
  };

  // Filter and sort items
  const filteredAndSortedItems = galleryItems
    .filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "date") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  // Statistics
  const stats = {
    total: galleryItems.length,
    events: galleryItems.filter((item) => item.category === "events").length,
    communities: galleryItems.filter((item) => item.category === "communities")
      .length,
    achievements: galleryItems.filter(
      (item) => item.category === "achievements"
    ).length,
    team: galleryItems.filter((item) => item.category === "team").length,
  };

  return (
    <ProtectedRoute>
      <AdminLayout title="Gallery Management">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gallery Management
              </h1>
              <p className="text-gray-600">
                Manage your gallery items and media content
              </p>
            </div>
            <Button
              text="Add Gallery Item"
              type="primary"
              link="/admin/gallery/new"
              icon="mdi:plus"
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
            />
          </div>

          {/* Statistics Dashboard */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Gallery Overview
              </h3>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Total Items
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {stats.total}
                    </p>
                  </div>
                  <Icon
                    icon="solar:gallery-bold"
                    width={32}
                    className="text-blue-600"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">Events</p>
                    <p className="text-2xl font-bold text-green-900">
                      {stats.events}
                    </p>
                  </div>
                  <Icon
                    icon="solar:calendar-bold"
                    width={32}
                    className="text-green-600"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-800">
                      Communities
                    </p>
                    <p className="text-2xl font-bold text-purple-900">
                      {stats.communities}
                    </p>
                  </div>
                  <Icon
                    icon="solar:users-group-rounded-bold"
                    width={32}
                    className="text-purple-600"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Achievements
                    </p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {stats.achievements}
                    </p>
                  </div>
                  <Icon
                    icon="solar:crown-bold"
                    width={32}
                    className="text-yellow-600"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-800">Team</p>
                    <p className="text-2xl font-bold text-indigo-900">
                      {stats.team}
                    </p>
                  </div>
                  <Icon
                    icon="solar:user-bold"
                    width={32}
                    className="text-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Icon
                    icon="solar:magnifer-bold"
                    width={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search gallery items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon icon="solar:gallery-bold" width={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon icon="solar:list-bold" width={20} />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="category">Sort by Category</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>

            {/* Bulk Actions */}
            {bulkSelection.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {bulkSelection.length} item(s) selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBulkSelection([])}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                    >
                      Clear Selection
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                    >
                      Delete Selected
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredAndSortedItems.length} of {galleryItems.length}{" "}
                items
              </p>
            </div>

            {/* Gallery Grid/List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Icon
                  icon="solar:refresh-bold"
                  width={32}
                  className="text-primary animate-spin"
                />
              </div>
            ) : filteredAndSortedItems.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredAndSortedItems.map((item) => (
                  <GalleryItemCard
                    key={item.id}
                    item={item}
                    viewMode={viewMode}
                    isSelected={
                      Array.isArray(bulkSelection) &&
                      bulkSelection.includes(item.id)
                    }
                    onSelect={(id) => {
                      setBulkSelection((prev) => {
                        const arr = Array.isArray(prev) ? prev : [];
                        return arr.includes(id)
                          ? arr.filter((i) => i !== id)
                          : [...arr, id];
                      });
                    }}
                    onEdit={(item) => {
                      setCurrentItem(item);
                      setIsEditModalOpen(true);
                    }}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon
                  icon="solar:gallery-bold"
                  width={64}
                  className="text-gray-300 mx-auto mb-4"
                />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No gallery items found
                </h3>
                <p className="text-gray-600 mb-6">
                  Get started by adding your first gallery item.
                </p>
                <Button
                  text="Add Gallery Item"
                  type="primary"
                  link="/admin/gallery/new"
                  icon="mdi:plus"
                />
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <EditGalleryModal
            item={currentItem}
            onClose={() => {
              setIsEditModalOpen(false);
              setCurrentItem(null);
            }}
            onSave={handleSave}
            uploading={uploading}
            saving={saving}
            onImageUpload={handleImageUpload}
          />
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}

// Gallery Item Card Component
const GalleryItemCard = ({
  item,
  viewMode,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      events: "bg-blue-100 text-blue-800",
      communities: "bg-green-100 text-green-800",
      achievements: "bg-yellow-100 text-yellow-800",
      team: "bg-purple-100 text-purple-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(item.id)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={item.image || "/images/hero.png"}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-1">
              {item.description}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(
                  item.category
                )}`}
              >
                {item.category}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(item.date)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(item)}
              className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon icon="solar:pen-bold" width={16} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Icon icon="solar:trash-bin-trash-bold" width={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(item.id)}
          className="absolute top-3 left-3 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary z-10"
        />
        <div className="h-48 relative bg-gray-100">
          <Image
            src={item.image || "/images/hero.png"}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute top-3 right-3 flex gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-2 bg-white/90 text-gray-600 hover:text-primary rounded-lg transition-colors backdrop-blur-sm"
          >
            <Icon icon="solar:pen-bold" width={16} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 bg-white/90 text-gray-600 hover:text-red-600 rounded-lg transition-colors backdrop-blur-sm"
          >
            <Icon icon="solar:trash-bin-trash-bold" width={16} />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span
            className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(
              item.category
            )}`}
          >
            {item.category}
          </span>
          <span className="text-xs text-gray-500">{formatDate(item.date)}</span>
        </div>
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                #{tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Edit Gallery Modal Component
const EditGalleryModal = ({
  item,
  onClose,
  onSave,
  uploading,
  saving,
  onImageUpload,
}) => {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    image: item?.image || "",
    category: item?.category || "events",
    date: item?.date
      ? new Date(item.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    tags: item?.tags || [],
    featured: item?.featured || false,
  });
  const [currentTag, setCurrentTag] = useState("");

  const categories = ["events", "communities", "achievements", "team"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await onImageUpload(file);
        setFormData((prev) => ({ ...prev, image: imageUrl }));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      date: new Date(formData.date),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {item ? "Edit Gallery Item" : "Add Gallery Item"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon icon="solar:close-circle-bold" width={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {uploading && (
              <p className="text-sm text-primary mt-1">Uploading image...</p>
            )}
            {typeof formData.image === "string" && formData.image && (
              <div className="mt-2">
                <Image
                  src={formData.image}
                  alt="Preview"
                  width={200}
                  height={150}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                placeholder="Add a tag"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Icon icon="solar:close-circle-bold" width={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Featured item
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
