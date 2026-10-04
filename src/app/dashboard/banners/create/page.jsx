"use client"

import { useState } from "react";
import { API_ENDPOINTS } from "@/utility/constants";
import Image from "next/image";
import { useFetchPostAPI } from "@/utility/custom-hooks";
import { handleImageChange, handleInputChange } from "@/utility/utility-function";

export default function AddNewBannerPage() {

    const { fetchPostAPI, postingData } = useFetchPostAPI();

    const [formData, setFormData] = useState({
        sno: '',
        title: '',
        image: '',
        link: '',
        button: '',
        description: '',
    });

    async function handleSubmit(e) {
        e.preventDefault();
        fetchPostAPI(API_ENDPOINTS.ADD_BANNER, formData, '/dashboard/banners');
    }

    return (
        <section>

            <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label htmlFor="sno" className="form-label">S.No.</label>
                        <input placeholder="Enter the serial number" type="text" id="sno" name="sno" value={formData.sno} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                        <p className="gray-600 text-xs">Leave this field empty if you want to add the Image in the last</p>
                    </div>

                    <div>
                        <label htmlFor="title" className="form-label">Title</label>
                        <input placeholder="Enter the banner title" type="text" id="title" name="title" value={formData.title} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                    </div>

                    <div>
                        <label htmlFor="button" className="form-label">Button Text</label>
                        <input placeholder="Enter the banner button text" type="text" id="button" name="button" value={formData.button} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="link" className="form-label">Link</label>
                        <input placeholder="Enter the banner link" type="text" id="link" name="link" value={formData.link} onChange={(e) => { handleInputChange(e, setFormData) }} className="form-input" />
                    </div>

                </div>

                <div className="mb-4">
                    <label htmlFor="image" className="form-label">Image</label>
                    <input type="file" id="image" name="image" accept="image/*" onChange={(e) => { handleImageChange(e, setFormData) }} className="form-input" />
                    {formData.image && typeof formData.image === 'string' && formData.image.startsWith('data:image') && (
                        <Image src={formData.image} alt="Current Banner Image" width={100} height={100} className="mt-2 object-cover rounded-md" />
                    )}
                </div>

                <div className="mb-2">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea placeholder="Enter the description" id="description" name="description" value={formData.description} onChange={(e) => { handleInputChange(e, setFormData) }} rows="2" className="form-input"></textarea>
                </div>

                <div className="mt-6">
                    <button type="submit" disabled={postingData} className="cursor-pointer text-white px-4 py-2 rounded-md bg-primary hover:opacity-90">
                        {postingData ? 'Adding...' : 'Add Banner'}
                    </button>
                </div>

            </form>

        </section>
    );
};