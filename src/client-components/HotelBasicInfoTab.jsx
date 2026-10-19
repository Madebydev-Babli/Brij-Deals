"use client";

import { useState } from "react";
import { handleInputChange } from "@/utility/utility-function";
import { LOCATION_ENUM } from "@/utility/utility-data";

const emptyHotel = {
    _id: "",
    sno: "",
    slug: "",
    title: "",
    description: "",
    image: "",
    logo: "",
    banner: "",
    location: "",
    shortLocation: "",
    mapLink: "",
    openingTime: "",
    closingTime: "",
    email: "",
    phone: "",
    whatsapp: "",
    googleReview: "",
    rating: "",
    reviewCount: "",
    startingPrice: "",
};

function imageSource(image) {
    if (typeof image === "string") return image;
    return image?.data || image?.url || "";
}

function HotelImageInput({ name, label, image, setFormData }) {
    function handleFileChange(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setFormData((current) => ({
                ...current,
                [name]: { data: reader.result, name: file.name },
            }));
        };
        reader.readAsDataURL(file);
    }

    const source = imageSource(image);

    return (
        <div>
            <label htmlFor={name} className="form-label">{label}</label>
            <input
                type="file"
                id={name}
                name={name}
                accept="image/png,image/jpeg"
                onChange={handleFileChange}
                className="form-input"
                required={!source}
            />
            {source && <img src={source} alt={`${label} preview`} className="mt-2 h-24 w-auto rounded-md object-cover" />}
        </div>
    );
}

export default function HotelBasicInfoTab({ hotel, onSave, postingData = false, submitLabel = "Save Basic Info" }) {
    const [formData, setFormData] = useState(() => {
        if (!hotel) return emptyHotel;
        return {
            ...emptyHotel,
            ...Object.fromEntries(Object.keys(emptyHotel).map((key) => [key, hotel[key] ?? emptyHotel[key]])),
        };
    });

    function handleSubmit(event) {
        event.preventDefault();
        onSave(formData);
    }

    return (
        <section>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="sno" className="form-label">S.No.</label>
                        <input type="number" min="1" id="sno" name="sno" value={formData.sno} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="title" className="form-label">Hotel Title</label>
                        <input required type="text" id="title" name="title" value={formData.title} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="slug" className="form-label">Slug</label>
                        <input type="text" id="slug" name="slug" value={formData.slug} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="shortLocation" className="form-label">Short Location</label>
                        <select required id="shortLocation" name="shortLocation" value={formData.shortLocation} onChange={(event) => handleInputChange(event, setFormData)} className="form-input">
                            <option value="">Select location</option>
                            {LOCATION_ENUM.map((location) => <option key={location} value={location}>{location}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="location" className="form-label">Full Address</label>
                        <input required type="text" id="location" name="location" value={formData.location} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="mapLink" className="form-label">Map Link</label>
                        <input type="text" id="mapLink" name="mapLink" value={formData.mapLink} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="openingTime" className="form-label">Opening Time</label>
                        <input type="text" id="openingTime" name="openingTime" value={formData.openingTime} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="closingTime" className="form-label">Closing Time</label>
                        <input type="text" id="closingTime" name="closingTime" value={formData.closingTime} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input type="text" id="phone" name="phone" value={formData.phone} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="whatsapp" className="form-label">WhatsApp</label>
                        <input type="text" id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="googleReview" className="form-label">Google Review Link</label>
                        <input type="text" id="googleReview" name="googleReview" value={formData.googleReview} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="rating" className="form-label">Rating</label>
                        <input type="number" min="0" max="5" step="0.1" id="rating" name="rating" value={formData.rating} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="reviewCount" className="form-label">Review Count</label>
                        <input type="number" min="0" id="reviewCount" name="reviewCount" value={formData.reviewCount} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="startingPrice" className="form-label">Starting Price</label>
                        <input required type="number" min="0" id="startingPrice" name="startingPrice" value={formData.startingPrice} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
                    <HotelImageInput name="image" label="Main Image" image={formData.image} setFormData={setFormData} />
                    <HotelImageInput name="logo" label="Logo" image={formData.logo} setFormData={setFormData} />
                    <HotelImageInput name="banner" label="Banner" image={formData.banner} setFormData={setFormData} />
                </div>

                <div className="mb-2">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea required id="description" name="description" value={formData.description} onChange={(event) => handleInputChange(event, setFormData)} rows="4" className="form-input" />
                </div>

                <button type="submit" disabled={postingData} className="mt-6 cursor-pointer rounded-md bg-primary px-4 py-2 text-white hover:opacity-90 disabled:opacity-60">
                    {postingData ? "Saving..." : submitLabel}
                </button>
            </form>
        </section>
    );
}
