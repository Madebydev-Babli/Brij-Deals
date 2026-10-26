"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { handleInputChange } from "@/utility/utility-function";
import { LOCATION_ENUM } from "@/utility/utility-data";
import {
    IMAGE_UPLOAD_MESSAGES,
    getImageFileValidationMessage,
} from "@/utility/image-upload";

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

        const validationMessage = getImageFileValidationMessage(file);
        if (validationMessage) {
            toast.error(validationMessage, { position: "top-right" });
            event.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setFormData((current) => ({
                ...current,
                [name]: { data: reader.result, name: file.name },
            }));
        };
        reader.onerror = () => {
            toast.error(IMAGE_UPLOAD_MESSAGES.unexpected, { position: "top-right" });
            event.target.value = "";
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
        const requiredFields = ["title", "slug", "shortLocation"];
        for (const name of requiredFields) {
            const field = event.currentTarget.elements.namedItem(name);
            field.setCustomValidity(formData[name]?.trim() ? "" : `${name} is required`);
        }

        if (!formData.sno || !Number.isInteger(Number(formData.sno)) || Number(formData.sno) < 1) {
            event.currentTarget.elements.namedItem("sno").setCustomValidity("S.No. must be a positive integer");
        } else {
            event.currentTarget.elements.namedItem("sno").setCustomValidity("");
        }

        if (!event.currentTarget.reportValidity()) return;

        onSave({
            ...formData,
            sno: Number(formData.sno),
            title: formData.title.trim(),
            slug: formData.slug.trim(),
            shortLocation: formData.shortLocation.trim(),
        });
    }

    function handleFormInputChange(event) {
        event.currentTarget.setCustomValidity("");
        handleInputChange(event, setFormData);
    }

    return (
        <section>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="sno" className="form-label">S.No. <span className="text-red-600">*</span></label>
                        <input required type="number" min="1" step="1" placeholder="Enter the serial number" id="sno" name="sno" value={formData.sno} onChange={handleFormInputChange} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="title" className="form-label">Hotel Title <span className="text-red-600">*</span></label>
                        <input required type="text" placeholder="Enter the hotel title" id="title" name="title" value={formData.title} onChange={handleFormInputChange} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="slug" className="form-label">Slug <span className="text-red-600">*</span></label>
                        <input required type="text" placeholder="Enter the hotel slug" id="slug" name="slug" value={formData.slug} onChange={handleFormInputChange} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="shortLocation" className="form-label">Short Location <span className="text-red-600">*</span></label>
                        <select required id="shortLocation" name="shortLocation" value={formData.shortLocation} onChange={handleFormInputChange} className="form-input">
                            <option value="">Select location</option>
                            {LOCATION_ENUM.map((location) => <option key={location} value={location}>{location}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="location" className="form-label">Full Address</label>
                        <input type="text" placeholder="Enter the full hotel address" id="location" name="location" value={formData.location} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="mapLink" className="form-label">Map Link</label>
                        <input type="text" placeholder="Enter the Google Maps link" id="mapLink" name="mapLink" value={formData.mapLink} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="openingTime" className="form-label">Opening Time</label>
                        <input type="text" placeholder="Enter opening time" id="openingTime" name="openingTime" value={formData.openingTime} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="closingTime" className="form-label">Closing Time</label>
                        <input type="text" placeholder="Enter closing time" id="closingTime" name="closingTime" value={formData.closingTime} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" placeholder="Enter the email address" id="email" name="email" value={formData.email} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input type="text" placeholder="Enter the phone number" id="phone" name="phone" value={formData.phone} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="whatsapp" className="form-label">WhatsApp</label>
                        <input type="text" placeholder="Enter the WhatsApp number" id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="googleReview" className="form-label">Google Review Link</label>
                        <input type="text" placeholder="Enter the Google review link" id="googleReview" name="googleReview" value={formData.googleReview} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="rating" className="form-label">Rating</label>
                        <input type="number" min="0" max="5" step="0.1" placeholder="Enter a rating from 0 to 5" id="rating" name="rating" value={formData.rating} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="reviewCount" className="form-label">Review Count</label>
                        <input type="number" min="0" placeholder="Enter the number of reviews" id="reviewCount" name="reviewCount" value={formData.reviewCount} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="startingPrice" className="form-label">Starting Price</label>
                        <input type="number" min="0" placeholder="Enter the starting price" id="startingPrice" name="startingPrice" value={formData.startingPrice} onChange={(event) => handleInputChange(event, setFormData)} className="form-input" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
                    <HotelImageInput name="image" label="Main Image" image={formData.image} setFormData={setFormData} />
                    <HotelImageInput name="logo" label="Logo" image={formData.logo} setFormData={setFormData} />
                    <HotelImageInput name="banner" label="Banner" image={formData.banner} setFormData={setFormData} />
                </div>

                <div className="mb-2">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea placeholder="Enter the hotel description" id="description" name="description" value={formData.description} onChange={(event) => handleInputChange(event, setFormData)} rows="4" className="form-input" />
                </div>

                <button type="submit" disabled={postingData} className="mt-6 cursor-pointer rounded-md bg-primary px-4 py-2 text-white hover:opacity-90 disabled:opacity-60">
                    {postingData ? "Saving..." : submitLabel}
                </button>
            </form>
        </section>
    );
}
