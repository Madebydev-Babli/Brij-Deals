"use client"

import { useState, useEffect } from "react";
import LoadingComponent from "@/server-components/LoadingComponent";
import { API_ENDPOINTS } from "@/utility/constants";
import { useFetchGetAPI, useFetchPostAPI } from "@/utility/custom-hooks";

export function ScheduleTab({ restaurentId }) {

    const { fetchPostAPI, postingData } = useFetchPostAPI();
    const { fetchGetAPI, dataList, fetchingData, query, setQuery, extra } = useFetchGetAPI();

    const [formData, setFormData] = useState({
        restaurentId: '',
        monday: {
            opening: '',
            closing: ''
        },
        tuesday: {
            opening: '',
            closing: ''
        },
        wednesday: {
            opening: '',
            closing: ''
        },
        thursday: {
            opening: '',
            closing: ''
        },
        friday: {
            opening: '',
            closing: ''
        },
        saturday: {
            opening: '',
            closing: ''
        },
        sunday: {
            opening: '',
            closing: ''
        }
    });

    async function handleSubmit(e) {
        e.preventDefault();
        fetchPostAPI(API_ENDPOINTS.ADD_SCHEDULE, { ...formData, restaurentId }, null);
    }

    useEffect(() => {
        fetchGetAPI(API_ENDPOINTS.FETCH_SCHEDULES, { restaurentId });
    }, [query]);

    useEffect(() => {
        if (dataList && dataList?.length) {
            setFormData(dataList?.[0]);
        }
    }, [dataList])

    if (fetchingData) {
        return <LoadingComponent message="Loading Schedule Details..." />;
    }

    return (
        <>
            <section>

                <form>

                    <div className="gap-8 flex flex-col">

                        <div>

                            <h3 className="font-semibold text-gray-700 mb-2">Monday Schedule</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <div>
                                    <label htmlFor="monday.opening" className="form-label">Opening Time</label>
                                    <input placeholder="Enter the monday opening time" type="time" id="monday.opening" name="monday.opening" value={formData?.monday?.opening} onChange={(e) => { setFormData((prev) => ({ ...prev, monday: { ...prev.monday, opening: e.target.value } })) }} className="form-input" />
                                </div>

                                <div>
                                    <label htmlFor="monday.closing" className="form-label">Closing Time</label>
                                    <input placeholder="Enter the monday closing time" type="time" id="monday.closing" name="monday.closing" value={formData?.monday?.closing} onChange={(e) => { setFormData((prev) => ({ ...prev, monday: { ...prev.monday, closing: e.target.value } })) }} className="form-input" />
                                </div>

                            </div>

                        </div>

                        <div>

                            <h3 className="font-semibold text-gray-700 mb-2">Tuesday Schedule</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <div>
                                    <label htmlFor="tuesday.opening" className="form-label">Opening Time</label>
                                    <input placeholder="Enter the tuesday opening time" type="time" id="tuesday.opening" name="tuesday.opening" value={formData?.tuesday?.opening} onChange={(e) => { setFormData((prev) => ({ ...prev, tuesday: { ...prev.tuesday, opening: e.target.value } })) }} className="form-input" />
                                </div>

                                <div>
                                    <label htmlFor="tuesday.closing" className="form-label">Closing Time</label>
                                    <input placeholder="Enter the tuesday closing time" type="time" id="tuesday.closing" name="tuesday.closing" value={formData?.tuesday?.closing} onChange={(e) => { setFormData((prev) => ({ ...prev, tuesday: { ...prev.tuesday, closing: e.target.value } })) }} className="form-input" />
                                </div>

                            </div>

                        </div>

                        <div>

                            <h3 className="font-semibold text-gray-700 mb-2">Wednesday Schedule</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <div>
                                    <label htmlFor="wednesday.opening" className="form-label">Opening Time</label>
                                    <input placeholder="Enter the wednesday opening time" type="time" id="wednesday.opening" name="wednesday.opening" value={formData?.wednesday?.opening} onChange={(e) => { setFormData((prev) => ({ ...prev, wednesday: { ...prev.wednesday, opening: e.target.value } })) }} className="form-input" />
                                </div>

                                <div>
                                    <label htmlFor="wednesday.closing" className="form-label">Closing Time</label>
                                    <input placeholder="Enter the wednesday closing time" type="time" id="wednesday.closing" name="wednesday.closing" value={formData?.wednesday?.closing} onChange={(e) => { setFormData((prev) => ({ ...prev, wednesday: { ...prev.wednesday, closing: e.target.value } })) }} className="form-input" />
                                </div>

                            </div>

                        </div>

                        <div>

                            <h3 className="font-semibold text-gray-700 mb-2">Thursday Schedule</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <div>
                                    <label htmlFor="thursday.opening" className="form-label">Opening Time</label>
                                    <input placeholder="Enter the thursday opening time" type="time" id="thursday.opening" name="thursday.opening" value={formData?.thursday?.opening} onChange={(e) => { setFormData((prev) => ({ ...prev, thursday: { ...prev.thursday, opening: e.target.value } })) }} className="form-input" />
                                </div>

                                <div>
                                    <label htmlFor="thursday.closing" className="form-label">Closing Time</label>
                                    <input placeholder="Enter the thursday closing time" type="time" id="thursday.closing" name="thursday.closing" value={formData?.thursday?.closing} onChange={(e) => { setFormData((prev) => ({ ...prev, thursday: { ...prev.thursday, closing: e.target.value } })) }} className="form-input" />
                                </div>

                            </div>

                        </div>

                        <div>

                            <h3 className="font-semibold text-gray-700 mb-2">Friday Schedule</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <div>
                                    <label htmlFor="friday.opening" className="form-label">Opening Time</label>
                                    <input placeholder="Enter the friday opening time" type="time" id="friday.opening" name="friday.opening" value={formData?.friday?.opening} onChange={(e) => { setFormData((prev) => ({ ...prev, friday: { ...prev.friday, opening: e.target.value } })) }} className="form-input" />
                                </div>

                                <div>
                                    <label htmlFor="friday.closing" className="form-label">Closing Time</label>
                                    <input placeholder="Enter the friday closing time" type="time" id="friday.closing" name="friday.closing" value={formData?.friday?.closing} onChange={(e) => { setFormData((prev) => ({ ...prev, friday: { ...prev.friday, closing: e.target.value } })) }} className="form-input" />
                                </div>

                            </div>

                        </div>

                        <div>

                            <h3 className="font-semibold text-gray-700 mb-2">Saturday Schedule</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <div>
                                    <label htmlFor="saturday.opening" className="form-label">Opening Time</label>
                                    <input placeholder="Enter the saturday opening time" type="time" id="saturday.opening" name="saturday.opening" value={formData?.saturday?.opening} onChange={(e) => { setFormData((prev) => ({ ...prev, saturday: { ...prev.saturday, opening: e.target.value } })) }} className="form-input" />
                                </div>

                                <div>
                                    <label htmlFor="saturday.closing" className="form-label">Closing Time</label>
                                    <input placeholder="Enter the saturday closing time" type="time" id="saturday.closing" name="saturday.closing" value={formData?.saturday?.closing} onChange={(e) => { setFormData((prev) => ({ ...prev, saturday: { ...prev.saturday, closing: e.target.value } })) }} className="form-input" />
                                </div>

                            </div>

                        </div>

                        <div>

                            <h3 className="font-semibold text-gray-700 mb-2">Sunday Schedule</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <div>
                                    <label htmlFor="sunday.opening" className="form-label">Opening Time</label>
                                    <input placeholder="Enter the sunday opening time" type="time" id="sunday.opening" name="sunday.opening" value={formData?.sunday?.opening} onChange={(e) => { setFormData((prev) => ({ ...prev, sunday: { ...prev.sunday, opening: e.target.value } })) }} className="form-input" />
                                </div>

                                <div>
                                    <label htmlFor="sunday.closing" className="form-label">Closing Time</label>
                                    <input placeholder="Enter the sunday closing time" type="time" id="sunday.closing" name="sunday.closing" value={formData?.sunday?.closing} onChange={(e) => { setFormData((prev) => ({ ...prev, sunday: { ...prev.sunday, closing: e.target.value } })) }} className="form-input" />
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="mt-8 flex gap-3">

                        <button onClick={handleSubmit} disabled={postingData} className="cursor-pointer text-white px-4 py-2 rounded-md bg-primary hover:opacity-90">
                            {postingData ? 'Updating...' : 'Update Schedule'}
                        </button>

                    </div>

                </form>

            </section >

        </>
    );
};