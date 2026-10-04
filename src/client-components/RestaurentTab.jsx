"use client"

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/utility/constants";
import Image from "next/image";
import LoadingComponent from "@/server-components/LoadingComponent";
import { LOCATION_ENUM, RESTAURANT_CATEGORIES_ENUM } from "@/utility/utility-data";
import { useFetchDetailsAPI, useFetchPostAPI } from "@/utility/custom-hooks";
import { handleImageChange, handleInputChange } from "@/utility/utility-function";

export default function EditRestaurentTab({ _id, setActiveTab }) {

    const { fetchPostAPI, postingData } = useFetchPostAPI();
    const { fetchDetailsAPI, fetchingDetails } = useFetchDetailsAPI();

    const [formData, setFormData] = useState({
        sno: '',
        title: '',
        category: '',
        description: '',
        logo: '',
        banner: '',
        mapLink: '',
        location: '',
        shortLocation: '',
        email: '',
        phone: '',
        isVeg: true,
    });

    async function handleSubmit(e) {
        e.preventDefault();
        fetchPostAPI(API_ENDPOINTS.ADD_RESTAURENT, formData, null, onSuccess);
    }

    function onSuccess() {
        window.scrollTo(0, 0);
        setActiveTab("offers");
    }

    useEffect(() => {
        fetchDetailsAPI(API_ENDPOINTS.FETCH_RESTAURENTS, _id, setFormData);
    }, [_id]);

    if (fetchingDetails) {
        return <LoadingComponent message="Loading Restaurant Details..." />;
    }

    return (
        <>

            <section>

                <form onSubmit={handleSubmit}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                        <div>
                            <label htmlFor="sno" className="form-label">S.No.</label>
                            <input placeholder="Enter the serial number" type="text" id="sno" name="sno" value={formData.sno} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                            <p className="gray-600 text-xs">Leave this field empty if you want to add the Restaurant in the last</p>
                        </div>

                        <div>
                            <label htmlFor="title" className="form-label">Title</label>
                            <input placeholder="Enter the restaurant title" type="text" id="title" name="title" value={formData.title} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                        </div>

                        <div>
                            <label htmlFor="category" className="form-label">Category</label>
                            <select id="category" name="category" value={formData.category} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input">
                                <option value="">Select Category</option>
                                {RESTAURANT_CATEGORIES_ENUM.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="shortLocation" className="form-label">Short Location (City)</label>
                            <select id="shortLocation" name="shortLocation" value={formData.shortLocation} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input">
                                <option value="">Select Location</option>
                                {LOCATION_ENUM.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="location" className="form-label">Full Location/Address</label>
                            <input placeholder="Enter the full restaurant address" type="text" id="location" name="location" value={formData.location} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                        </div>

                        <div>
                            <label htmlFor="mapLink" className="form-label">Map Link</label>
                            <input placeholder="Enter the Google Maps link" type="text" id="mapLink" name="mapLink" value={formData.mapLink} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                        </div>

                        <div>
                            <label htmlFor="email" className="form-label">Email</label>
                            <input placeholder="Enter the email address" type="email" id="email" name="email" value={formData.email} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                        </div>

                        <div>
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input placeholder="Enter the phone number" type="text" id="phone" name="phone" value={formData.phone} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                        </div>

                        <div>
                            <label htmlFor="isVeg" className="form-label">Food Type</label>
                            <select id="isVeg" name="isVeg" value={formData.isVeg.toString()} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input">
                                <option value="true">Veg</option>
                                <option value="false">Non-Veg / Both</option>
                            </select>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                        <div>
                            <label htmlFor="logo" className="form-label">Logo</label>
                            <input type="file" id="logo" name="logo" accept="image/*" onChange={(e) => { handleImageChange(e, setFormData) }} className="form-input" />
                            {formData.logo && typeof formData.logo === 'string' && (
                                <Image src={formData.logo} alt="Restaurant Logo Preview" width={100} height={100} className="mt-2 object-cover rounded-md" />
                            )}
                        </div>

                        <div>
                            <label htmlFor="banner" className="form-label">Banner</label>
                            <input type="file" id="banner" name="banner" accept="image/*" onChange={(e) => { handleImageChange(e, setFormData) }} className="form-input" />
                            {formData.banner && typeof formData.banner === 'string' && (
                                <Image src={formData.banner} alt="Restaurant Banner Preview" width={100} height={100} className="mt-2 object-cover rounded-md" />
                            )}
                        </div>

                    </div>

                    <div className="mb-2">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea placeholder="Enter the description" id="description" name="description" value={formData.description} onChange={(e) => { handleInputChange(e, setFormData) }} rows="4" className="form-input"></textarea>
                    </div>

                    <div className="mt-6">
                        <button type="submit" disabled={postingData} className="cursor-pointer text-white px-4 py-2 rounded-md bg-primary hover:opacity-90">
                            {postingData ? 'Updating...' : 'Update Restaurant'}
                        </button>
                    </div>

                </form>

            </section>

        </>
    );
};