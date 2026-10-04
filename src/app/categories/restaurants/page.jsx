'use client'

import WebsiteLayout from "@/client-components/WebsiteLayout";
import Link from "next/link";
import { FaChevronDown, FaFilter, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { LOCATION_ENUM, RESTAURANT_CATEGORIES_ENUM } from "@/utility/utility-data";
import CardLayout from "@/server-components/CardsLayout";
import { useEffect } from "react";
import { useFetchGetAPI } from "@/utility/custom-hooks";
import { API_ENDPOINTS } from "@/utility/constants";

export default function Page() {

    const { fetchGetAPI, dataList, fetchingData, query, setQuery, extra } = useFetchGetAPI();

    useEffect(() => {
        fetchGetAPI(API_ENDPOINTS.FETCH_RESTAURENTS, { ...query, page: 1, limit: 100000 }, false);
    }, [query]);

    return (
        <>
            <WebsiteLayout>

                <section className="bg-primary/20">

                    <div className="px-5 sm:px-10 max-w-[1370px] mx-auto py-10 mb-10">

                        {/* Breadcrumbs */}
                        <div className="mb-5">
                            <nav aria-label="breadcrumb" className="w-full">
                                <ol className="flex items-center gap-2 text-sm text-gray-500 font-nunito overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
                                    {[{ route: "/", label: "Home" }, { route: "/categories/restaurants", label: "Restaurants" }].map((item, index) => {
                                        const isFirst = index === 0;
                                        const isLast = index === [{ route: "/", label: "Home" }, { route: "/categories/restaurants", label: "Restaurants" }].length - 1;
                                        const label = item.label || item.path || item.label;
                                        const isHome = label === 'Home';

                                        return (
                                            <li key={index} className="flex items-center gap-2">
                                                {!isFirst && <span className="text-gray-400">/</span>}

                                                {isLast ? (
                                                    <span className="text-primary font-semibold truncate flex items-center gap-1.5" aria-current="page">
                                                        {isHome && (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                            </svg>
                                                        )}
                                                        {label}
                                                    </span>
                                                ) : (
                                                    <Link href={item.route || '#'} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                                        {isHome && (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                            </svg>
                                                        )}
                                                        <span>{label}</span>
                                                    </Link>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ol>
                            </nav>
                        </div>

                        {/* Title, Description & Filters Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:items-end justify-between w-full">

                            {/* Text Content */}
                            <div className="grid max-w-xl">

                                <h1 className="text-3xl lg:text-4xl font-bold font-cormorant-garamond text-gray-900 mb-1.5 lg:mb-2">
                                    Restaurants & Dining
                                </h1>

                                <p className="text-gray-600 font-nunito text-sm lg:text-base leading-relaxed">
                                    Discover authentic pure veg food, famous sweets, and the best dining experiences around Mathura, Vrindavan, and Govardhan.
                                </p>

                            </div>

                            {/* Search & Filters */}
                            <div className={`grid grid-cols-12 gap-3`}>

                                <div className="col-span-12 sm:col-span-4 relative border border-gray-400 rounded-lg bg-white transition-all">

                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />

                                    <input type="text" placeholder="Search here..." className="w-full bg-transparent text-gray-800 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/60 font-nunito" onChange={(e) => setQuery({ ...query, searchValue: e.target.value, page: 1 })} />

                                </div>

                                <div className={`col-span-6 sm:col-span-4 relative border border-gray-400 rounded-lg bg-white transition-all`}>

                                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={14} />

                                    <select className="w-full appearance-none bg-transparent text-gray-700 text-sm rounded-lg pl-10 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-nunito cursor-pointer" onChange={(e) => { setQuery({ ...query, shortLocation: e.target.value, page: 1 }); }}>

                                        <option value="">All Locations</option>
                                        {LOCATION_ENUM?.map((shortLocation) => (<option key={shortLocation} value={shortLocation}>{shortLocation}</option>))}

                                    </select>

                                    <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-3 h-3" />

                                </div>

                                <div className={`col-span-6 sm:col-span-4 relative border border-gray-400 rounded-lg bg-white transition-all`}>

                                    <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={14} />

                                    <select className="w-full appearance-none bg-transparent text-gray-700 text-sm rounded-lg pl-10 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-nunito cursor-pointer" onChange={(e) => { setQuery({ ...query, category: e.target.value, page: 1 }); }}>

                                        <option value="">All Categories</option>
                                        {RESTAURANT_CATEGORIES_ENUM?.map((category) => (<option key={category} value={category}>{category}</option>))}

                                    </select>

                                    <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-3 h-3" />

                                </div>

                            </div>

                        </div>

                    </div>

                </section >

                <section className="min-h-screen">

                    <CardLayout dataList={dataList} loading={fetchingData} callBackUrl={"/categories/restaurants/"} />

                </section>

            </WebsiteLayout>
        </>
    );
}