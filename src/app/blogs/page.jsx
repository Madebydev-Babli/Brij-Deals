'use client';

import WebsiteLayout from "@/client-components/WebsiteLayout";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import { useEffect } from "react";
import { useFetchGetAPI } from "@/utility/custom-hooks";
import { API_ENDPOINTS } from "@/utility/constants";
import LoadingComponent from "@/server-components/LoadingComponent";
import NoDataComponent from "@/server-components/NoDataComponent";

export default function Page() {

    const {
        fetchGetAPI,
        dataList,
        fetchingData,
        query,
        setQuery
    } = useFetchGetAPI();

    useEffect(() => {
        fetchGetAPI(
            API_ENDPOINTS.FETCH_BLOGS,
            {
                page: 1,
                limit: 100000,
                sortKey: "createdAt",
                sortOrder: "-1"
            },
            false
        );
    }, []);

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

                                    <span className="text-primary font-semibold">
                                        Blogs
                                    </span>

                                </li>

                            </ol>

                        </nav>
                    </div>

                    {/* Heading */}
                    <div className="max-w-2xl">

                        <h1 className="text-3xl lg:text-4xl font-bold font-cormorant-garamond text-gray-900 mb-1.5 lg:mb-2">
                            Explore Our Blogs
                        </h1>

                        <p className="text-gray-600 font-nunito text-sm lg:text-base leading-relaxed">
                            Discover stories, travel guides, local experiences, culture,
                            food, and everything that makes Braj special.
                        </p>

                    </div>

                </div>

            </section>


            {/* Blogs */}
            <section className="min-h-screen py-12">

                <div className="px-5 sm:px-10 max-w-[1370px] mx-auto">

                    {fetchingData ? (

                        <LoadingComponent />

                    ) : dataList?.length ? (

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

                            {dataList.map((blog) => (

                                <article
                                    key={blog._id}
                                    className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                                >

                                    {/* Image */}
                                    <Link href={`/blogs/${blog.slug}`}>

                                        <div className="relative h-[240px] overflow-hidden">

                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />

                                            <div className="absolute top-4 left-4">

                                                <span className="px-3 py-1.5 rounded-full bg-white/95 text-primary text-xs font-semibold font-nunito">
                                                    {blog.category}
                                                </span>

                                            </div>

                                        </div>

                                    </Link>


                                    {/* Content */}
                                    <div className="p-5">

                                        <div className="flex items-center justify-between gap-3 mb-3">

                                            <span className="text-xs text-gray-500 font-nunito">
                                                {blog.date}
                                            </span>

                                            <span className="text-xs text-gray-500 font-nunito">
                                                By {blog.author}
                                            </span>

                                        </div>


                                        <Link href={`/blogs/${blog.slug}`}>

                                            <h2 className="text-xl font-bold font-cormorant-garamond text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                                                {blog.title}
                                            </h2>

                                        </Link>


                                        <p className="mt-3 text-sm text-gray-600 font-nunito leading-relaxed line-clamp-3">
                                            {blog.description}
                                        </p>


                                        <Link
                                            href={`/blogs/${blog.slug}`}
                                            className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-primary font-nunito hover:gap-3 transition-all"
                                        >
                                            Read More
                                            <FaChevronRight size={11} />
                                        </Link>

                                    </div>

                                </article>

                            ))}

                        </div>

                    ) : (

                        <NoDataComponent />

                    )}

                </div>

            </section>

        </WebsiteLayout>
    );
}