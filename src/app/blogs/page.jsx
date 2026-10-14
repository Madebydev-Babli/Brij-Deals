"use client";

import WebsiteLayout from "@/client-components/WebsiteLayout";
import Link from "next/link";
import { FaChevronDown, FaFilter, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useFetchGetAPI } from "@/utility/custom-hooks";
import { API_ENDPOINTS } from "@/utility/constants";
import CardLayout from "@/server-components/CardsLayout";

export default function Page() {
  const { fetchGetAPI, dataList, fetchingData, query, setQuery } =
    useFetchGetAPI();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(API_ENDPOINTS.FETCH_BLOG_CATEGORIES.path, {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || result.status !== "success") {
          throw new Error(result.message || "Failed to fetch categories");
        }

        setCategories(result.data || []);
      } catch (error) {
        console.error("Failed to fetch blog categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchGetAPI(
      API_ENDPOINTS.FETCH_BLOGS,
      {
        ...query,
        page: 1,
        limit: 100000,
        sortKey: "sno",
        sortOrder: "1",
      },
      false,
    );
  }, [query]);

  return (
    <WebsiteLayout>
      {/* Header */}
      <section className="bg-primary/20">
        <div className="px-5 sm:px-10 max-w-[1370px] mx-auto py-10 mb-10">
          {/* Breadcrumbs */}
          <div className="mb-5">
            <nav aria-label="breadcrumb" className="w-full">
              <ol className="flex items-center gap-2 text-sm text-gray-500 font-nunito overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
                <li className="flex items-center gap-2">
                  <Link
                    href="/"
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
                      />
                    </svg>
                    Home
                  </Link>

                  <span className="text-gray-400">/</span>

                  <span className="text-primary font-semibold">Blogs</span>
                </li>
              </ol>
            </nav>
          </div>

          {/* Heading */}

          {/* Title, Description & Filters Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:items-end justify-between w-full">
            {/* Blog Heading */}
            <div className="grid max-w-xl">
              <h1 className="text-3xl lg:text-4xl font-bold font-cormorant-garamond text-gray-900 mb-2">
                Explore Our Blogs
              </h1>

              <p className="text-gray-600 font-nunito text-sm lg:text-base leading-relaxed">
                Discover travel guides, sacred places, local culture, and
                helpful tips for exploring Mathura, Vrindavan, and Braj Bhumi.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Search */}
              <div className="relative border border-gray-400 rounded-lg bg-white">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />

                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={query.searchValue || ""}
                  onChange={(e) =>
                    setQuery({
                      ...query,
                      searchValue: e.target.value,
                      page: 1,
                    })
                  }
                  className="w-full bg-transparent text-gray-800 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/60 font-nunito"
                />
              </div>

              {/* Category */}
              <div className="relative border border-gray-400 rounded-lg bg-white">
                <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />

                <select
                  value={query.category || ""}
                  onChange={(e) =>
                    setQuery({
                      ...query,
                      category: e.target.value,
                      page: 1,
                    })
                  }
                  className="w-full appearance-none bg-transparent text-gray-700 text-sm rounded-lg pl-10 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-nunito cursor-pointer"
                >
                  <option value="">
                    {loadingCategories
                      ? "Loading categories..."
                      : "All Categories"}
                  </option>

                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blogs */}
      <section className="min-h-screen">
        <CardLayout
          dataList={dataList}
          loading={fetchingData}
          callBackUrl="/blogs/"
          type="blog"
        />
      </section>
    </WebsiteLayout>
  );
}
