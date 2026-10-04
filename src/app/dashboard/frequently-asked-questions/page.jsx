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
import { useFetchDeleteAPI, useFetchGetAPI } from "@/utility/custom-hooks";

export default function FAQsPage() {

    const { fetchGetAPI, dataList, fetchingData, query, setQuery, extra } = useFetchGetAPI();
    const { handleDeleteClick, cancelDelete, showDeletePopup, fetchDeleteAPI, deletingData } = useFetchDeleteAPI();

    useEffect(() => {
        fetchGetAPI(API_ENDPOINTS.FETCH_FAQS);
    }, [query]);

    async function confirmDelete() {
        fetchDeleteAPI(API_ENDPOINTS.DELETE_FAQ, () => { fetchGetAPI(API_ENDPOINTS.FETCH_FAQS) });
    }

    return (
        <>
            <section>

                <div className="grid grid-cols-10 gap-4 mb-10">

                    <div className={`col-span-10 sm:col-span-6 md:col-span-7 lg:col-span-8`}>

                        <input
                            type="text"
                            placeholder="Search here..."
                            value={query.searchValue}
                            onChange={(e) => setQuery({ ...query, searchValue: e.target.value, page: 1 })}
                            className="form-input"
                        />

                    </div>

                    < div className="col-span-10 sm:col-span-4 md:col-span-3 lg:col-span-2">

                        <Link href="/dashboard/frequently-asked-questions/create" className={`w-full flex justify-center items-center px-6 py-2.5 rounded-md bg-primary text-white hover:opacity-90 transition-opacity duration-200 xl:text-base`}>

                            <div className="flex gap-1 items-center justify-center">
                                <span><MdAdd /></span><span>Add FAQ</span>
                            </div>

                        </Link>

                    </div>

                </div>

                {fetchingData ? <LoadingComponent message="Loading FAQs..." /> : null}

                {dataList?.length === 0 && !fetchingData ? <NoDataComponent message="No FAQs found" /> : null}

                <div className="hidden lg:block">

                    {dataList?.length && !fetchingData ?

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
                                                <span>S.N.</span><span className="text-xs"> {query.sortKey === "sno" ? (query.sortOrder === "-1" ? "▼" : query.sortOrder === "1" ? "▲" : <span className="flex flex-col justify-center items-center gap-0"><span>▲</span><span>▼</span></span>) : <span className="flex flex-col justify-center items-center"><span>▲</span><span>▼</span></span>}</span>
                                            </button>
                                        </div>

                                    </th>
                                    <th className="px-4 py-2">Page</th>
                                    <th className="px-4 py-2">Question</th>
                                    <th className="px-4 py-2">Answer</th>
                                    <th className="px-4 py-2 ">

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
                                                <span>DATE & TIME</span><span className="text-xs"> {query.sortKey === "createdAt" ? (query.sortOrder === "-1" ? "▼" : query.sortOrder === "1" ? "▲" : <span className="flex flex-col justify-center items-center gap-0"><span>▲</span><span>▼</span></span>) : <span className="flex flex-col justify-center items-center"><span>▲</span><span>▼</span></span>}</span>
                                            </button>
                                        </div>

                                    </th>
                                    <th className="px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm">

                                {dataList.map((faq) => (

                                    <tr key={faq._id} className="hover:bg-gray-50 transition-colors duration-200 border-b-1 border-gray-400">

                                        <td className={`px-4 py-3 text-center ${query.sortKey === "sno" ? "bg-gray-100" : ""}`}>{faq.sno < 10 ? "0" + faq.sno : faq.sno}</td>
                                        <td className="px-4 py-3">{faq.page || "N/A"}</td>
                                        <td className="px-4 py-3">{faq.question || "N/A"}</td>
                                        <td className="px-4 py-3">{faq.answer || "N/A"}</td>
                                        <td className={`px-4 py-3 text-center ${query.sortKey === "createdAt" ? "bg-gray-100" : ""}`}>{formatDateTime(faq.createdAt)}</td>

                                        <td className="px-4 py-3 align-middle text-center">

                                            <div className="grid grid-cols-2 gap-2 mx-auto w-fit">

                                                <Link href={`/dashboard/frequently-asked-questions/${faq._id}`} className="flex items-center justify-center text-lg text-purple-800 border-2 border-purple-800 p-1 hover:bg-purple-200  cursor-pointer" title="Edit">
                                                    <FaEdit />
                                                </Link>

                                                <button title="Delete" onClick={() => handleDeleteClick(faq._id)} className="flex items-center justify-center text-lg text-red-800 border-2 border-red-800 p-1 hover:bg-red-200 cursor-pointer" >
                                                    <RiDeleteBin7Line />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table > : null}

                </div>

                <div className="lg:hidden">

                    {dataList?.length && !fetchingData ?

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                            {dataList?.map((faq, index) => {

                                return (
                                    <div key={faq._id || index} className="border rounded-md border-gray-300 p-5 flex flex-col justify-between">

                                        <div>
                                            <h2 className="font-semibold text-xl">S.N: {faq.sno < 10 ? "0" + faq.sno : faq.sno}</h2>
                                            <p className="text-gray-600"><span className="font-semibold text-black">Page:</span> {faq?.page || "N/A"}</p>
                                            <p className="text-gray-600"><span className="font-semibold text-black">Question:</span> {faq?.question || "N/A"}</p>
                                            <p className="text-gray-600"><span className="font-semibold text-black">Answer:</span> {faq?.answer || "N/A"}</p>
                                            <p className="text-gray-600"><span className="font-semibold text-black">Date & Time:</span> {formatDateTime(faq?.createdAt)}</p>
                                        </div>

                                        <div className="flex justify-end">

                                            <div className={`flex gap-2 mt-4`}>

                                                <div className="col-span-2" />

                                                <Link href={`/dashboard/frequently-asked-questions/${faq?._id}`} className="flex items-center justify-center text-lg text-purple-800 border-2 border-purple-800 p-1 hover:bg-purple-200  cursor-pointer" title="Edit">
                                                    <FaEdit />
                                                </Link>

                                                <button
                                                    className="flex items-center justify-center text-lg text-red-800 border-2 border-red-800 p-1 hover:bg-red-200 cursor-pointer"
                                                    title="Delete"
                                                    onClick={() => handleDeleteClick(faq._id)}
                                                >
                                                    <RiDeleteBin7Line />
                                                </button>

                                            </div>

                                        </div>

                                    </div>
                                )

                            })}

                        </div> : null}

                </div>

                {dataList?.length && !fetchingData ? <PaginationSection query={query} setQuery={setQuery} extra={extra} loading={fetchingData} > </PaginationSection> : null}

            </section >

            <ConfirmationPopup show={showDeletePopup} onConfirm={confirmDelete} onCancel={cancelDelete} title="Confirm Deletion" message="Are you sure you want to delete this FAQ?" loading={deletingData} confirmText="Yes, Delete" loadingText="Deleting..." />
        </>
    );
};