"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import AdminLayout from "@/src/components/admin/AdminLayout";
import ProtectedRoute from "@/src/components/admin/ProtectedRoute";
import { resourceService } from "@/src/services/databaseService";
import { uploadImage } from "@/src/services/cloudinaryService";
import Button from "@/src/components/common/Button";

export default function NewResource() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    type: "whitepaper",
    category: "Technology",
    description: "",
    excerpt: "",
    author: "",
    publishedDate: new Date().toISOString().split("T")[0],
    readTime: "",
    downloadUrl: "",
    image: "",
    tags: [],
    featured: false,
    views: 0,
    downloads: 0,
    status: "published",
    content: "",
  });

  const [uploading, setUploading] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentTag, setCurrentTag] = useState("");

  const resourceTypes = ["whitepaper", "article", "report"];

  const resourceCategories = [
    "Finance",
    "Technology",
    "Manufacturing",
    "Market Analysis",
    "Sustainability",
    "Regulatory",
    "Investment",
  ];

  const statusOptions = ["published", "draft", "archived"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

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

    // Clear errors
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadingField(field);
      const result = await uploadImage(file, {
        folder: "resources",
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

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrors((prev) => ({
        ...prev,
        downloadUrl: "Please upload a PDF file only",
      }));
      return;
    }

    try {
      setUploading(true);
      setUploadingField("downloadUrl");
      const { uploadFile } = await import("@/src/services/cloudinaryService");
      const result = await uploadFile(file, {
        folder: "resources/documents",
      });
      setFormData((prev) => ({
        ...prev,
        downloadUrl: result.url,
      }));
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setErrors((prev) => ({
        ...prev,
        downloadUrl: `Upload failed: ${error.message}`,
      }));
    } finally {
      setUploading(false);
      setUploadingField(null);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.excerpt.trim()) newErrors.excerpt = "Excerpt is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.readTime.trim()) newErrors.readTime = "Read time is required";

    // Content is only required for articles
    if (formData.type === "article" && !formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    // PDF is required for whitepapers and reports
    if (
      (formData.type === "whitepaper" || formData.type === "report") &&
      !formData.downloadUrl
    ) {
      newErrors.downloadUrl =
        "PDF file is required for whitepapers and reports";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrors((prev) => ({
        ...prev,
        submit: "Please correct the errors in the form before submitting.",
      }));
      return;
    }

    setSaving(true);

    try {
      const resourceData = {
        ...formData,
        publishedDate: formData.publishedDate
          ? new Date(formData.publishedDate)
          : new Date(),
      };

      await resourceService.createResource(resourceData);
      router.push("/admin/resources");
    } catch (error) {
      console.error("Error creating resource:", error);
      setErrors((prev) => ({
        ...prev,
        submit: `Error creating resource: ${error.message}`,
      }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout title="Create New Resource">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Create New Resource
                </h1>
                <p className="text-gray-600 mt-2">
                  Add a new whitepaper, article, or report to your resource
                  library
                </p>
              </div>
              <Button
                text="Back to Resources"
                type="secondary"
                link="/admin/resources"
                className="text-sm"
              />
            </div>
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:alert-circle" width={20} />
                {errors.submit}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Icon
                  icon="mdi:information"
                  width={24}
                  className="text-primary"
                />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resource Title *
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
                    placeholder="Enter resource title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div className="md:col-span-2">
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
                    placeholder="resource-url-slug"
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resource Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {resourceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {resourceCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                      errors.author
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Author name"
                  />
                  {errors.author && (
                    <p className="text-red-500 text-sm mt-1">{errors.author}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Read Time *
                  </label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                      errors.readTime
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="e.g., 12 min read"
                  />
                  {errors.readTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.readTime}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Published Date
                  </label>
                  <input
                    type="date"
                    name="publishedDate"
                    value={formData.publishedDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Featured Resource
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Content - Only show for articles */}
            {formData.type === "article" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Icon icon="mdi:text" width={24} className="text-primary" />
                  Content
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Short Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-colors ${
                        errors.description
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Brief description that appears in resource cards..."
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Excerpt *
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-colors ${
                        errors.excerpt
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Longer excerpt that appears on resource detail pages..."
                    />
                    {errors.excerpt && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.excerpt}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Content *
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={12}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-colors ${
                        errors.content
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Full content of the resource (HTML allowed)..."
                    />
                    {errors.content && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.content}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      You can use HTML tags for formatting. This content will be
                      displayed on the resource detail page.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Description & Excerpt for all types */}
            {(formData.type === "whitepaper" || formData.type === "report") && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Icon icon="mdi:text" width={24} className="text-primary" />
                  Description
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Short Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-colors ${
                        errors.description
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Brief description that appears in resource cards..."
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Excerpt *
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-colors ${
                        errors.excerpt
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Longer excerpt that appears on resource detail pages..."
                    />
                    {errors.excerpt && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.excerpt}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Media & Files */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Icon icon="mdi:image" width={24} className="text-primary" />
                Media & Files
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Resource Image
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "image")}
                      disabled={uploading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploadingField === "image" && (
                      <div className="flex items-center gap-2 text-primary">
                        <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                        Uploading...
                      </div>
                    )}
                    {errors.image && (
                      <p className="text-red-500 text-sm">{errors.image}</p>
                    )}
                    {formData.image && (
                      <div className="relative">
                        <img
                          src={formData.image}
                          alt="Resource preview"
                          className="w-full h-40 object-cover rounded-xl border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, image: "" }))
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
                    {formData.type === "whitepaper" ||
                    formData.type === "report"
                      ? "PDF File *"
                      : "PDF Download (Optional)"}
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      disabled={uploading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploadingField === "downloadUrl" && (
                      <div className="flex items-center gap-2 text-primary">
                        <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                        Uploading...
                      </div>
                    )}
                    {errors.downloadUrl && (
                      <p className="text-red-500 text-sm">
                        {errors.downloadUrl}
                      </p>
                    )}
                    {formData.downloadUrl && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Icon icon="mdi:file-pdf" width={20} />
                        <span className="text-sm">
                          PDF uploaded successfully
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              downloadUrl: "",
                            }))
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <Icon icon="mdi:close" width={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Icon icon="mdi:tag" width={24} className="text-primary" />
                Tags
              </h2>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Add a tag..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Icon icon="mdi:close" width={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pb-8">
              <Button text="Cancel" type="secondary" link="/admin/resources" />
              <button
                type="submit"
                disabled={saving || uploading}
                className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold hover:from-primary/90 hover:to-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {saving && (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                )}
                {saving ? "Creating..." : "Create Resource"}
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
