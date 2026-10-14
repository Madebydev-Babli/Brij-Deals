"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin7Line } from "react-icons/ri";
import { MdOutlineArticle, MdAdd, MdRefresh, MdClose } from "react-icons/md";

import { API_ENDPOINTS } from "@/utility/constants";
import ConfirmationPopup from "@/server-components/ConfirmationPopup";

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");

  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function requestJSON(url, options = {}) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const result = await response.json();

    if (!response.ok || result.status !== "success") {
      throw new Error(result.message || "Request failed");
    }

    return result;
  }

  async function fetchCategories() {
    try {
      setLoading(true);

      const result = await requestJSON(
        API_ENDPOINTS.FETCH_BLOG_CATEGORIES.path,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      setCategories(result.data || []);
    } catch (error) {
      console.error("Fetch categories error:", error);
      toast.error(error.message || "Unable to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleAddCategory(e) {
    e.preventDefault();

    const name = categoryName.trim();

    if (!name) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      setSaving(true);

      const result = await requestJSON(API_ENDPOINTS.ADD_BLOG_CATEGORY.path, {
        method: API_ENDPOINTS.ADD_BLOG_CATEGORY.method,
        body: JSON.stringify({ name }),
      });

      toast.success(result.message || "Category added successfully");
      setCategoryName("");
      await fetchCategories();
    } catch (error) {
      toast.error(error.message || "Unable to add category");
    } finally {
      setSaving(false);
    }
  }

  function openEditModal(category) {
    setEditingCategory(category);
    setEditName(category.name);
  }

  async function handleEditCategory(e) {
    e.preventDefault();

    const name = editName.trim();

    if (!name) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      setSaving(true);

      const result = await requestJSON(
        API_ENDPOINTS.UPDATE_BLOG_CATEGORY.path,
        {
          method: API_ENDPOINTS.UPDATE_BLOG_CATEGORY.method,
          body: JSON.stringify({
            id: editingCategory._id,
            name,
          }),
        },
      );

      toast.success(result.message || "Category updated successfully");
      setEditingCategory(null);
      setEditName("");
      await fetchCategories();
    } catch (error) {
      toast.error(error.message || "Unable to update category");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!categoryToDelete) return;

    try {
      setDeleting(true);

      const url = `${API_ENDPOINTS.DELETE_BLOG_CATEGORY.path}?id=${encodeURIComponent(
        categoryToDelete._id,
      )}`;

      const result = await requestJSON(url, {
        method: API_ENDPOINTS.DELETE_BLOG_CATEGORY.method,
      });

      toast.success(result.message || "Category deleted successfully");
      setCategoryToDelete(null);
      await fetchCategories();
    } catch (error) {
      toast.error(error.message || "Unable to delete category");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <section className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-bold text-gray-900">Add a category</h2>

          <p className="mt-1 text-sm text-gray-500">
            Use a clear name that describes the blog topic.
          </p>

          <form
            onSubmit={handleAddCategory}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Temples & Pilgrimage"
              maxLength={80}
              required
              className="form-input min-w-0 flex-1"
            />

            <button
              type="submit"
              disabled={saving || !categoryName.trim()}
              className="flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2.5 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MdAdd size={20} />
              {saving ? "Saving..." : "Add Category"}
            </button>
          </form>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <div>
              <h2 className="font-bold text-gray-900">Existing Categories</h2>
              <p className="mt-1 text-sm text-gray-500">
                Categories available for your blog posts.
              </p>
            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
              {categories.length}
            </span>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-gray-500">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-10 text-center">
              <MdOutlineArticle
                size={36}
                className="mx-auto mb-3 text-gray-300"
              />
              <p className="font-semibold text-gray-700">No Categories Found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="bg-gray-200 text-sm uppercase">
                  <tr>
                    <th className="w-20 px-4 py-3 text-center">S.N.</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {categories.map((category, index) => (
                    <tr
                      key={category._id}
                      className="border-b border-gray-200 transition-colors hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-center">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      <td className="px-4 py-3 font-medium text-gray-800">
                        {category.name}
                      </td>

                      <td className="px-4 py-3 text-gray-500">
                        {category.slug}
                      </td>

                      <td className="px-4 py-3">
                        <div className="mx-auto flex w-fit gap-2">
                          <button
                            type="button"
                            title="Edit"
                            onClick={() => openEditModal(category)}
                            className="flex cursor-pointer items-center justify-center border-2 border-purple-800 p-1 text-lg text-purple-800 transition hover:bg-purple-100"
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            title="Delete"
                            onClick={() => setCategoryToDelete(category)}
                            className="flex cursor-pointer items-center justify-center border-2 border-red-800 p-1 text-lg text-red-800 transition hover:bg-red-100"
                          >
                            <RiDeleteBin7Line />
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
      </section>

      {editingCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Edit Category</h2>

              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                disabled={saving}
                className="text-gray-500 transition hover:text-gray-800"
                aria-label="Close edit modal"
              >
                <MdClose size={23} />
              </button>
            </div>

            <form onSubmit={handleEditCategory}>
              <label
                htmlFor="edit-category-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category name
              </label>

              <input
                id="edit-category-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={80}
                required
                autoFocus
                className="form-input w-full"
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  disabled={saving}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || !editName.trim()}
                  className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationPopup
        show={Boolean(categoryToDelete)}
        onConfirm={confirmDelete}
        onCancel={() => {
          if (!deleting) setCategoryToDelete(null);
        }}
        title="Confirm Deletion"
        message={
          categoryToDelete
            ? `Are you sure you want to delete "${categoryToDelete.name}"? Categories assigned to existing blogs cannot be deleted.`
            : "Are you sure you want to delete this category?"
        }
        loading={deleting}
        confirmText="Yes, Delete"
        loadingText="Deleting..."
      />
    </>
  );
}
