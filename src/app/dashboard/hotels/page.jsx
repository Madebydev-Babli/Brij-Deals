"use client"

import { useEffect } from "react";
import { RiDeleteBin7Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";
import LoadingComponent from "@/server-components/LoadingComponent";
import NoDataComponent from "@/server-components/NoDataComponent";
import PaginationSection from "@/server-components/PaginationSection";
import ConfirmationPopup from "@/server-components/ConfirmationPopup";
import { API_ENDPOINTS } from "@/utility/constants";
import { MdAdd } from "react-icons/md";
import { formatDateTime } from "@/utility/utility-function";
import { LOCATION_ENUM } from "@/utility/utility-data";
import { useFetchDeleteAPI, useFetchGetAPI } from "@/utility/custom-hooks";

export default function HotelsPage() {
    const { fetchGetAPI, dataList, fetchingData, query, setQuery, extra } = useFetchGetAPI();
    const { handleDeleteClick, cancelDelete, showDeletePopup, fetchDeleteAPI, deletingData } = useFetchDeleteAPI();

    useEffect(() => {
        fetchGetAPI(API_ENDPOINTS.FETCH_HOTELS);
    }, [query]);

    async function confirmDelete() {
        fetchDeleteAPI(API_ENDPOINTS.DELETE_HOTEL, () => {
            fetchGetAPI(API_ENDPOINTS.FETCH_HOTELS);
        });
    }

    return (
        <>
            <section>
                <div className="grid grid-cols-2 sm:grid-cols-12 gap-4 mb-10">
                    <div className="col-span-2 sm:col-span-12 lg:col-span-8">
                        <input
                            type="text"
                            placeholder="Search hotels..."
                            value={query.searchValue}
                            onChange={(e) => setQuery({ ...query, searchValue: e.target.value, page: 1 })}
                            className="form-input"
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-6 lg:col-span-2">
                        <select
                            className="form-input"
                            value={query.shortLocation || ""}
                            onChange={(e) => {
                                setQuery({ ...query, shortLocation: e.target.value, page: 1 });
                            }}
                        >
                            <option value="">All Locations</option>
                            {LOCATION_ENUM?.map((location) => (
                                <option key={location} value={location}>{location}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-2 sm:col-span-6 lg:col-span-2">
                        <Link
                            href="/dashboard/hotels/create"
                            className="w-full flex justify-center items-center px-6 py-2.5 rounded-md bg-primary text-white hover:opacity-90 transition-opacity duration-200 xl:text-base"
                        >
                            <div className="flex gap-1 items-center justify-center">
                                <span><MdAdd /></span><span>Add Hotel</span>
                            </div>
                        </Link>
                    </div>
                </div>

                {fetchingData ? <LoadingComponent message="Loading Hotels..." /> : null}
                {dataList?.length === 0 && !fetchingData ? <NoDataComponent message="No Hotels Found" /> : null}

                <div className="hidden lg:block">
                    {dataList?.length && !fetchingData ? (
                        <table className="text-left border-collapse mb-5 w-full">
                            <thead className="bg-gray-200 text-sm uppercase">
                                <tr>
                                    <th className="px-4 py-2 w-5">
                                        <div className="flex justify-center">
                                            <button
                                                className="flex gap-1 items-center cursor-pointer"
                                                onClick={() => {
                                                    if (query.sortKey !== "sno") {
                                                        setQuery((prev) => ({ ...prev, sortKey: "sno", sortOrder: "-1" }));
                                                    } else if (query.sortKey === "sno" && query.sortOrder === "-1") {
                                                        setQuery((prev) => ({ ...prev, sortOrder: "1" }));
                                                    } else {
                                                        setQuery((prev) => ({ ...prev, sortKey: null, sortOrder: null }));
                                                    }
                                                    setQuery((prev) => ({ ...prev, page: 1 }));
                                                }}
                                                title="Sort by Serial Number"
                                            >
                                                <span>S.N.</span>
                                                <span className="text-xs">
                                                    {query.sortKey === "sno"
                                                        ? (query.sortOrder === "-1" ? "▼" : query.sortOrder === "1" ? "▲" : <span className="flex flex-col justify-center items-center gap-0"><span>▲</span><span>▼</span></span>)
                                                        : <span className="flex flex-col justify-center items-center"><span>▲</span><span>▼</span></span>}
                                                </span>
                                            </button>
                                        </div>
                                    </th>
                                    <th className="px-4 py-2">Hotel</th>
                                    <th className="px-4 py-2">Location</th>
                                    <th className="px-4 py-2"> Price</th>
                                    <th className="px-4 py-2">Rating</th>
                                    <th className="px-4 py-2">Contact</th>
                                    <th className="px-4 py-2">
                                        <div className="flex justify-center">
                                            <button
                                                className="flex gap-1 items-center cursor-pointer"
                                                onClick={() => {
                                                    if (query.sortKey !== "createdAt") {
                                                        setQuery((prev) => ({ ...prev, sortKey: "createdAt", sortOrder: "-1" }));
                                                    } else if (query.sortKey === "createdAt" && query.sortOrder === "-1") {
                                                        setQuery((prev) => ({ ...prev, sortOrder: "1" }));
                                                    } else {
                                                        setQuery((prev) => ({ ...prev, sortKey: null, sortOrder: null }));
                                                    }
                                                    setQuery((prev) => ({ ...prev, page: 1 }));
                                                }}
                                                title="Sort by Time"
                                            >
                                                <span>DATE & TIME</span>
                                                <span className="text-xs">
                                                    {query.sortKey === "createdAt"
                                                        ? (query.sortOrder === "-1" ? "▼" : query.sortOrder === "1" ? "▲" : <span className="flex flex-col justify-center items-center gap-0"><span>▲</span><span>▼</span></span>)
                                                        : <span className="flex flex-col justify-center items-center"><span>▲</span><span>▼</span></span>}
                                                </span>
                                            </button>
                                        </div>
                                    </th>
                                    <th className="px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm">
                                {dataList.map((hotel) => (
                                    <tr key={hotel._id} className="hover:bg-gray-50 transition-colors duration-200 border-b-1 border-gray-400">
                                        <td className={`px-4 py-3 text-center ${query.sortKey === "sno" ? "bg-gray-100" : ""}`}>
                                            {hotel.sno < 10 ? `0${hotel.sno}` : hotel.sno}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {(hotel?.logo?.url || hotel?.image?.url) && (
                                                    <img
                                                        src={hotel.logo?.url || hotel.image?.url}
                                                        alt={hotel.title}
                                                        className="w-12 h-12 object-cover rounded-md"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-800">{hotel.title || "N/A"}</p>
                                                    <p className="text-xs text-gray-500">{hotel.shortLocation || "N/A"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{hotel.location || "N/A"}</td>
                                        <td className="px-4 py-3">₹{hotel.startingPrice || "N/A"}</td>
                                        <td className="px-4 py-3">{hotel.rating ? `${hotel.rating} / 5` : "N/A"}</td>
                                        <td className="px-4 py-3">
                                            <p>{hotel.phone || "N/A"}</p>
                                            {hotel.email ? <p className="text-xs text-gray-500">{hotel.email}</p> : null}
                                        </td>
                                        <td className={`px-4 py-3 text-center ${query.sortKey === "createdAt" ? "bg-gray-100" : ""}`}>
                                            {formatDateTime(hotel.createdAt)}
                                        </td>
                                        <td className="px-4 py-3 align-middle text-center">
                                            <div className="grid grid-cols-2 gap-2 mx-auto w-fit">
                                                <Link
                                                    href={`/dashboard/hotels/${hotel._id}`}
                                                    className="flex items-center justify-center text-lg text-purple-800 border-2 border-purple-800 p-1 hover:bg-purple-200 cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </Link>
                                                <button
                                                    title="Delete"
                                                    onClick={() => handleDeleteClick(hotel._id)}
                                                    className="flex items-center justify-center text-lg text-red-800 border-2 border-red-800 p-1 hover:bg-red-200 cursor-pointer"
                                                >
                                                    <RiDeleteBin7Line />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : null}
                </div>

                <div className="lg:hidden">
                    {dataList?.length && !fetchingData ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {dataList.map((hotel, index) => (
                                <div key={hotel._id || index} className="border rounded-md border-gray-300 p-5 flex flex-col justify-between">
                                    <div>
                                        {(hotel?.logo?.url || hotel?.image?.url) && (
                                            <img src={hotel.logo?.url || hotel.image?.url} alt={hotel.title} className="w-full h-auto mb-4 rounded-md" />
                                        )}
                                        <h2 className="font-semibold text-xl">S.N: {hotel.sno < 10 ? `0${hotel.sno}` : hotel.sno}</h2>
                                        <p className="text-gray-600"><span className="font-semibold text-black">Hotel:</span> {hotel?.title || "N/A"}</p>
                                        <p className="text-gray-600"><span className="font-semibold text-black">Location:</span> {hotel?.location || "N/A"}</p>
                                        <p className="text-gray-600"><span className="font-semibold text-black">Starting Price:</span> ₹{hotel?.startingPrice || "N/A"}</p>
                                        <p className="text-gray-600"><span className="font-semibold text-black">Rating:</span> {hotel?.rating ? `${hotel.rating} / 5` : "N/A"}</p>
                                        <p className="text-gray-600"><span className="font-semibold text-black">Contact:</span> {hotel?.phone || "N/A"}</p>
                                        <p className="text-gray-600"><span className="font-semibold text-black">Date & Time:</span> {formatDateTime(hotel?.createdAt)}</p>
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="flex gap-2 mt-4">
                                            <Link
                                                href={`/dashboard/hotels/${hotel._id}`}
                                                className="flex items-center justify-center text-lg text-purple-800 border-2 border-purple-800 p-1 hover:bg-purple-200 cursor-pointer"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                className="flex items-center justify-center text-lg text-red-800 border-2 border-red-800 p-1 hover:bg-red-200 cursor-pointer"
                                                title="Delete"
                                                onClick={() => handleDeleteClick(hotel._id)}
                                            >
                                                <RiDeleteBin7Line />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>

                {dataList?.length && !fetchingData ? <PaginationSection query={query} setQuery={setQuery} extra={extra} loading={fetchingData} /> : null}
            </section>

            <ConfirmationPopup
                show={showDeletePopup}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this hotel?"
                loading={deletingData}
                confirmText="Yes, Delete"
                loadingText="Deleting..."
            />
        </>
    );
}

