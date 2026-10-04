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
import { useFetchDeleteAPI, useFetchDetailsAPI, useFetchGetAPI, useFetchPostAPI } from "@/utility/custom-hooks";
import { handleInputChange } from "@/utility/utility-function";
import { RESTAURANT_AMENITIES_ENUM } from "@/utility/utility-data";

export function AmenitiesTab({ restaurentId }) {

    const [activeView, setActiveView] = useState('list');
    const [editDataId, setEditDataId] = useState(null);

    return (
        <>

            {activeView === "list" && <AmenitiesListing restaurentId={restaurentId} setActiveView={setActiveView} setEditDataId={setEditDataId} />}
            {activeView === "add" && <AddNewAmenity restaurentId={restaurentId} setActiveView={setActiveView} />}
            {activeView === "edit" && <UpdateAmenity restaurentId={restaurentId} setActiveView={setActiveView} editDataId={editDataId} />}

        </>
    );
};

export function AmenitiesListing({ restaurentId, setActiveView, setEditDataId }) {

    const { fetchGetAPI, dataList, fetchingData, query, setQuery, extra } = useFetchGetAPI();
    const { handleDeleteClick, cancelDelete, showDeletePopup, fetchDeleteAPI, deletingData } = useFetchDeleteAPI();

    useEffect(() => {
        fetchGetAPI(API_ENDPOINTS.FETCH_AMENITIES, { restaurentId });
    }, [query]);

    async function confirmDelete() {
        fetchDeleteAPI(API_ENDPOINTS.DELETE_AMENITY, () => { fetchGetAPI(API_ENDPOINTS.FETCH_AMENITIES) });
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
                                <span><MdAdd /></span><span>Add Amenity</span>
                            </div>

                        </button>

                    </div>

                </div>

                {fetchingData ? <LoadingComponent message="Loading Amenities..." /> : null}

                {dataList?.length === 0 && !fetchingData ? <NoDataComponent message="No Amenities Found" /> : null}

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
                                    <th className="px-4 py-2">Icon</th>
                                    <th className="px-4 py-2">Title</th>
                                    <th className="px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm">

                                {dataList.map((amenity) => {
                                    const matched = RESTAURANT_AMENITIES_ENUM.find(item => item.title.toLowerCase() === amenity?.title?.toLowerCase());
                                    const Icon = matched ? matched.icon : null;
                                    return (
                                        <tr key={amenity._id} className="hover:bg-gray-50 transition-colors duration-200 border-b-1 border-gray-400">

                                            <td className={`px-4 py-3 text-center ${query.sortKey === "sno" ? "bg-gray-100" : ""}`}>{amenity.sno < 10 ? "0" + amenity.sno : amenity.sno}</td>
                                            <td className="px-4 py-3">{Icon ? <Icon className="text-2xl text-primary" /> : <span className="text-gray-400">-</span>}</td>
                                            <td className="px-4 py-3">{amenity.title || "N/A"}</td>

                                            <td className="px-4 py-3 align-middle">

                                                <div className="grid grid-cols-2 gap-2 mx-auto w-fit">

                                                    <button onClick={() => { setActiveView("edit"); setEditDataId(amenity._id) }} className="cursor-pointer flex items-center justify-center text-lg text-purple-800 border-2 border-purple-800 p-1 hover:bg-purple-200 " title="Edit">
                                                        <FaEdit />
                                                    </button>

                                                    <button title="Delete" onClick={() => handleDeleteClick(amenity._id)} className="cursor-pointer flex items-center justify-center text-lg text-red-800 border-2 border-red-800 p-1 hover:bg-red-200" >
                                                        <RiDeleteBin7Line />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table > : null}

                </div>

                <div className="lg:hidden">

                    {dataList?.length && !fetchingData ?

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                            {dataList?.map((amenity, index) => {
                                const matched = RESTAURANT_AMENITIES_ENUM.find(item => item.title.toLowerCase() === amenity?.title?.toLowerCase());
                                const Icon = matched ? matched.icon : null;

                                return (
                                    <div key={amenity._id || index} className="border rounded-md border-gray-300 p-5 flex flex-col justify-between">

                                        <div>
                                            <div className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                                                {Icon ? <Icon className="text-3xl text-primary" /> : <span className="text-gray-400">No Icon</span>}
                                            </div>
                                            <h2 className="font-semibold text-xl">S.N: {amenity.sno < 10 ? "0" + amenity.sno : amenity.sno}</h2>
                                            <p className="text-gray-600"><span className="font-semibold text-black">Title:</span> {amenity?.title || "N/A"}</p>
                                        </div>

                                        <div className="flex justify-end">

                                            <div className={`flex gap-2 mt-4`}>
                                                <button onClick={() => { setActiveView("edit"); setEditDataId(amenity._id) }} className="cursor-pointer flex items-center justify-center text-lg text-purple-800 border-2 border-purple-800 p-1 hover:bg-purple-200 " title="Edit" >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    className="cursor-pointer flex items-center justify-center text-lg text-red-800 border-2 border-red-800 p-1 hover:bg-red-200"
                                                    title="Delete"
                                                    onClick={() => handleDeleteClick(amenity._id)}
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

            <ConfirmationPopup show={showDeletePopup} onConfirm={confirmDelete} onCancel={cancelDelete} title="Confirm Deletion" message="Are you sure you want to delete this amenity?" loading={deletingData} confirmText="Yes, Delete" loadingText="Deleting..." />
        </>
    );
};

export function AddNewAmenity({ restaurentId, setActiveView }) {

    const { fetchPostAPI, postingData } = useFetchPostAPI();

    const [formData, setFormData] = useState({
        restaurentId: '',
        sno: '',
        title: '',
    });

    async function handleSubmit(e) {
        e.preventDefault();
        fetchPostAPI(API_ENDPOINTS.ADD_AMENITY, { ...formData, restaurentId }, null, onSuccess);
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

                    <div >
                        <label htmlFor="title" className="form-label">Title</label>
                        <select name="title" id="title" value={formData.title} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input">
                            <option value="">Select Amenity</option>
                            {RESTAURANT_AMENITIES_ENUM.map((amenity) => (
                                <option key={amenity.title} value={amenity.title}>{amenity.title}</option>
                            ))}
                        </select>
                    </div>

                </div>

                <div className="mt-8 flex gap-3">

                    <button onClick={() => setActiveView("list")} className="cursor-pointer px-5 py-2.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>

                    <button onClick={handleSubmit} disabled={postingData} className="cursor-pointer text-white px-4 py-2 rounded-md bg-primary hover:opacity-90">
                        {postingData ? 'Adding...' : 'Add Amenity'}
                    </button>

                </div>

            </form>

        </section>
    );
}

export function UpdateAmenity({ restaurentId, setActiveView, editDataId }) {

    const { fetchPostAPI, postingData } = useFetchPostAPI();
    const { fetchDetailsAPI, fetchingDetails } = useFetchDetailsAPI();

    const [formData, setFormData] = useState({
        restaurentId: '',
        sno: '',
        title: '',
    });

    async function handleSubmit(e) {
        e.preventDefault();
        fetchPostAPI(API_ENDPOINTS.ADD_AMENITY, { ...formData, restaurentId }, null, onSuccess);
    }

    function onSuccess() {
        window.scrollTo(0, 0);
        setActiveView("list");
    }

    useEffect(() => {
        fetchDetailsAPI(API_ENDPOINTS.FETCH_AMENITIES, editDataId, setFormData);
    }, [editDataId]);

    if (fetchingDetails) {
        return <LoadingComponent message="Loading Amenity Details..." />;
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

                    <div >
                        <label htmlFor="title" className="form-label">Title</label>
                        <select name="title" id="title" value={formData.title} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input">
                            <option value="">Select Amenity</option>
                            {RESTAURANT_AMENITIES_ENUM.map((amenity) => (
                                <option key={amenity.title} value={amenity.title}>{amenity.title}</option>
                            ))}
                        </select>
                    </div>

                </div>

                <div className="mt-8 flex gap-3">

                    <button onClick={() => setActiveView("list")} className="cursor-pointer px-5 py-2.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>

                    <button onClick={handleSubmit} disabled={postingData} className="cursor-pointer text-white px-4 py-2 rounded-md bg-primary hover:opacity-90">
                        {postingData ? 'Updating...' : 'Update Amenity'}
                    </button>

                </div>

            </form>

        </section>
    );
}