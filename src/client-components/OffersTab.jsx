"use client"

import { useState, useEffect } from "react";
import { RiDeleteBin7Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import LoadingComponent from "@/server-components/LoadingComponent";
import NoDataComponent from "@/server-components/NoDataComponent";
import PaginationSection from "@/server-components/PaginationSection";
import ConfirmationPopup from "@/server-components/ConfirmationPopup";
import { API_ENDPOINTS } from "@/utility/constants";
import { MdAdd } from "react-icons/md";
import { formatDateTime, handleInputChange } from "@/utility/utility-function";
import { useFetchDeleteAPI, useFetchDetailsAPI, useFetchGetAPI, useFetchPostAPI } from "@/utility/custom-hooks";

export function OffersTab({ restaurentId }) {

    const [activeView, setActiveView] = useState('list');
    const [editDataId, setEditDataId] = useState(null);

    return (
        <>

            {activeView === "list" && <OffersListing restaurentId={restaurentId} setActiveView={setActiveView} setEditDataId={setEditDataId} />}
            {activeView === "add" && <AddNewOffer restaurentId={restaurentId} setActiveView={setActiveView} />}
            {activeView === "edit" && <UpdateOffer restaurentId={restaurentId} setActiveView={setActiveView} editDataId={editDataId} />}

        </>
    );
};

export function OffersListing({ restaurentId, setActiveView, setEditDataId }) {

    const { fetchGetAPI, dataList, fetchingData, query, setQuery, extra } = useFetchGetAPI();
    const { handleDeleteClick, cancelDelete, showDeletePopup, fetchDeleteAPI, deletingData } = useFetchDeleteAPI();

    useEffect(() => {
        fetchGetAPI(API_ENDPOINTS.FETCH_OFFERS, { restaurentId });
    }, [query]);

    async function confirmDelete() {
        fetchDeleteAPI(API_ENDPOINTS.DELETE_OFFER, () => { fetchGetAPI(API_ENDPOINTS.FETCH_OFFERS) });
    }

    return (
        <>
            <section>

                <div className="grid grid-cols-12 gap-4 mb-10">

                    <div className="col-span-12 sm:col-span-8 md:col-span-9 xl:col-span-10">

                        <input type="text" placeholder="Search here..." value={query.searchValue} onChange={(e) => setQuery({ ...query, searchValue: e.target.value, page: 1 })} className="form-input" />

                    </div>

                    <div className="col-span-12 sm:col-span-4 md:col-span-3 xl:col-span-2">

                        <button onClick={() => { setActiveView("add") }} className={`cursor-pointer w-full flex justify-center items-center px-6 py-2.5 rounded-md bg-primary text-white hover:opacity-90 transition-opacity duration-200 xl:text-base`}>

                            <div className="flex gap-1 items-center justify-center">
                                <span><MdAdd /></span><span>Add Offer</span>
                            </div>

                        </button>

                    </div>

                </div>

                {fetchingData ? <LoadingComponent message="Loading Offers..." /> : null}

                {dataList?.length === 0 && !fetchingData ? <NoDataComponent message="No Offers Found" /> : null}

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
                                    <th className="px-4 py-2">Title</th>
                                    <th className="px-4 py-2">Description</th>
                                    <th className="px-4 py-2 ">

                                        <div className="flex justify-center">
                                            <button
                                                className="flex gap-1 items-center cursor-pointer"
                                                onClick={() => {

                                                    if (query.sortKey !== "endDate") {

                                                        setQuery((prev) => ({ ...prev, sortKey: "endDate", sortOrder: "-1" }));

                                                    } else if (query.sortKey === "endDate" && query.sortOrder === "-1") {

                                                        setQuery((prev) => ({ ...prev, sortOrder: "1" }));

                                                    } else {

                                                        setQuery((prev) => ({ ...prev, sortKey: null, sortOrder: null }));

                                                    }

                                                    setQuery((prev) => ({ ...prev, page: 1 }));

                                                }}

                                                title="Sort by Time"
                                            >
                                                <span>End Date</span><span className="text-xs"> {query.sortKey === "endDate" ? (query.sortOrder === "-1" ? "▼" : query.sortOrder === "1" ? "▲" : <span className="flex flex-col justify-center items-center gap-0"><span>▲</span><span>▼</span></span>) : <span className="flex flex-col justify-center items-center"><span>▲</span><span>▼</span></span>}</span>
                                            </button>
                                        </div>

                                    </th>
                                    <th className="px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm">

                                {dataList.map((restaurent) => (

                                    <tr key={restaurent._id} className="hover:bg-gray-50 transition-colors duration-200 border-b-1 border-gray-400">

                                        <td className={`px-4 py-3 text-center ${query.sortKey === "sno" ? "bg-gray-100" : ""}`}>{restaurent.sno < 10 ? "0" + restaurent.sno : restaurent.sno}</td>
                                        <td className="px-4 py-3">{restaurent.title || "N/A"}</td>
                                        <td className="px-4 py-3">{restaurent.description || "N/A"}</td>
                                        <td className={`px-4 py-3 text-center ${query.sortKey === "endDate" ? "bg-gray-100" : ""}`}>{formatDateTime(restaurent.endDate)}</td>

                                        <td className="px-4 py-3 align-middle text-center">

                                            <div className="grid grid-cols-2 gap-2 mx-auto w-fit">

                                                <button onClick={() => { setActiveView("edit"); setEditDataId(restaurent._id) }} className="cursor-pointer flex items-center justify-center text-lg text-purple-800 border-2 border-purple-800 p-1 hover:bg-purple-200 " title="Edit">
                                                    <FaEdit />
                                                </button>

                                                <button title="Delete" onClick={() => handleDeleteClick(restaurent._id)} className="cursor-pointer flex items-center justify-center text-lg text-red-800 border-2 border-red-800 p-1 hover:bg-red-200" >
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

                            {dataList?.map((restaurent, index) => {

                                return (
                                    <div key={restaurent._id || index} className="border rounded-md border-gray-300 p-5 flex flex-col justify-between">

                                        <div>
                                            {restaurent?.logo?.url && <img src={restaurent?.logo?.url} alt={restaurent.title} className="w-full h-auto mb-4 rounded-md" />}
                                            <h2 className="font-semibold text-xl">S.N: {restaurent.sno < 10 ? "0" + restaurent.sno : restaurent.sno}</h2>
                                            <p className="text-gray-600"><span className="font-semibold text-black">Title:</span> {restaurent?.title || "N/A"}</p>
                                            <p className="text-gray-600"><span className="font-semibold text-black">Description:</span> {restaurent?.description || "N/A"}</p>
                                            <p className="text-gray-600"><span className="font-semibold text-black">End Date:</span> {formatDateTime(restaurent?.endDate)}</p>
                                        </div>

                                        <div className="flex justify-end">

                                            <div className={`flex gap-2 mt-4`}>
                                                <button onClick={() => { setActiveView("edit"); setEditDataId(restaurent._id) }} className="cursor-pointer flex items-center justify-center text-lg text-purple-800 border-2 border-purple-800 p-1 hover:bg-purple-200 " title="Edit" >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    className="cursor-pointer flex items-center justify-center text-lg text-red-800 border-2 border-red-800 p-1 hover:bg-red-200"
                                                    title="Delete"
                                                    onClick={() => handleDeleteClick(restaurent._id)}
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

            <ConfirmationPopup show={showDeletePopup} onConfirm={confirmDelete} onCancel={cancelDelete} title="Confirm Deletion" message="Are you sure you want to delete this offer?" loading={deletingData} confirmText="Yes, Delete" loadingText="Deleting..." />
        </>
    );
};

export function AddNewOffer({ restaurentId, setActiveView }) {

    const { fetchPostAPI, postingData } = useFetchPostAPI();

    const [formData, setFormData] = useState({
        restaurentId: '',
        sno: '',
        title: '',
        description: '',
        endDate: ''
    });

    async function handleSubmit(e) {
        e.preventDefault();
        fetchPostAPI(API_ENDPOINTS.ADD_OFFER, { ...formData, restaurentId }, null, onSuccess);
    }

    function onSuccess() {
        setActiveView("list");
    }

    return (
        <section>

            <form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                    <div>
                        <label htmlFor="sno" className="form-label">S.No.</label>
                        <input placeholder="Enter the serial number" type="text" id="sno" name="sno" value={formData.sno} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                        <p className="gray-600 text-xs">Leave this field empty if you want to add the Restaurant in the last</p>
                    </div>

                    <div>
                        <label htmlFor="endDate" className="form-label">End Date</label>
                        <input placeholder="Enter the end date" type="date" id="endDate" name="endDate" value={formData.endDate} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                    </div>

                </div>

                <div className="mb-4">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input placeholder="Enter the restaurant title" type="text" id="title" name="title" value={formData.title} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                </div>

                <div className="mb-2">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea placeholder="Enter the description" id="description" name="description" value={formData.description} onChange={(e) => { handleInputChange(e, setFormData) }} rows="2" className="form-input"></textarea>
                </div>

                <div className="mt-6 flex gap-3">

                    <button onClick={() => setActiveView("list")} className="cursor-pointer px-5 py-2.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>

                    <button onClick={handleSubmit} disabled={postingData} className="cursor-pointer text-white px-4 py-2 rounded-md bg-primary hover:opacity-90">
                        {postingData ? 'Adding...' : 'Add Offer'}
                    </button>

                </div>

            </form>

        </section>
    );
}

export function UpdateOffer({ restaurentId, setActiveView, editDataId }) {

    const { fetchPostAPI, postingData } = useFetchPostAPI();
    const { fetchDetailsAPI, fetchingDetails } = useFetchDetailsAPI();

    const [formData, setFormData] = useState({
        restaurentId: '',
        sno: '',
        title: '',
        description: '',
        endDate: ''
    });

    async function handleSubmit(e) {
        e.preventDefault();
        fetchPostAPI(API_ENDPOINTS.ADD_OFFER, { ...formData, restaurentId }, null, onSuccess);
    }

    function onSuccess() {
        window.scrollTo(0, 0);
        setActiveView("list");
    }

    useEffect(() => {
        fetchDetailsAPI(API_ENDPOINTS.FETCH_OFFERS, editDataId, setFormData);
    }, [editDataId]);

    if (fetchingDetails) {
        return <LoadingComponent message="Loading Offer Details..." />;
    }

    return (
        <section>

            <form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                    <div>
                        <label htmlFor="sno" className="form-label">S.No.</label>
                        <input placeholder="Enter the serial number" type="text" id="sno" name="sno" value={formData.sno} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                        <p className="gray-600 text-xs">Leave this field empty if you want to add the Restaurant in the last</p>
                    </div>

                    <div>
                        <label htmlFor="endDate" className="form-label">End Date</label>
                        <input placeholder="Enter the end date" type="date" id="endDate" name="endDate" value={formData.endDate} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                    </div>

                </div>

                <div className="mb-4">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input placeholder="Enter the restaurant title" type="text" id="title" name="title" value={formData.title} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                </div>

                <div className="mb-2">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea placeholder="Enter the description" id="description" name="description" value={formData.description} onChange={(e) => { handleInputChange(e, setFormData) }} rows="2" className="form-input"></textarea>
                </div>

                <div className="mt-6 flex gap-3">

                    <button onClick={() => setActiveView("list")} className="cursor-pointer px-5 py-2.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>

                    <button onClick={handleSubmit} disabled={postingData} className="cursor-pointer text-white px-4 py-2 rounded-md bg-primary hover:opacity-90">
                        {postingData ? 'Updating...' : 'Update Offer'}
                    </button>

                </div>

            </form>

        </section>
    );
}