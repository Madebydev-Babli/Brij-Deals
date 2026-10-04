"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MdAdd, MdEdit, MdDelete, MdLocationOn } from "react-icons/md";

import LoadingComponent from "@/server-components/LoadingComponent";
import NoDataComponent from "@/server-components/NoDataComponent";
import PaginationSection from "@/server-components/PaginationSection";
import ConfirmationPopup from "@/server-components/ConfirmationPopup";

import { API_ENDPOINTS } from "@/utility/constants";
import { useFetchDeleteAPI, useFetchGetAPI } from "@/utility/custom-hooks";

export default function PlacesPage() {
    const {
        fetchGetAPI,
        dataList,
        fetchingData,
        query,
        setQuery,
        extra,
    } = useFetchGetAPI();

    const {
        handleDeleteClick,
        cancelDelete,
        showDeletePopup,
        fetchDeleteAPI,
        deletingData,
    } = useFetchDeleteAPI();

    useEffect(() => {
        fetchGetAPI(API_ENDPOINTS.FETCH_PLACES);
    }, [query]);

    function handleSearch(e) {
        setQuery((prev) => ({
            ...prev,
            searchValue: e.target.value,
            page: 1,
        }));
    }

    function handleDelete() {
        fetchDeleteAPI(
            API_ENDPOINTS.DELETE_PLACE,
            () => fetchGetAPI(API_ENDPOINTS.FETCH_PLACES)
        );
    }

    return (
        <section className="space-y-5">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Places to Visit
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage places, temples and tourist attractions.
                    </p>
                </div>

                <Link
                    href="/dashboard/places/create"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                    <MdAdd size={22} />
                    Add Place
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Places
                    </label>

                    <input
                        type="text"
                        value={query.searchValue}
                        onChange={handleSearch}
                        placeholder="Search by title, description or location..."
                        className="form-input"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

                {fetchingData ? (
                    <LoadingComponent />
                ) : dataList?.length ? (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="text-left px-5 py-4 text-sm font-semibold text-gray-700">
                                            S.No
                                        </th>

                                        <th className="text-left px-5 py-4 text-sm font-semibold text-gray-700">
                                            Place
                                        </th>

                                        <th className="text-left px-5 py-4 text-sm font-semibold text-gray-700">
                                            Location
                                        </th>

                                        <th className="text-left px-5 py-4 text-sm font-semibold text-gray-700">
                                            Timings
                                        </th>

                                        <th className="text-right px-5 py-4 text-sm font-semibold text-gray-700">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {dataList.map((place) => (
                                        <tr
                                            key={place._id}
                                            className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition"
                                        >
                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {place.sno}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">

                                                    {place.image?.url ? (
                                                        <img
                                                            src={place.image.url}
                                                            alt={place.title}
                                                            className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                                                            <MdLocationOn
                                                                size={24}
                                                                className="text-gray-400"
                                                            />
                                                        </div>
                                                    )}

                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">
                                                            {place.title}
                                                        </h3>

                                                        <p className="text-xs text-gray-400 mt-1">
                                                            /{place.slug}
                                                        </p>
                                                    </div>

                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                    <MdLocationOn
                                                        size={18}
                                                        className="text-primary"
                                                    />

                                                    <span>
                                                        {place.location}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="text-sm text-gray-600">
                                                    <p>
                                                        <span className="font-medium">
                                                            Open:
                                                        </span>{" "}
                                                        {place.openingTime}
                                                    </p>

                                                    <p className="mt-1">
                                                        <span className="font-medium">
                                                            Close:
                                                        </span>{" "}
                                                        {place.closingTime}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex justify-end items-center gap-2">

                                                    <Link
                                                        href={`/dashboard/places/${place._id}`}
                                                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                                                        title="Edit Place"
                                                    >
                                                        <MdEdit size={20} />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                place._id
                                                            )
                                                        }
                                                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer"
                                                        title="Delete Place"
                                                    >
                                                        <MdDelete size={20} />
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-100">

                            {dataList.map((place) => (
                                <div
                                    key={place._id}
                                    className="p-4"
                                >
                                    <div className="flex gap-3">

                                        {place.image?.url ? (
                                            <img
                                                src={place.image.url}
                                                alt={place.title}
                                                className="w-20 h-20 rounded-xl object-cover border border-gray-200 shrink-0"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                                                <MdLocationOn
                                                    size={28}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0">

                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {place.title}
                                                    </h3>

                                                    <p className="text-xs text-gray-400 mt-1">
                                                        #{place.sno}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-1 shrink-0">
                                                    <Link
                                                        href={`/dashboard/places/${place._id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <MdEdit size={19} />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                place._id
                                                            )
                                                        }
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                                    >
                                                        <MdDelete size={19} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                                                <MdLocationOn
                                                    size={17}
                                                    className="text-primary shrink-0"
                                                />

                                                <span className="truncate">
                                                    {place.location}
                                                </span>
                                            </div>

                                            <p className="text-xs text-gray-500 mt-2">
                                                {place.openingTime} -{" "}
                                                {place.closingTime}
                                            </p>

                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>

                        {/* Pagination */}
                        {dataList?.length && extra?.totalPages > 1 ? (
                            <PaginationSection
                                query={query}
                                setQuery={setQuery}
                                extra={extra}
                                loading={fetchingData}
                            />
                        ) : null}
                    </>
                ) : (
                    <NoDataComponent />
                )}

            </div>

            {/* Delete Confirmation */}
            {showDeletePopup && (
                <ConfirmationPopup
                    title="Delete Place"
                    message="Are you sure you want to delete this place? This action cannot be undone."
                    onConfirm={handleDelete}
                    onCancel={cancelDelete}
                    loading={deletingData}
                />
            )}

        </section>
    );
}